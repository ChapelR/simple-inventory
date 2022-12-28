# Item API

The following describes the `Item` class and its properties and methods.

## `Item` Static Properties

### `Item.list`

##### ( map )

Cannot be set by users.

A map of item definitions, indexed by item ID.

## `Item` Static Methods

### `Item.add()`

##### Syntax

```
Item.add(id [, definition] [, tags]);
```

Creates and returns a new item instance, while also registering it in the item list.

##### Arguments

- `id` (string) an ID for the item, which must be a string. If no `displayName` is provided in the definition, the ID will also be used as the name. The item ID is used to add and remove items from inventories.
- `definition` (object) (optional) see below.
- `tags` (array) (optional) an array of tags to associate with the item. Tags have no meaning to the simple inventory itself and are purely for storing user metadata.

#####  `definition` object properties

- `displayName` (string) replaces the ID as the name of the item when shown in the default user-interfaces. Also returned by `item#name` (see below) if it exists.
- `description` (string) a description that will be rendered into a dialog box when the item is inspected. May contain SugarCube markup and macros.
- `handler` (function | string) a callback function or string of SugarCube code to run when the item is used. The item instance itself is passed into the callback as its first argument.
- `consumable` (boolean) marks an item as a consumable, allowing it to be "used" in the default user-interfaces.
- `unique` (boolean) designates an item as **unique**. Unique items are items any given inventory may only ever have a single instance of. These items may exist in multiple inventories, however. If an inventory would get an additional one of these, this addition will silently fail. In the case of transfers, the giving inventory will still lose the item, so be careful!
- `permanent` (boolean) designates an item as **permanent**. Permanent items are items that, once in an inventory, cannot be removed. Attempts to drop or transfer the item out of the inventory will silently fail.

##### Returns ( `Item` instance )

Returns the created item instance.

### `Item.is()`

##### Syntax

```
Item.is(thing);
```

Determines whether the passed *thing* is an item instance.

##### Arguments

- `thing` (any) anything

##### Returns ( boolean )

### `Item.has()`

##### Syntax

```
Item.has(item);
```

Returns true if an item with the indicated ID has been registered via `Item.add()`.

##### Arguments

- `item` (string) an item ID

##### Returns ( boolean )

### `Item.get()`

##### Syntax

```
Item.get(item);
```

Returns the item instance associated with the provided item ID, or `undefined` if it cannot be retrieved.

##### Arguments

- `item` (string) an item ID

##### Returns ( `Item` instance )

## `Item` Instance Properties

### `item#name`

##### ( string )

Can be set by users.

Replaces the item's ID in the user-interfaces.

##### Values

Can be set to any string value.

### `item#tags`

##### ( array )

Cannot be set by users.

Returns the array of tags.

## `Item` Instance Methods

### `item#use()`

##### Syntax

```
<item>.use();
```

Runs an item's handler code.

> [!WARNING]
> It is generally recommended you use the `inventory#use()` method, which includes additional logic for making sure consumable items are properly evaluated in their context and that the proper events are emitted.

##### Returns ( `this` )

Can be chained.

### `item#inspect()`

##### Syntax

```
<item>.inspect();
```

Creates a dialog box and renders the item's description into it.

##### Returns ( `this` )

Can be chained.

### `item#hasTag()`

##### Syntax

```
<item>.hasTag(tag)
```

##### Arguments 

- `tag` (string) a tag to check for  

Returns whether the item has the indicated tag.

##### Returns ( boolean )

### `item#hasAllTags()`

##### Syntax

```
<item>.hasAllTags(tagList)
```

##### Arguments 

- `tagList` (string | string array) a list of tags to check for; can be strings passed as individual arguments, an array of strings, or any combination thereof

Returns whether the item has **all of** the indicated tag(s).

##### Returns ( boolean )

### `item#hasAnyTags()`

##### Syntax

```
<item>.hasAnyTags(tagList)
```

##### Arguments 

- `tagList` (string | string array) a list of tags to check for; can be strings passed as individual arguments, an array of strings, or any combination thereof

Returns whether the item has **any of** the indicated tag(s).

##### Returns ( boolean )