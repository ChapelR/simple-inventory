(() => {
    'use strict';

    // item class
    const defaultOpts = {
        description : '',
        handler : null,
        name : '',
        consumable: true,
        unique : false
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

        static emit (type, item) {
            $(document).trigger({
                type : (type[0] === ':' ? type : ':' + type) + '.simple-inventory',
                item : item
            });
        }

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

        emit (type) {
            Item.emit(type, this);
            return this;
        } 

        get name () {
            return this.name || this.id;
        }

        use () {
            if (typeof this.handler === 'string') {
                $.wiki(this.handler);
            } else if (typeof this.handler === 'function') {
                this.handler(this);
            }
            this.emit('use');
            return this;
        }

        inspect () {
            Dialog.setup(this.name(), 'simple-inventory item-description');
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
        tags: ['description', 'tags', 'unique'],
        handler () {

            let exec = null;
            let consumable = false;
            let unique = false;

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
                name = this.args[1].trim();
            }

            if (this.payload.length > 1) {
                const d = this.payload.find(pl => pl.name === 'descripion');
                const t = this.payload.find(pl => pl.name === 'tags');
                const u = this.payload.find(pl => pl.name === 'unique');
                if (d) { descr = d.contents; }
                if (t) { tags = t.args.flat(Infinity); }
                if (u) { unique = true; }
            }

            Item.add(id, {
                name : name || '',
                description : descr || '',
                handler : exec,
                consumable,
                unique
            }, tags);
        }

    });

    setup.Item = Item;
    window.Item = window.Item || Item;

})();