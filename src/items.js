(() => {
    'use strict';

    // item class
    const defaultOpts = {
        description : '', // item description rendered in modal when inspected
        handler : null, // callback function or wiki code
        displayName : '', // display name replaces id
        consumable: true, // can be used, and is consumed (dropped) on use
        unique : false, // a given inventory may only ever have one
        permanent : false // cannot be dropped or transferred once picked up
    };

    const ItemList = new Map();

    class Item {
        constructor(id = '', opts = clone(defaultOpts), tags = []) {

            if (!id || typeof id !== 'string') {
                throw new Error('invalid item ID');
            }
            if (typeof opts !== 'object') {
                throw new Error('invalid item definition');
            }
            
            Object.assign(this, Object.assign(defaultOpts, opts));
            this.id = id;
            this.tags = tags instanceof Array ? tags : 
                typeof tags === 'string' ? [ tags ] : [];

        }

        // static methods

        static is (thing) {
            return thing instanceof Item;
        }

        static add (id, def, tags) {
            const item = new Item(id, def, tags);
            ItemList.set(id, item);
            return item;
        }

        static get (id) {
            return ItemList.get(id);
        }

        static has (id) {
            return ItemList.has(id);
        }

        static get list () {
            return ItemList;
        }

        // instance methods

        get name () {
            return this.displayName || this.id;
        }

        set name (val) {
            this.displayName = val;
        }

        use () {
            if (typeof this.handler === 'string') {
                $.wiki(this.handler);
            } else if (typeof this.handler === 'function') {
                this.handler(this);
            }
            return this;
        }

        inspect () {
            Dialog.setup(this.name, 'simple-inventory item-description');
            Dialog.wiki(this.description);
            Dialog.open();
        }

    }

    // <<item id [name]>>
    //     [use code]
    // <<description>>
    //     [description code]
    // <<tags [listOfTags]>>
    // <<unique>>
    // <</item>>

    Macro.add(['item', 'consumable'], {
        tags: ['description', 'tags', 'unique', 'permanent'],
        handler () {

            let exec = null;
            let consumable = false;
            let unique = false;
            let permanent = false;

            let id, name, descr, tags;

            if (State.length > 0) {
                return this.error('items must be defined in `StoryInit` or story JavaScript!');
            }

            if (!this.args[0] || typeof this.args[0] !== 'string' || !this.args[0].trim()) {
                return this.error('invalid item ID');
            }

            id = this.args[0].trim();

            if (this.name === 'consumable') {
                // has a use handler, will be used up
                exec = this.payload[0].contents || null;
                consumable = true;
            }

            if (this.args[1]) {
                name = this.args[1];
            }

            if (this.payload.length > 1) {
                const d = this.payload.find(pl => pl.name === 'description');
                const t = this.payload.find(pl => pl.name === 'tags');
                const u = this.payload.find(pl => pl.name === 'unique');
                const p = this.payload.find(pl => pl.name === 'permanent');
                if (d) { descr = d.contents; }
                if (t) { tags = t.args.flat(Infinity); }
                if (u) { unique = true; }
                if (p) { permanent = true; }
            }

            Item.add(id, {
                displayName : name || '',
                description : descr || '',
                handler : exec,
                consumable,
                unique,
                permanent
            }, tags);
        }

    });

    setup.Item = Item;
    window.Item = window.Item || Item;

})();