(() => {
    'use strict';

    const Item = setup.Item;

    function isUnique (id) {
        return Item.has(id) && Item.get(id).unique;
    }

    function isPermanent (id) {
        return Item.has(id) && Item.get(id).permanent;
    }

    function isValidItemId (id) {
        return id && typeof id === 'string' && id.trim();
    }

    class Inventory {
        // new Inventory([data] [, tags])
        constructor(items = {}, tags = []) {
            this.data = clone(items);
            this.tags = tags instanceof Array ? tags : 
                typeof tags === 'string' ? [ tags ] : [];
        }

        // Inventory.change(instance, itemID, numberOfItems [, invert])
        // undocumented helper
        static change (dataOrInv, item, num = 1, invert = false) {

            // sanity checks
            if (num === 0) {
                return; // no changes
            }
            if (dataOrInv instanceof Inventory) {
                dataOrInv = dataOrInv.data;
            }
            if (typeof dataOrInv !== 'object') {
                if (!dataOrInv) {
                    dataOrInv = {};
                } else {
                    throw new TypeError('cannot access inventory data');
                }
            }
            if (!isValidItemId(item)) {
                throw new TypeError('invalid item name/id');
            }
            if (typeof num !== 'number' || Number.isNaN(num) || !Number.isInteger(num)) {
                num = 1;
            }


            if (invert) {
                num *= -1; 
            }

            if (num > 0) {
                // add items
                if (Object.keys(dataOrInv).includes(item) && isUnique(item)) {
                    return; // item is unique, can't be added.
                }

                if (!Object.keys(dataOrInv).includes(item)) {
                    dataOrInv[item] = 0;
                }

                dataOrInv[item] += num;

            } else {
                // remove items
                if (isPermanent(item)) {
                    return; // item is permanent, can't be dropped
                }

                if (Object.keys(dataOrInv).includes(item) && typeof dataOrInv[item] === 'number') {
                    dataOrInv[item] += num;  // add it because it should alread be negative
                }

                if (dataOrInv[item] <= 0) {
                    delete dataOrInv[item];
                }

            }


            return dataOrInv;
        }

        // turn object or inventory into "itemset" to merge/unmerge
        // undocumented helper
        static itemset (object = {}) {
            // preps object/inventory instance as an item set
            if (Inventory.is(object)) {
                object = object.data;
            }
            if (typeof object !== 'object') {
                return {};
            }
            const ret = {};
            Object.keys(object).forEach(prop => {
                if (typeof object[prop] === 'number' && Number.isInteger(object[prop]) && object[prop] !== 0) {
                    ret[prop] = object[prop];
                }
            });
            return ret;
        }

        // parse array of itemID/number pairs into an object to use as an itemset
        // undocumented helper
        static parseArgList () {
            const args = [].slice.call(arguments).flat(Infinity);
            // every "entry" should be a string followed by a number
            if (args.length % 2 !== 0) {
            // check the pairs are even
                throw new Error('item sets should be pairs of item IDs and numbers');
            }
            var map = {};

            args.forEach(function(item, idx) {
                // even val (0, 2, 4, etc) is paired with the next value
                if (idx % 2 === 0) {
                   map[item] = args[idx + 1];
                }
            });

            return map;
        }

        // Inventory.is(thing) determines if thing is an inventory instance
        static is (thing) {
            return thing instanceof Inventory; 
        }

        static emit (type, inv, opts = {}) {
            $(document).trigger(Object.assign({
                type : ':inventory-' + type + '.simple-inventory',
                inventory : inv,
                target : null,
                delta : {},
                item : null
            }, opts));
        }

        // Inventory.create([data] [, tags]) create and return a new inventory instance
        static create (items, tags) {
            return new Inventory (items, tags);
        }

        // emit events
        // undocumented helper
        emit (type, opts = {}) {
            Inventory.emit(type, this, opts);
            return this;
        }

        // inventory#array -> return items as an array, duplicates are individual entries
        get array () {
            // get array of items in inventory, with duplicates
            const arr = [];
            Object.keys(this.data).forEach(i => {
                arr.push(i);
                if (this.data[i] > 1) {
                    for (var idx = 1; idx < this.data[i]; idx++) {
                        arr.push(i);
                    }
                }
            });
            return arr;
        }

        // inventory#list -> return items as an array, with no duplicates
        get list () {
            // get array of items, no duplicates
            return Object.keys(this.data);
        }

        // inventory#length -> total number of items in the inventory
        get length () {
            return this.array.length;
        }

        // inventory#uniqueLength -> total number of unique items in the inventory
        get uniqueLength () {
            return this.list.length;
        }

        // inventory#table -> returns object data for inventory
        get table () {
            return this.data;
        }

        // inventory#count(itemID) -> returns stack of items in the inventory
        count (id) {
            if (!id) {
                return this.length;
            }
            return this.data[id] || 0;
        }

        // inventory#has(itemID [, amount]) -> returns true if the inventory contains an item in the indicated amount, default 1
        has (item, amt = 1) {
            // has amt or more (default 1) of the indicated item
            return this.data[item] >= amt;
        }

        // inventory#hasAll(...itemsIDs) -> returns true if the inventory contains at least one of all the indicated items
        hasAll () {
            // has at least one of all of the indicated items
            const self = this;
            const items = [].slice.call(arguments).flat(Infinity);
            return items.every(i => self.has(i));
        }

        // inventory#hasAny(...itemsIDs) -> returns true if the inventory contains at least one of any one of the indicated items
        hasAny () {
            // has at least one of any of the indicated items
            const self = this;
            const items = [].slice.call(arguments).flat(Infinity);
            return items.some(i => self.has(i));
        }

        // inventory#merge(invOrObject) -> merges the provided object/inventory into the inventory instance
        merge (obj) {
            const self = this;
            const items = Inventory.itemset(obj);
            Object.keys(items).forEach(i => { 
                Inventory.change(self, i, items[i]);
            });
            return obj;
        }

        // inventory#unmerge(invOrObject) -> unmerges (removes) the provided object/inventory into the inventory instance
        mergeunmerge (obj) {
            // returns delta
            const self = this;
            const ret = {};
            const items = Inventory.itemset(obj);
            Object.keys(items).forEach(i => {
                if (self.has(i, items[i])) {
                    ret[i] = items[i];
                } else if (self.has(i)) {
                    ret[i] = self.count(i);
                }
                Inventory.change(self, i, items[i], true);
            });
            return ret;
        }

        // inventory#pickup(item, amount [, item , amount. ...]) -> adds the indicated items in the indicated amounts
        mergepickup () {
            const delta = this.merge(Inventory.parseArgList.apply(null, arguments));
            this.emit('update', { delta });
            return this;
        }

        // inventory#drop(item, amount [, item , amount. ...]) -> remvoes the indicated items in the indicated amounts
        drop () {
            const delta = this.unmerge(Inventory.parseArgList.apply(null, arguments));
            this.emit('update', { delta });
            return this;
        }

        // inventory#empty() -> removes all items from the inventory
        empty () {
            const delta = clone(this.data);
            this.data = {};
            this.emit('update', { delta });
        }

        // inventory#transfer(targetInv, item, amount [, item , amount. ...]) -> transfers the indicated items in the indicated amounts from 
        // the current inventory to the target inventory
        transfer (target) {
            const items = Inventory.parseArgList.apply(null, [].slice.call(arguments).slice(1));
            if (!Inventory.is(target)) {
                throw new TypeError('target inventory is not an inventory instance');
            }

            // only items in the inventory are actually transferred over
            const have = this.unmerge(items);
            target.merge(have);

            this.emit('update', { target, delta : have });
            return this;
        }

        // inventory#isEmpty() -> returns true if the inventory is totally empty
        isEmpty () {
            return this.length === 0;
        }

        // inventory#itrate(callback) -> runs the callback for each item in the inventory
        iterate (cb) {
            if (typeof cb !== 'function') {
                return this;
            }
            this.list.forEach(i => {
                // callback(id, amt)
                cb(i, this.data[i]);
            });
            return this;
        }

        // inventory#use(itemID) -> uses the item, which runs the item's use callback and, if it's consumable, removes it
        use (id) {
            if (!Item.has(id)) {
                return; // cannot use undefined items
            }
            const item = Item.get(id);
            item.use();
            if (item.consumable) {
                Inventory.change(this, id, 1, true);
                const delta = {};
                delta[id] = 1;
                this.emit('update', { delta });
            }
            this.emit('use', { item });
            return this;
        }

        // undocumented UI helper
        inspectLink (id, text = "Inspect", button = false) {
            return $(document.createElement(button ? 'button' : 'a'))
                .addClass('inspect-link', 'simple-inventory')
                .wiki(text)
                .ariaClick(() => {
                    Item.get(id).inspect();
                });
        }

        // undocumented UI helper
        useLink (id, text = "Use", button = false) {
            const self = this;
            return $(document.createElement(button ? 'button' : 'a'))
                .addClass('use-link', 'simple-inventory')
                .wiki(text)
                .ariaClick(() => {
                    self.use(id);
                });
        }

        // undocumented UI helper
        dropLink (id, text, button = false, target = null) {
            const self = this;
            return $(document.createElement(button ? 'button' : 'a'))
                .addClass('drop-link', 'simple-inventory')
                .wiki(text ? text : target ? "Give" : "Drop")
                .ariaClick(() => {
                    if (target && Inventory.is(target)) {
                        self.transfer(target, id);
                    } else {
                        self.drop(id);
                    }
                });
        }

        // undocumented UI helper
        itemCount (id, pre = "&nbsp;&times;&nbsp;", post = "&nbsp;") {
            return $(document.createElement('span'))
                .addClass('item-count', 'simple-inventory')
                .append( "" + pre + (this.count(id) || 0) + post );
        }

        // undocumented UI helper
        displayInventoryList (options = {
            description : true,
            use : true,
            transfer : null,
            drop : true,
            dropActionText : ''
        }) {
            const self = this;
            const $list = $(document.createElement('ul')).addClass('simple-inventory-list');
            const $entries = this.list.map(id => {

                const appendMe = [];

                if (options.description && Item.has(id) && Item.get(id).description) {
                    appendMe.push(self.inspectLink(id, Item.has(id) ? Item.get(id).name : id));
                } else {
                    appendMe.push($(document.createElement('span')).append(Item.has(id) ? Item.get(id).name : id).addClass('item-name'));
                }

                appendMe.push(self.itemCount(id));

                if (options.use && Item.has(id) && Item.get(id).handler) {
                    appendMe.push(self.useLink(id));
                } else {
                    appendMe.push($(document.createElement('span')).addClass('spacer'));
                }

                if (((options.transfer && Inventory.is(options.transfer)) || options.drop) && !isPermanent(id)) {
                    appendMe.push(self.dropLink(id, options.dropActionText, false, options.target || null));
                } else {
                    appendMe.push($(document.createElement('span')).addClass('spacer'));
                }

                return $(document.createElement('li'))
                    .append(appendMe)
                    .addClass('simple-inventory-listing');
            });

            $list.append($entries);
            return $list;
        }

        // constructs inventory interface
        // very opinionated by necessity
        // include resipes for different UIs in docs
        interface (opts = {}, target = null) {
            const self = this;

            const $wrapper = $(document.createElement('div')).addClass('simple-inventory-wrapper');
            $wrapper.append(this.displayInventoryList(opts));

            $(document).on(':inventory-update.simple-inventory.gui-built-in', () => {
                if ($wrapper.length) {
                    $wrapper.empty().append(this.displayInventoryList(opts));
                } else {
                    $(document).off(':inventory-update.simple-inventory.gui-built-in');
                }
            });

            let $target;

            if (target && target instanceof $) {
                $target = target;
            } else if (target) {
                $target = $(target);
            }

            if ($target) {
                $wrapper.appendTo($target);
            }

            return $wrapper;
        }

        // for SC state
        clone () {
            return new Inventory(this.data || {}, this.tags || []);
        }

        // for SC state
        toJSON () {
            return JSON.reviveWrapper('new setup.Inventory(' + JSON.stringify(this.data) + ', ' + JSON.stringify(this.tags)  + ')');
        }
    }

    function isValidVariable (varName) {
        return varName && typeof varName === 'string' && varName.length > 2 && (varName[0] === '$' || varName[0] === '_');
    }

    function getInv (inv) {
        if (isValidVariable(inv)) {
            inv = State.getVar(inv);
        }
        if (Inventory.is(inv)) {
            return inv;
        }
    }

    // <<newinv '$varName' [tags]>>
    Macro.add('newinv', {
        handler () {
            const varName = this.args.raw.trim().split(' ').first().replace(/["']/g, '').trim();
            if (!isValidVariable(varName)) {
                return this.error('argument must be a story or temporary variable!');
            }
            State.setVar(varName, new Inventory({}, this.args.flat(Infinity).slice(1)));
        }
    });

    // <<pickup $inventory item num ...>>
    Macro.add('pickup', {
        handler () {
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            if (this.args.length < 3) {
                return this.error('no items to pick up were provided');
            }

            inv.pickup(this.args.slice(1));
        }
    });

    // <<drop $inventory item num ...>>
    Macro.add('drop', {
        handler () {
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            if (this.args.length < 3) {
                return this.error('no items to drop were provided');
            }

            inv.drop(this.args.slice(1));
        }
    });

    // <<transfer $inventory $target item [num] ...>>
    // <<merge $inventory $target>>
    // <<unmerge $inventory $target>>
    Macro.add(['transfer', 'merge', 'unmerge'], {
        handler () {
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            const target = getInv(this.args[1]);
            if (!target) {
                return this.error('second argument must be a valid inventory!');
            }

            if (this.name === 'merge') {
                inv.merge(target);
            } else if (this.name === 'unmerge') {
                inv.unmerge(target);
            } else {
                if (this.args.length < 4) {
                    return this.error('no items to transfer were provided');
                }
                inv.transfer(target, this.args.slice(2));
            }
        }
    });

    // <<inv $inventory [$target] [flags]>>
    // <<take $inventory $target [flags]>>
    // <<give $inventory $target [flags]>>
    Macro.add(['inv', 'take', 'give'], {
        handler () {
            let target = null;
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            if (this.args[1] && getInv(this.args[1])) {
                target = getInv(this.args[1]);
            }

            const options = {
                description : this.args.includesAny('inspect', 'description'),
                use : this.args.includes('use'),
                transfer : target,
                drop : this.args.includes('drop'),
                dropActionText : this.name === 'inv' ? 'Drop' : this.name.toUpperFirst()
            };

            inv.interface(options, $(this.output));
        }
    });

    setup.Inventory = Inventory;
    window.Inventory = window.Inventory || Inventory;

})();