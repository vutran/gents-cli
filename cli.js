#!/usr/bin/env node

const fs = require('fs');
const got = require('got');
const mri = require('mri');
const gents = require('gents').default;

const args = process.argv.slice(2);
const { _, interfaceName } = mri(args);
const url = _.shift();

if (!url) {
    console.error('Missing `url`, usage: gents <url> --interfaceName <name>');
    process.exit(9);
}

if (!interfaceName) {
    console.error(
        'Missing `--interfaceName`, usage: gents <url> --interfaceName <name>'
    );
    process.exit(9);
}

got(url)
    .then(response => response.body)
    .then(source => gents(source, interfaceName, { subtypes: true }))
    .then(output => {
        const filename = `${interfaceName}.d.ts`;
        fs.writeFileSync(filename, output);
        console.log(`Generated ${filename}.`);
    })
    .catch(err => {
        throw new Error(err);
    });
