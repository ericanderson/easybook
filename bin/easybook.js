#! /usr/bin/env node
/* eslint-disable no-console */

var color = require("bash-color");
const program = require("../lib/app").default;

const q = program.parse(process.argv).args;

if (q.length === 0) {
    program.help();
}
