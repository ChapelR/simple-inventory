(() => {
    'use strict';

    const Item = setup.Item;

    let CONFIRM = false; // boolean or "all" or "stack"
    let EMPTY_MESSAGE = '&hellip;';
    const DEFAULT_STRINGS = {
        inspect : 'Inspect',
        use : 'Use',
        drop : 'Drop',
        stack : 'stack',
        take : 'Take',
        give : 'Give',
        stackPre : '&nbsp;&times;&nbsp;',
        stackPost : '&nbsp;'
    };
    let USER_STRINGS = {};

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

        // confirmation settings
        static get confirm () {
            return CONFIRM;
        }

        static set confirm (value) {
            if (typeof value === 'string' && value.trim().toLowerCase() === 'all') {
                CONFIRM = 'all';
            } else if (typeof value === 'string' && value.trim().toLowerCase() === 'stack') {
                CONFIRM = 'stack';
            } else {
                CONFIRM = !!value;
            }
        }

        // empty message
        static get emptyMessage () {
            return EMPTY_MESSAGE;
        }

        static set emptyMessage (value) {
            if (typeof value === 'string') {
                EMPTY_MESSAGE = value;
            }
        }

        // strings
        static get strings () {
            return Object.assign(clone(DEFAULT_STRINGS), USER_STRINGS); 
        }

        static set strings (val) {
            if (typeof val !== 'object') {
                return;
            }
            USER_STRINGS = Object.assign(USER_STRINGS, clone(val));
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

        // tags
        get tags () {
            // return tags array (editable)
            return this._tags;
        }

        set tags(value) {
            this._tags = value;
        }
        
        hasTag (tag) {
            // has the indicated tag
            return this.tags.includes(tag);
        }

        hasAllTags () {
            // has all the indicated tags
            return this.tags.includesAll([].slice.call(arguments).flat(Infinity));
        }

        hasAnyTags () {
            // has any of the indicated tags
            return this.tags.includesAny([].slice.call(arguments).flat(Infinity));
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

        // inventory#compare(invOrObject) -> returns true if the inventory contains all the items in the set
        compare (obj) {
            const self = this;
            const items = Inventory.itemset(obj);
            return Object.keys(items).every(i => self.has(i, items[i]));
        }

        // inventory#merge(invOrObject) -> merges the provided object/inventory into the inventory instance
        merge (obj) {
            const self = this;
            const items = Inventory.itemset(obj);
            Object.keys(items).forEach(i => { 
                Inventory.change(self, i, items[i]);
            });
            return items;
        }

        // inventory#unmerge(invOrObject) -> unmerges (removes) the provided object/inventory into the inventory instance
        unmerge (obj) {
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
        pickup () {
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
            return this;
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

        // for SC state
        clone () {
            return new Inventory(this.data || {}, this.tags || []);
        }

        // for SC state
        toJSON () {
            return JSON.reviveWrapper('new setup.Inventory(' + JSON.stringify(this.data) + ', ' + JSON.stringify(this.tags)  + ')');
        }
    }

    setup.Inventory = Inventory;
    window.Inventory = window.Inventory || Inventory;

})();
