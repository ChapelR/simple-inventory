(() => {
    'use strict';

    const Item = setup.Item;
    const Inventory = setup.Inventory;

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

    // <<item id [name]>>
    //     [use code]
    // <<description>>
    //     [description code]
    // <<tags [listOfTags]>>
    // <<unique>>
    // <<permanent>>
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
    // <<drop $inventory item num ...>>
    Macro.add(['pickup', 'drop'], {
        handler () {
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            if (this.args.length < 3) {
                return this.error('no items to pick up were provided');
            }

            inv[this.name](this.args.slice(1));
        }
    });

    // <<dropall $inventory
    Macro.add('dropall', {
        handler () {
            const inv = getInv(this.args[0]);
            if (!inv) {
                return this.error('first argument must be a valid inventory!');
            }

            inv.empty();
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

            if (this.name === 'transfer') {
                if (this.args.length < 4) {
                    return this.error('no items to transfer were provided');
                }
                inv.transfer(target, this.args.slice(2));
            } else {
                inv[this.name](target);
            }
        }
    });

    // <<inv $inventory [$target] [flags]>>
    // <<take $inventory $target [flags]>>
    // <<give $inventory $target [flags]>>
    // flags: inspect.description, use, drop, all
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
                all : this.args.includes('all'),
                dropActionText : this.name === 'inv' ? 'Drop' : this.name.toUpperFirst(),
                classes : `macro-${this.name}`
            };

            inv.interface(options, $(this.output));
        }
    });

})();