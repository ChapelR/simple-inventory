// jshint node: true

const jetpack = require('fs-jetpack'),
    babel = require('@babel/core'),
    Terser  = require('terser'),
    postcss = require('postcss'),
    autoprefix = require('autoprefixer'),
    cleancss = require('postcss-clean');

const jsFiles = [ // order is important here
    'items.js', 
    'inv.js', 
    'interface.js', 
    'events.js', 
    'parser.js', 
    'macros.js', 
    'ext.js'
];
const cssFiles = [ 'style.css' ]; // may need more later, so use array

const buildDate = new Date().toISOString().split('T')[0],
    buildID = require('git-commit-id')();

const version = require('./package.json').version;

function build () {
    babel.transform(jsFiles.map(path => jetpack.read(`src/${path}`)).join('\n\n'), {
        // babel is wacky man, all these [[[[[[ everywhere
        presets: [['@babel/preset-env', { 
            targets : [
                // same as SugarCube 2, though I'd love to drop IE9...
                "> 1%",
                "last 3 versions",
                "last 10 Chrome versions",
                "last 10 Firefox versions",
                "IE >= 9",
                "Opera >= 12"
            ]
        }]]
    }, (err, result) => {
        if (err) {
            console.error(err);
        }

        Terser.minify(result.code, { ecma : 5 }).then(result => {
            if (result.error) {
                console.error(result.error);
            }

            jetpack.write('dist/simple-inventory.js', `// Simple Inventory, for SugarCube 2, by Chapel\n// v${version}, ${buildDate}, ${buildID}\n;${result.code}\n// End Simple Inventory`, { atomic : true});
        });
    });

    postcss([ autoprefix(), cleancss() ]) // autoprefix v9 
        .process(cssFiles.map(path => jetpack.read(`src/${path}`)).join('\n\n'), { from : undefined })
        .then(result => {
            result.warnings().forEach(warn => {
                console.warn(warn.toString());
            });
            jetpack.write('dist/simple-inventory.css', `/* Simple Inventory, for SugarCube 2, by Chapel\nv${version}, ${buildDate}, ${buildID} */\n${result.css}\n/* End Simple Inventory */`, {atomic : true});
        });
}

build();