# Simple Inventory 3
 The new simple inventory.

**CURRENTLY IN DEVELOPMENT! DO NOT USE!!!!**

**SERIOUSLY, DON'T USE IT YET!!!**

Version 3 includes most of the features and functionality of v2, and adds:

- Consumables. Items can be associated with SugarCube code (sort of like a widget) or a callback function that can be executed when the item is "used."
- Item descriptions (as dialogs).
- Item names. You can provide items with both names and IDs, using the ID in code while the name will be used for displaying it in the game.
- Item and inventory tags. You can add tags to items and inventories as metadata.
- Item stacking. Multiple items in an inventory can now *stack* meaning they'll take up one visual "slot" in the inventory, but will have a counter showing how many are present.
- More robust and complete built-in UI options and components.
- A cleaned up, mostly simplified API and code structure.

Most new features are optional; you don't have to define items, for example. With the exception of stacking, it's possible to use this inventory in almost exactly the same way as v2.

This new simple inventory is totally incompatible with previous versions. Updating will require rewrites, so you may want to stick with v2 in ongoing projects.

## Getting Started

Archives will be listed on the releases page, but you can also grab them from `dist/`. Download the latest version, unzip, and add the files to your SugarCube 2 project. How you add it will differ based on the compiler you use.

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

You will need to create special JavaScript and CSS passages to include the code in your project, usually by using the passage tags `script` and `stylesheet`, respectively. Refer to the documentation of your comiler for more information.

## Building From Source

Clone/fork/download the repo. Run `npm install` to set everything up.

Once that's done, you can use NPM scripts to build the library or the demo/test project. See `package.json` for details.

- `npm run build`: Build the JS and CSS. Outputs the resulting files to `dist/`. See `build.js` for more details. If you cant to add new files, you'll need to list them in `build.js` or they won't get compiled.
- `npm run demo`: Requires Tweego to be installed and on your path. Builds the demo file (see `test/`) and outputs it to `docs/demo.html`.

## Other Details

### Credit and Attribution

This code is dedicated to the public domain.  You **don't** need to provide credit, attribution, or anything else if you don't want to. By contributing code or content to this project, you are releasing it into the public domain.

> [!NOTE]
> If you do wish to credit me, which I always appreciate, you can credit me as Chapel, but please do not imply that I directly worked on your game.

> [!TIP]
> If you have any questions or concerns about this, refer to the [license](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/LICENSE) or reach out to me.

### I Need Help!

If you're having an issue with these macros and suspect that it's operator error rather than a bug, you can still open an issue, but a faster way to get help would be to post in one of these Twine communities:

 * [The Twine Category at IntFiction.org](https://intfiction.org/c/authoring/twine)
 * [The Official Twine Discord Server](https://discordapp.com/invite/n5dJvPp)
 * [The Unoffical Twine Subreddit](https://www.reddit.com/r/twinegames/)

> [!TIP]
> Regardless of where you seek help, you'll want to provide links to the scripts you're using for your potential answerers.  Don't expect people to know what "Chapel's fading macros" are or how they work just from that.

### Donations

> [!NOTE]
> Note: I suggest donating to [Twine development](https://www.patreon.com/klembot) or [SugarCube development](https://www.patreon.com/thomasmedwards) if you really want to help out, but I'd welcome a few dollars if you feel like it.

[![ko-fi](https://www.ko-fi.com/img/donate_sm.png)](https://ko-fi.com/F1F8IC35)