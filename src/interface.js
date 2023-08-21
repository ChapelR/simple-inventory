(() => {
    'use strict';

    const Item = setup.Item;
    const Inventory = setup.Inventory;

    function isPermanent (id) {
        return Item.has(id) && Item.get(id).permanent;
    }

    function confirmationDialog (yes, no = null, type = false, title = 'Alert', question = "Are you sure?") {
        if (!yes || typeof yes !== 'function') {
            throw new Error('Invalid confirmation callback!');
        }
        // pass the 'yes' callbacks through if no confirmation is needed
        if (!Inventory.confirm) {
            yes();
            return;
        }
        if (Inventory.confirm === 'all' && type !== 'all') {
            yes();
            return;
        }
        if (Inventory.confirm === 'stack' && !type) {
            yes();
            return;
        }

        const CSS = {
            display : 'inline-block',
            float : 'right'
        };

        const $wrapper = $(document.createElement('div'));
        const $question = $(document.createElement('p')).append(question);
        const $buttons = $(document.createElement('div')).addClass('confirmation-buttons');
        const $yes = $(document.createElement('button'))
            .append('Okay')
            .addClass('confirm-yes')
            .css(Object.assign(CSS, { 'margin-right': '0.5rem' }));
        const $no = $(document.createElement('button'))
            .append('Cancel')
            .addClass('confirm-no')
            .css(CSS);

        if (yes && typeof yes === 'function') {
            $yes.ariaClick(yes);
        }
        if (no && typeof no === 'function') {
            $no.ariaClick(no);
        }

        $buttons.append($no, $yes);
        $wrapper.append($question, $buttons);

        Dialog.setup(title, 'simple-inventory confirmation');
        Dialog.append($wrapper);
        Dialog.open();
    }

    // undocumented UI helper
    function spacer (content) {
        const $spacer = $(document.createElement('span')).addClass('spacer');
        if (content) {
            $spacer.wiki("" + content);
        }
        return $spacer;
    }

    // undocumented UI helper
    function inspectLink (self, id, text, button = false) {
        text = text || Inventory.strings.inspect;
        return $(document.createElement(button ? 'button' : 'a'))
            .addClass('inspect-link')
            .wiki("" + text)
            .ariaClick(() => {
                Item.get(id).inspect();
            });
    }

    // undocumented UI helper
    function useLink (self, id, text, button = false) {
        text = text || Inventory.strings.use;
        return $(document.createElement(button ? 'button' : 'a'))
            .addClass('use-link')
            .wiki("" + text)
            .ariaClick(() => {
                self.use(id);
            });
    }

    // undocumented UI helper
    function dropLink (self, id, text, button = false, target = null) {
        text = text || (!!target ? Inventory.strings.give : Inventory.strings.drop);
        return $(document.createElement(button ? 'button' : 'a'))
            .addClass('drop-link')
            .wiki("" + text)
            .ariaClick(() => {
                confirmationDialog(() => {
                    if (target && Inventory.is(target)) {
                        self.transfer(target, id, 1);
                    } else {
                        self.drop(id, 1);
                    }
                    Dialog.close();
                }, () => { Dialog.close(); });
            });
    }

    function dropStackLink (self, id, text, button = false, target = null) {
        text = text || (!!target ? Inventory.strings.give : Inventory.strings.drop) + '&nbsp;' + Inventory.strings.stack;
        return $(document.createElement(button ? 'button' : 'a'))
            .addClass('stack-link drop-link')
            .wiki("" + text)
            .ariaClick(() => {
                confirmationDialog(() => {
                    if (target && Inventory.is(target)) {
                        self.transfer(target, id, self.count(id));
                    } else {
                        self.drop(id, self.count(id));
                    }
                    Dialog.close();
                }, () => { Dialog.close(); });
            });
    }

    function dropAllLink (self, text, button = false, target = null) {
        text = text || (!!target ? Inventory.strings.give : Inventory.strings.drop);
        return $(document.createElement(button ? 'button' : 'a'))
            .addClass('all-link drop-link')
            .wiki(text + ' all')
            .ariaClick(() => {
                if (!self.isEmpty()) {
                    confirmationDialog(() => {
                        if (target && Inventory.is(target)) {
                            target.merge(self);
                            self.empty();
                        } else {
                            self.empty();
                        }
                        Dialog.close();
                    }, () => { Dialog.close(); }, true);
                }
            });
    }

    // itemCount(itemID, prefix, postfix) -> returns stack tallycount
    function itemCount (self, id, pre, post) {
        let tally = $(document.createElement('span'));
        let cnt = self.count(id);

        pre = pre || Inventory.strings.stackPre;
        post = post || Inventory.strings.stackPost;
        
        if (cnt == 1) tally.addClass('item-count single');
        else tally.addClass('item-count multi');
        
        return tally.append( "" + pre + (cnt || 0) + post );
    }

    // undocumented UI helper
    function displayInventoryList (self, options = {
        description : true,
        use : true,
        transfer : null,
        drop : true,
        all : true,
        stack : true,
        dropActionText : '',
        classes : ''
    }) {
        const $list = $(document.createElement('ul')).addClass('simple-inventory-list');
        let $entries;
        if (self.length) {
            $entries = self.list.map(id => {

                const appendMe = [];

                if (options.description && Item.has(id) && Item.get(id).description) {
                    appendMe.push(inspectLink(self, id, Item.has(id) ? Item.get(id).name : id));
                } else {
                    appendMe.push($(document.createElement('span')).append(Item.has(id) ? Item.get(id).name : id).addClass('item-name'));
                }

                appendMe.push(itemCount(self, id));

                if (options.use && Item.has(id) && Item.get(id).handler) {
                    appendMe.push(useLink(self, id));
                } else {
                    appendMe.push(spacer());
                }

                if (((options.transfer && Inventory.is(options.transfer)) || options.drop) && !isPermanent(id)) {
                    appendMe.push(dropLink(self, id, options.dropActionText, false, options.transfer || null));
                    if (self.count(id) > 1 && options.stack) { // drop entire stack
                        appendMe.push(dropStackLink(self, id, options.dropActionText + '&nbsp;' + Inventory.strings.stack, false, options.transfer || null));
                    } else {
                        appendMe.push(spacer());
                    }
                } else {
                    appendMe.push(spacer());
                }

                let iid = id.normalize().toLowerCase().replace(/\s+/g, '-');

                return $(document.createElement('li'))
                    .append(appendMe)
                    .addClass('simple-inventory-listing')
                    .attr('data-item-id', iid);
            });

            if (options.all) {
                const $all = $(document.createElement('li'))
                    .addClass('all-listing simple-inventory-listing')
                    .append([
                        spacer('&mdash;'), 
                        spacer(), 
                        spacer(), 
                        dropAllLink(self, options.dropActionText, false, options.transfer || null)
                    ]);
                $entries.push($all);
            }
        } else {
            $entries = $(document.createElement('li'))
                .addClass('simple-inventory-listing')
                .append($(document.createElement('span')).wiki(Inventory.emptyMessage));
        }

        $list.append($entries);
        return $list;
    }

    // constructs inventory interface
    // very opinionated by necessity
    // include resipes for different UIs in docs
    Inventory.prototype.interface = function (opts = {}, el = null) {
        const self = this;

        const $wrapper = $(document.createElement('div')).addClass('simple-inventory-wrapper');
        $wrapper.append(displayInventoryList(this, opts));

        $(document).on(':inventory-update.simple-inventory.gui-built-in', () => {
            if ($wrapper.length) {
                $wrapper.empty().append(displayInventoryList(self, opts));
            } else {
                $(document).off(':inventory-update.simple-inventory.gui-built-in');
            }
        });

        let $el;

        if (el && el instanceof $) {
            $el = el;
        } else if (el) {
            $el = $(el);
        }

        if ($el) {
            $wrapper.appendTo($el);
        }

        return $wrapper;
    };


})();
