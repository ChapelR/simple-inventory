/* jshint node: true, esversion: 6 */
'use strict';

const fs = require('fs');
const jetpack = require('fs-jetpack');
const zip = require('node-zip')();

const jsFile = jetpack.read('./dist/simple-inventory.js', 'utf8');
const cssFile = jetpack.read('./dist/simple-inventory.css', 'utf8');
const license = jetpack.read('./LICENSE', 'utf8');

zip
    .file('simple-inventory.js', jsFile)
    .file('simple-inventory.css', cssFile)
    .file('LICENSE.txt', license);

const bin = zip.generate({ base64 : false, compression : 'DEFLATE' });

fs.writeFileSync('./dist/simple-inventory.zip', bin, 'binary');