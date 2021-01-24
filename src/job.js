#!/usr/bin/env node

'use strict';

const {auth} = require('./util');
const request = require('request');
const inquire = require('inquirer');

/**
 * @class Job
 * @public
 */
class Job {
    /**
     * Create a new Job Instance
     *
     * @param {OA} api parent OA instance
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Print help documentation about the subcommand to stderr
     */
    help() {
        console.error();
        console.error('Interact with the lowest level of data ');
        console.error();
        console.error('Usage: cli.js job <subcommand>');
        console.error();
        console.error('<subcommand>:');
        console.error();
    }
}

module.exports = Job;
