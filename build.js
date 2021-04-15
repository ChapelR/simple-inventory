// jshint node: true

const jetpack = require('fs-jetpack'),
    Terser  = require('terser');

const jsFiles = ['items.js', 'inv.js'];

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
}

build();