# Inventory API

The following describes the `Iventory` class and its properties and methods.

## `Inventory` Static Properties

### `Inventory.confirm`

##### ( string | boolean )

Can be set by users.

Controls whether or not to confirm certain inventory actions with the player before proceeding. Only applies to the default user-interfaces.

##### Values

- `"all"` (string) (default) set to `"all"`and only Drop/Give/Take all commands will require confirmation.
- `true` (boolean) every drop/give/take action, including the all commands, will require confirmation.
- `false` (boolean) never require confirmation.

### `Inventory.emptyMessage`

##### ( string )

Can be set by users.

Controls the message displayed by an inventory when it's empty. Only applies to the default user-interfaces.

##### Values

Can be set to any string value. By default is a horizontal ellipsis (&hellip;).

## `Inventory` Static Methods

### `Inventory.create()`

##### Syntax

```
Inventory.create([data] [, tags]);
```

Creates and returns an inventory instance.

##### Arguments

- `data` (object) (optional) a plain object of item/amount pairs to place in the inventory
- `tags` (string array) (optional) an array of tags to associate with the inventory. Tags have no meaning to the simple inventory itself and are purely for storing user metadata.

##### Returns ( `Inventory` instance )

Returns the created inventory instance.

### `Inventory.is()`

##### Syntax

```
Inventory.create(thing);
```

Determines whether the passed *thing* is an inventory instance.

##### Arguments

- `thing` (any) anything

##### Returns ( boolean )

## `Inventory` Instance Properties

### `inventory#list`

##### ( string array )

Cannot be set by users.

An array of items in the inventory. This array only includes one entry type of item, regardless of quantity.

### `inventory#array`

##### ( string array )

Cannot be set by users.

An array of items in the inventory. This array includes duplicates, including an additional entry for each item in a stack.

### `inventory#table`

##### ( object )

Cannot be set by users.

A generic object made up of item/stack pairs.

### `inventory#length`

##### ( number )

Cannot be set by users.

Returns the number of items in the inventory, including all duplicates.

### `inventory#uniqueLength`

##### ( number )

Cannot be set by users.

Returns the number of unique items in the inventory. Each type of item is only counted once, regardless of the quantity.

## `Inventory` Instance Methods

### `inventory#count()`

##### Syntax

```
<inventory>.count(item);
```

Returns the number of the items with the given ID in the inventory.

##### Arguments

- `item` (string) an item ID

##### Returns ( number )

### `inventory#isEmpty()`

##### Syntax

```
<inventory>.isEmpty();
```

Returns whether the inventory is empty (has no items).

##### Returns ( boolean )

### `inventory#has()`

##### Syntax

```
<inventory>.has(item [, amount]);
```

Returns true if the given number of items of with the given ID are in the inventory. 

##### Arguments

- `item` (string) an item ID
- `amount` (number) (optional) the number of items to check for, defaults to `1` is not specified.

##### Returns ( number )

### `inventory#hasAll()`

##### Syntax

```
<inventory>.hasAll(item [, item ...]);
```

Returns true if the inventory contains at least one of all the indicated items.

##### Arguments

- `item` (string) a list of item IDs to check for

##### Returns ( number )

### `inventory#hasAny()`

##### Syntax

```
<inventory>.hasAny(item [, item ...]);
```

Returns true if the inventory contains at least one of any of the indicated items.

##### Arguments

- `item` (string) a list of item IDs to check for

##### Returns ( number )

### `inventory#merge()`

##### Syntax

```
<inventory>.merge(itemset);
```

Merges the indicated itemset into the inventory, adding all the items in the specified quantities.

##### Arguments

- `itemset` (inventory | object) an inventory instance or a generic object containing itemID/amount pairs.

##### Returns ( object )

Returns the delta, which in this case is simply the `itemset`'s data.

### `inventory#unmerge()`

##### Syntax

```
<inventory>.unmerge(itemset);
```

Compares the inventory to the given itemset. Any items the two have in common are dropped.

> [!WARNING]
> If you attempt to remove an item or items that aren't present in the inventory, nothing happens and no errors or warnings will be displayed.

##### Arguments

- `itemset` (inventory | object) an inventory instance or a generic object containing itemID/amount pairs.

##### Returns ( object )

Returns the delta, which is the `itemset` less any items the inventory instance didn't contain that couldnt be dropped.

### `inventory#pickup()`

##### Syntax

```
<inventory>.pickup(item, amount [, item, amount ...]);
```

Adds the indicated items, passed as itemID/amount pairs of arguments, to the inventory. All item IDs must be paired with a number.

> [!WARNING]
> Note the change in capitalization (`pickup()` rather than `pickUp()`) compared to v2.

##### Arguments

- `item` (string) an item ID
- `amount` (number) the number of items to add

##### Returns ( `this` )

Can be chained.

### `inventory#drop()`

##### Syntax

```
<inventory>.drop(item, amount [, item, amount ...]);
```

Removes the indicated items, passed as itemID/amount pairs of arguments, from the inventory. All item IDs must be paired with a number.

>[!WARNING]
>If you attempt to remove an item or items that aren't present in the inventory, nothing happens and no errors or warnings will be displayed.

##### Arguments

- `item` (string) an item ID
- `amount` (number) the number of items to add

##### Returns ( `this` )

Can be chained.

### `inventory#empty()`

##### Syntax

```
<inventory>.empty();
```

Removes all items from the inventory. 

>[!WARNING]
>If you attempt to remove an item or items that aren't present in the inventory, nothing happens and no errors or warnings will be displayed.

##### Returns ( `this` )

Can be chained.

### `inventory#transfer()`

##### Syntax

```
<inventory>.transfer(target, item, amount [, item, amount ...]);
```

Removes the indicated items, passed as itemID/amount pairs of arguments, from the inventory. All items that are successfully removed are added to the indicated `target` inventory. Items that could not be removed from the giving inventory, for example, if they don't exist, are not passed to the target inventory.

>[!WARNING]
>If you attempt to remove an item or items that aren't present in the inventory, nothing happens and no errors or warnings will be displayed.

##### Arguments

- `target` (inventory) an inventory instance to receive the transferred items
- `item` (string) an item ID
- `amount` (number) the number of items to add

##### Returns ( `this` )

Can be chained.

### `inventory#iterate()`

##### Syntax

```
<inventory>.transfer( function (item, amount) {
	// code
});
```

Iterates over the inventory's items, calling the provided `callback` on each. The callback can accept two arguments, the item and the current quantity.

##### Arguments 

- `callback` (function) a function to run on every iteration

##### Arguments (callback)

- `item` (string) the current item's ID
- `amount` (number) the number of items

##### Returns ( `this` )

Can be chained.

### `inventory#use()`

##### Syntax

```
<inventory>.use(item)
```

"Uses" the given item, if it is a consumable. This calls the handler code associated with the item, removes one of the items from the inventory, and fires the `use` event.

##### Arguments 

- `item` (string) an item ID 

##### Returns ( `this` )

Can be chained.

### `inventory#clone()`

##### Syntax

```
<inventory>.clone()
```

Returns a deep copy of the inventory.

##### Returns ( `Inventory` instance )