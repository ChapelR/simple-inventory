# Extensions API

The extensions API can be used to safely extend the `Inventory` and `Item` APIs with new methods and properties. By default, trying to overwrite existing properties or methods will throw an error, but you can force the extensions to allow overwrites if you want to.

> [!DANGER]
> It should go without saying, but allowing extensions to overwrite methods and properties means you can very easily break something, or everything. But it also allows you to replace or change default features to your liking without forking the whole thing. Let's just say it voids the warranty. If you decide to overwrite stuff willy-nilly, only God can help you at that point.

## Extending the `Inventory` API

### `Inventory.extend()`

##### Syntax

```
Inventory.extend([extensionObject] [, forceOverwrite]);
```

Adds the properties and methods in the provided extension object to the `Inventory` object as static properties and methods.

##### Arguments

- `extensionObject` (object) an object containing the properties and methods you want to add.
- `forceOverwrite` (boolean) (optional) if true, properties and methods on the extension object can replace existing properties and methods on the API. Use with caution.

##### Returns ( &mdash; )

### `Inventory.extendPrototype()`

##### Syntax

```
Inventory.extendPrototype([extensionObject] [, forceOverwrite]);
```

Adds the properties and methods in the provided extension object to the `Inventory` object's prototype as instance properties and methods.

##### Arguments

- `extensionObject` (object) an object containing the properties and methods you want to add.
- `forceOverwrite` (boolean) (optional) if true, properties and methods on the extension object can replace existing properties and methods on the API. Use with caution.

##### Returns ( &mdash; )

## Extending the `Item` API

### `Item.extend()`

##### Syntax

```
Item.extend([extensionObject] [, forceOverwrite]);
```

Adds the properties and methods in the provided extension object to the `Item` object as static properties and methods.

##### Arguments

- `extensionObject` (object) an object containing the properties and methods you want to add.
- `forceOverwrite` (boolean) (optional) if true, properties and methods on the extension object can replace existing properties and methods on the API. Use with caution.

##### Returns ( &mdash; )

### `Item.extendPrototype()`

##### Syntax

```
Item.extendPrototype([extensionObject] [, forceOverwrite]);
```

Adds the properties and methods in the provided extension object to the `Item` object's prototype as instance properties and methods.

##### Arguments

- `extensionObject` (object) an object containing the properties and methods you want to add.
- `forceOverwrite` (boolean) (optional) if true, properties and methods on the extension object can replace existing properties and methods on the API. Use with caution.

##### Returns ( &mdash; )