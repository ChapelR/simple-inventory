# Events API

The following describes the event system in the simple inventory.

## Event Basics

There are two types of events emitted by the simple inventory system.

- **Update events** are emitted when an inventory is updated, meaning any items are moved into or out of any inventory.
- **Use events** are emitted when an item in an inventory is used. Items used via the `Item` API do not emit these events.

### The Event Object

The events object is passed to event handlers as the first object (as is standard for event handlers). The event objects contain the following additional properties:

- `inventory` (inventory) the inventory that generated the event.
- `target` (inventory | null) the target inventory in transfers, or `null`
- `delta` (object |null) a generic object containing item ID and amount pairs, representing the changes to the inventory. If no changes were made, it is `null`. What exactly is being represented here changes based on the context:
  - during pickups and merges, the delta is simply the items being added to the inventory.
  - during drops and unmerges, the delta is all the items successfully removed from the inventory.
  - during transfers, the delta is the items successfully removed from the inventory and added to the target inventory.
- `item` (item | null) in **use events**, this is the item instance being used. Otherwise it is `null`.

### Writing Event Handlers

Writing event handlers may be tough for inexperienced users, so don't sweat it too much if this doesn't make much sense to you. Basically, event handlers are special functions that are called by the system automatically when certain things happen. That's all an event is, **a thing happening**. As mentioned, the simple inventory allows users to plug into two different events, two different things that happen, and provide a handler.

Let's say, for example, there is "trait" in your game that the player can gain that causes potions to heal for double. We'll say that we can check that the player has this trait by checking the `$potionTrait` variable (that is, if it's `true`, the player has the trait).

We'll assume the normal health potion code looks something like this:

```
<<consumable "health potion">>
	<<set $hp to Math.clamp($hp + 20, 0, 100)>>
<<description>>\
	<<include "health potion description">>\
<</consumable>>
```

We could pretty easily change the code to something like this:

```
<<consumable "health potion">>
	<<set _heal to 20>>
	<<if $potionTrait>>
		<<set _heal *= 2>>
	<</if>>
	<<set $hp to Math.clamp($hp + _heal, 0, 100)>>
<<description>>\
	<<include "health potion description">>\
<</consumable>>
```

And that's a perfectly reasonable thing to do. However, if you have tons of these traits that can effect items, or the traits are very complicated, it may be more efficient to instead listen for events, and use those instead. So instead of changing the item definition, we could potentially do something like this instead:

```javacsript
Inventory.events.use.on( function (ev) {
	// check that the player has the trait and is using a potion
	if (ev.item.id === 'health potion' && State.variables.potionTrait) {
		State.variables.hp = Math.clamp(State.variables.hp + 20, 0, 100);
	}
});
```

 This is a simple example, and realistically there are probably better and more sensible ways to go about this than with an event hardcoded to add some more HP, but hopefully you get the idea.

## Events API Documentation

The events API is a property of the `Inventory` object.

### `Inventory.events.update.on()`

##### Syntax

```
Inventory.events.update.on(handler [, namespace]);
```

Binds a recurring event handler to the **update** event.

##### Arguments

- `handler` (function) a function to run as an event handler
- `namespace` (string) (optional) an optional namespace to associate with the handler

##### Returns ( &mdash; )

### `Inventory.events.update.one()`

##### Syntax

```
Inventory.events.update.one(handler [, namespace]);
```

Binds a single-use event handler to the **update** event.

##### Arguments

- `handler` (function) a function to run as an event handler
- `namespace` (string) (optional) an optional namespace to associate with the handler

##### Returns ( &mdash; )

### `Inventory.events.update.off()`

##### Syntax

```
Inventory.events.update.of([namespace]);
```

Removes events bound to the **update** event. If the optional `namespace` argument is provided, only handlers with that namespace will be removed.

##### Arguments

- `namespace` (string) (optional) an optional namespace

##### Returns ( &mdash; )

### `Inventory.events.use.on()`

##### Syntax

```
Inventory.events.use.on(handler [, namespace]);
```

Binds a recurring event handler to the **use** event.

##### Arguments

- `handler` (function) a function to run as an event handler
- `namespace` (string) (optional) an optional namespace to associate with the handler

##### Returns ( &mdash; )

### `Inventory.events.use.one()`

##### Syntax

```
Inventory.events.use.one(handler [, namespace]);
```

Binds a single-use event handler to the **use** event.

##### Arguments

- `handler` (function) a function to run as an event handler
- `namespace` (string) (optional) an optional namespace to associate with the handler

##### Returns ( &mdash; )

### `Inventory.events.use.off()`

##### Syntax

```
Inventory.events.use.of([namespace]);
```

Removes events bound to the **use** event. If the optional `namespace` argument is provided, only handlers with that namespace will be removed.

##### Arguments

- `namespace` (string) (optional) an optional namespace

##### Returns ( &mdash; )

