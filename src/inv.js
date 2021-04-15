(() => {
    'use strict';

    /* globals Item */

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
        constructor(items = {}, tags = []) {
            this.data = clone(items);
            this.tags = tags instanceof Array ? tags : 
                typeof tags === 'string' ? [ tags ] : [];
        }

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

        static itemset (object = {}) {
            // preps object as an item set
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

        static is (thing) {
            return thing instanceof Inventory; 
        }

        static emit (type, inv, target = null, item = undefined) {
            $(document).trigger({
                type : ':inventory-' + type + '.simple-inventory',
                inventory : inv,
                target,
                item : (type === 'use' && item) ? item : undefined
            });
        }

        static add (items, tags) {
            return new Inventory (items, tags);
        }

        emit (type, target = null, item = undefined) {
            Inventory.emit(type, this, target, item);
            return this;
        }

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

        get list () {
            // get array of items, no duplicates
            return Object.keys(this.data);
        }

        get length () {
            return this.array.length;
        }

        get uniqueLength () {
            return this.list.length;
        }

        get table () {
            return this.data;
        }

        count (id) {
            if (!id) {
                return this.length;
            }
            return this.data[id] || 0;
        }

        has (item, amt = 1) {
            return this.data[item] >= amt;
        }

        hasAll () {
            const self = this;
            const items = [].slice.call(arguments).flat(Infinity);
            return items.every(i => self.has(i));
        }

        pickUp (item, num) {
            const success = Inventory.change(this, item, num);
            if (success) {
                this.emit('update');
            }
            return this;
        }

        drop (item, num) {
            const success = Inventory.change(this, item, num, true);
            if (success) {
                this.emit('update');
            }
            return this;
        }

        transfer (target, item, num) {
            const self = this;
            if (!Inventory.is(target)) {
                throw new TypeError('target inventory is not an inventory instance');
            }
            if (this.has(item)) {
                const success1 = Inventory.change(this, item, num, true); // drop
                const success2 = Inventory.change(target, item, num); // pick up
                if (success1 || success2) {
                    this.emit('update');
                }
            }
            return this;
        }

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

        merge (obj) {
            const self = this;
            const items = Inventory.itemset(obj);
            Object.keys(items).forEach(i => { 
                Inventory.change(self, i, items[i]);
            });
        }

        use (id) {
            if (!Item.has(id)) {
                return; // cannot use undefined items
            }
            const item = Item.get(id);
            item.use();
            if (item.consumable) {
                Inventory.change(this, id, 1, true);
                this.emit('update');
            }
            this.emit('use', null, item);
            return this;
        }

        inspectLink (id, text = "Inspect", button = false) {
            return $(document.createElement(button ? 'button' : 'a'))
                .addClass('inspect-link', 'simple-inventory')
                .wiki(text)
                .ariaClick(() => {
                    Item.get(id).inspect();
                });
        }

        useLink (id, text = "Use", button = false) {
            const self = this;
            return $(document.createElement(button ? 'button' : 'a'))
                .addClass('use-link', 'simple-inventory')
                .wiki(text)
                .ariaClick(() => {
                    self.use(id);
                });
        }

        dropLink (id, text, button = false, target = null) {
            const self = this;
            return $(document.createElement(button ? 'button' : 'a'))
                .addClass('drop-link', 'simple-inventory')
                .wiki(text || target ? "Give" : "Drop")
                .ariaClick(() => {
                    if (target && Inventory.is(target)) {
                        self.transfer(target, id);
                    } else {
                        self.drop(id);
                    }
                });
        }

        itemCount (id, pre = "&nbsp;&times;&nbsp;", post = "&nbsp;") {
            return $(document.createElement('span'))
                .addClass('item-count', 'simple-inventory')
                .append( "" + pre + (this.count(id) || 0) + post );
        }

        displayInventoryList (options = {
            description : true,
            use : true,
            transfer : null,
            drop : true
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
                }

                if ((options.transfer || options.drop) && !isPermanent(id)) {
                    self.dropLink(id, '', false, options.target);
                }

                return $(document.createElement('li'))
                    .append(appendMe)
                    .addClass('simple-inventory-listing');
            });

            $list.append($entries);
            return $list;
        }

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

        clone () {
            return new Inventory(this.data || {}, this.tags || []);
        }

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
            if (!isValidVariable(this.args[0])) {
                return this.error('argument must be the quoted name of a story variable or temporary variable!');
            }
            State.setVar(this.args[0], new Inventory({}, this.args.flat(Infinity).slice(1)));
        }
    });

    // <<pickup $inventory item [num]>>

    Macro.add('pickup', {
        handler () {
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            inv.pickUp(this.args[1], this.args[2]);
        }
    });

    // <<drop $inventory item [num]>>

    Macro.add('drop', {
        handler () {
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            inv.drop(this.args[1], this.args[2]);
        }
    });

    // <<transfer $inventory $target item [num]>>

    Macro.add('transfer', {
        handler () {
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            const target = getInv(this.args[1]);
            if (!target) {
                return this.error('second argument must be a valid inventory!');
            }

            inv.transfer(target, this.args[2], this.args[3]);
        }
    });

    // <<inv $inventory [$target] [flags]>>

    Macro.add('inv', {
        handler () {
            let target;
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            if (this.args[1]) {
                target = getInv(this.args[1]);
            }

            const options = {
                description : this.args.includesAny('inspect', 'description'),
                use : this.args.includes('use'),
                transfer : target,
                drop : this.args.includes('drop')
            };

            inv.interface(options, $(this.output));
        }
    });

    setup.Inventory = Inventory;
    window.Inventory = window.Inventory || Inventory;

})();