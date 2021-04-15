// jshint node: true

const jetpack = require('fs-jetpack'),
    Terser  = require('terser'),
    postcss = require('postcss'),
    autoprefix = require('autoprefixer'),
    cleancss = require('postcss-clean');

const jsFiles = ['items.js', 'inv.js'];
const cssFiles = ['style.css'];

const buildDate = new Date().toISOString().split('T')[0],
    buildID = require('git-commit-id')();

const version = require('./package.json').version;

function build () {
    Terser.minify(jsFiles.map(path => jetpack.read(`src/${path}`)).join('\n\n'))
        .then(result => {
            if (result.error) {
                console.error(result.error);
            }
            jetpack.write('dist/simple-inventory.js', `// Simple Inventory, for SugarCube 2, by Chapel\n// v${version}, ${buildDate}, ${buildID}\n;${result.code}\n// End Simple Inventory`, { atomic : true});
        });

    postcss([ autoprefix(), cleancss() ])
        .process(cssFiles.map(path => jetpack.read(`src/${path}`)).join('\n\n'), { from : undefined })
        .then(result => {
            result.warnings().forEach(warn => {
                console.warn(warn.toString());
            });
            jetpack.write('dist/simple-inventory.css', `/* Simple Inventory, for SugarCube 2, by Chapel\n v${version}, ${buildDate}, ${buildID} */\n;${result.css}\n/* End Simple Inventory */`, {atomic : true});
        });
}

build();