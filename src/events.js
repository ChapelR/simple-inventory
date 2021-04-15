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

    Object.assign(setup.Inventory, {
        events : {
            update : {
                on (cb = null, ns = '') {
                    if (!validCallback(cb)) {
                        return;
                    }
                    $(document).on(types.update + ns, cb);
                },
                one (cb = null, ns = '') {
                    if (!validCallback(cb)) {
                        return;
                    }
                    $(document).one(types.update + ns, cb);
                },
                off (ns = '') {
                    $(document).off(types.update + ns);
                }
            },
            use : {
                on (cb = null, ns = '') {
                    if (!validCallback(cb)) {
                        return;
                    }
                    $(document).on(types.use + ns, cb);
                },
                one (cb = null, ns = '') {
                    if (!validCallback(cb)) {
                        return;
                    }
                    $(document).one(types.use + ns, cb);
                },
                off (ns = '') {
                    $(document).off(types.use + ns);
                }
            },
            on (type = 'update', cb = null, ns = '') {
                if (!validCallback(cb) || !types[type]) {
                    return;
                }
                $(document).on(types[type] + ns, cb);
            },
            one (type = 'update', cb = null, ns = '') {
                if (!validCallback(cb) || !types[type]) {
                    return;
                }
                $(document).one(types[type] + ns, cb);
            },
            off (type = 'update', ns = '') {
                if (!types[type]) {
                    return;
                }
                $(document).off(types[type] + ns);
            }
        }
    });

})();