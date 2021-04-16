(() => {
    'use strict';

    const Inventory = setup.Inventory;
    const Item = setup.Item;

    const userland = '.simple-inventory-userland';
    const types = {
        update : ':inventory-update.simple-inventory' + userland,
        use : ':inventory-use.simple-inventory' + userland
    };

    function validCallback (cb) {
        return cb && typeof cb === 'function';
    }

    // Event Object = {
    //     type, -> event type (`:inventory-update` or `:inventory-use`) + namespaces as appropriate
    //     inventory, -> the inventory that triggered the event
    //     target, -> the target inventory in transfers (receives the items), or null
    //     delta, -> an object containing the items and quantities moved, or null
    //     item -> the item used, or null
    // }

    Object.assign(setup.Inventory, {
        events : {
            update : {
                // Inventory.update.on(callback [, namespace]) -> registers event handler on update
                on (cb = null, ns = '') {
                    if (!validCallback(cb)) {
                        return;
                    }
                    $(document).on(types.update + ns, cb);
                },
                // Inventory.update.one(callback [, namespace]) -> registers single-use event handler on update
                one (cb = null, ns = '') {
                    if (!validCallback(cb)) {
                        return;
                    }
                    $(document).one(types.update + ns, cb);
                },
                // Inventory.update.off([namespace]) -> removes update event handler(s)
                off (ns = '') {
                    $(document).off(types.update + ns);
                }
            },
            use : {
                // Inventory.use.on(callback [, namespace]) -> registers event handler on item use
                on (cb = null, ns = '') {
                    if (!validCallback(cb)) {
                        return;
                    }
                    $(document).on(types.use + ns, cb);
                },
                // Inventory.use.one(callback [, namespace]) -> registers single-use event handler on item use
                one (cb = null, ns = '') {
                    if (!validCallback(cb)) {
                        return;
                    }
                    $(document).one(types.use + ns, cb);
                },
                // Inventory.use.off([namespace]) -> removes item use event handler(s)
                off (ns = '') {
                    $(document).off(types.use + ns);
                }
            }
        }
    });

})();