# Simple Inventory 3

 The new simple inventory system. No longer a part of [my macro collection](https://macros.twinelab.net/), it's now its own thing. If you need the old version, grab [an older release (v2.10.0 or lower) of my custom macro collection](https://github.com/ChapelR/custom-macros-for-sugarcube-2/releases). If you find any bugs or have any issues, please [let me know](https://github.com/ChapelR/simple-inventory/issues/new)!

- [Downloads](https://github.com/ChapelR/simple-inventory/releases)
- [Installation](#getting-started)
- Guides
  - [Guide](Guide.md)
  - [Recipes](Recipes.md)
- [Macros](Macros.md)
- APIs
  - [`Inventory` API](InventoryAPI.md)
  - [`Item` API](ItemAPI.md)
  - [Events](EventsAPI.md)
  - [Extensions](ExtensionsAPI.md)
- [Issue Tracker](https://github.com/ChapelR/simple-inventory/issues)
- [Demo](demo.html ":ignore")
- [Source Code](https://github.com/ChapelR/simple-inventory/)

Features:  
- Support for an arbitrary number of inventories, so they can be used as player inventories, chests, rooms, NPC inventories, etc.  
- Simple interfaces for complex operations, like inventory transfers, merges, and comparisons.  
- Items can optionally be predefined, but you may also just use bare strings for ultimate simplicity.  
- Premade logic for unique and un-tradeable items.  
- Support for "consumables" like potions, which can be paired with code callbacks for easy item creation.  
- Duplicate items in a given inventory "stack" automatically.  
- A suite of customizable UI components for displaying and allowing users to manage inventories easily.  
- Text search/filter system built-in as an optional UI component.

Most features are optional; you don't have to define items, for example. With the exception of stacking, it's possible to use this inventory in almost exactly the same way as v2. Note that this new simple inventory is totally incompatible with previous versions. Updating will require code rewrites, so you may want to stick with v2 in ongoing projects.

## Getting Started

Archives will be listed on [the releases page](https://github.com/ChapelR/simple-inventory/releases), but you can also grab them [from `dist/`](https://github.com/ChapelR/simple-inventory/tree/main/dist). Download the latest version, unzip, and add the files to your SugarCube 2 project. How you add the files will differ based on the compiler you use.

### Twine 2

<img title="Story JavaScript area" alt="Story JavaScript area" src="https://twinelab.net/harlowe-audio/assets/menu1.jpg" width="300px">

From the main story menu (the &#9650; on the bottom left-hand side of the screen, near the story name) open the game's **Story JavaScript area**. Copy and paste the contents of `simple-inventory.js` into this window. Likewise, copy and paste the contents of `simple-inventory.css` into your **Story Stylesheet area**.

> [!TIP]
> When opening the files to copy and paste them, **use a text or code editor** (your default text editor, like Notepad or TextEdit is fine). Avoid opening the files using any sort of rich-text editing program or a word processor.

> [!NOTE]
> Some operating systems may warn you when you attempt to open a `.js` file. This is normal behavior, and not necessarily an indication of the presence of malware. As long as you get the files from my GitHub repo, you should be okay.

### Tweego (and most other CLI compilers)

In most CLI compilers (excluding Twee2) you can simply include the `simple-inventory.js` and `simple-inventory.css` files in your project's source folders, or list them as source files when you use Tweego.

### Twine 1 and Twee2 (and a few other odd ducks)

You will need to create special JavaScript and CSS passages to include the code in your project, usually by using the passage tags `script` and `stylesheet`, respectively. Refer to the documentation of your compiler for more information.

### T3LT Macro Definitions

If you use the excellent [Twee 3 Language Tools extension](https://marketplace.visualstudio.com/items?itemName=cyrusfirheir.twee3-language-tools) for VSCode, which I recommend you do, then you'll probably want to provide macro definitions for the custom macros and widgets you use. Here's the [macro definition file](https://github.com/ChapelR/simple-inventory/blob/main/test/simple-inventory.twee-config.yaml) I use. It's not very detailed, but it should at least prevent the macros from showing up as errors.

## Building From Source

Clone/fork/download the repo. Run `npm install` to set everything up.

Once that's done, you can use NPM scripts to build the library or the demo/test project. See `package.json` for details.

- `npm run build`: Build the JS and CSS. Outputs the resulting files to `dist/`. See `build.js` for more details. If you cant to add new files, you'll need to list them in `build.js` or they won't get compiled.
- `npm run demo`: Requires Tweego to be installed and on your path. Builds the demo file (see `test/`) and outputs it to `docs/demo.html`.

## Other Details

### Contributions

I welcome contributions in the form of issues or PRs on [GitHub](https://github.com/ChapelR/simple-inventory/).

If you've made a cool system with Simple Inventory 3, and have the time and inclination to create a minimal version that can be used as a [recipe](Recipes.md), please consider contributing it to benefit other users!

Please report bugs and errors, or typos in this documentation!

### Credit and Attribution

This code is dedicated to the public domain.  You **don't** need to provide credit, attribution, or anything else if you don't want to. By contributing code or content to this project, you are releasing it into the public domain.

> [!NOTE]
> If you do wish to credit me, which I always appreciate, you can credit me as Chapel, but please do not imply that I directly worked on your game.

> [!TIP]
> If you have any questions or concerns about this, refer to the [license](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/LICENSE) or reach out to me.

### I Need Help!

If you're having an issue with this library and suspect that it's operator error rather than a bug, you can still open an issue, but a faster way to get help would be to post in one of these Twine communities:

 * [The Twine Category at IntFiction.org](https://intfiction.org/c/authoring/twine)
 * [The Official Twine Discord Server](https://discordapp.com/invite/n5dJvPp)
 * [The Unofficial Twine Subreddit](https://www.reddit.com/r/twinegames/)

> [!TIP]
> Regardless of where you seek help, you'll want to provide links this documentation or the repo for your potential answerers. 

### Donations

> [!NOTE]
> Note: I suggest donating to [Twine development](https://www.patreon.com/klembot) or [SugarCube development](https://www.patreon.com/thomasmedwards) if you really want to help out, but I'd welcome a few dollars if you want!

[![ko-fi](https://www.ko-fi.com/img/donate_sm.png)](https://ko-fi.com/F1F8IC35)