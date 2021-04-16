(() => {
    'use strict';

    const Item = setup.Item;
    const Inventory = setup.Inventory;

    function extension (parent, addMe, overwrite) {
        if (typeof addMe !== 'object') {
            throw new TypeError('the extension should be a plain generic object holding the properties and methods you want to add');
        }
        Object.keys(addMe).forEach(prop => {
            if (parent[prop] && !overwrite) {
                throw new Error('Cannot override existing property "' + prop + '"!');
            }
            parent[prop] = addMe[prop];
        });
    }

    Object.assign(Inventory, {
        extend (object, overwrite = false) {
            extension(Inventory, object, overwrite);
        },
        extendPrototype (object, overwrite = false) {
            extension(Inventory.prototype, object, overwrite);
        }
    });

    Object.assign(Item, {
        extend (object, overwrite = false) {
            extension(Item, object, overwrite);
        },
        extendPrototype (object, overwrite = false) {
            extension(Item.prototype, object, overwrite);
        }
    });

})();