#!/usr/bin/env node

'use strict';

const {auth} = require('./util');
const request = require('request');
const inquire = require('inquirer');

/**
 * @class Data
 * @public
 */
class Data {
    /**
     * Create a new Data Instance
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
        console.error('Return information about current live data sources');
        console.error();
        console.error('Usage: cli.js data <subcommand>');
        console.error();
        console.error('<subcommand>:');
        console.error('    list      List all current data sources');
        console.error('    single    List a specific data source');
        console.error();
    }

    /**
     * Queries OA /api/data endpoint
     * Returns a list of current data sources
     *
     * @param {!Object} options Options for making a request
     * @param {String} options.source Filter by a source name or prefix
     * @param {String} options.layer Filter by a layer type (addresses, parcels, etc)
     * @param {String} options.name Filter by a given named provider
     * @param {String} options.point Filter by a given lng/lat point
     *
     * @return {Promise}
     */
    async list(options = {}) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            options.output = process.stdout;

            await main();
        } else if (options.cli) {
            const argv = await inquire.prompt([{
                name: 'source',
                required: true,
                type: 'string',
                default: options.source
            },{
                name: 'layer',
                required: true,
                type: 'string',
                default: options.layer
            },{
                name: 'name',
                required: true,
                type: 'string',
                default: options.name
            },{
                name: 'point',
                required: true,
                type: 'string',
                default: options.point
            }]);

            options.source = argv.source;
            options.layer = argv.layer;
            options.name = argv.name;
            options.point = argv.point;

            try {
                const body = await main();
                console.log(JSON.stringify(body, null, 4));
            } catch (err) {
                console.error(err.message)
                process.exit(1);
            }
        } else {
            await main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {Promise}
         */
        function main() {
            return new Promise((resolve, reject) => {
                let url = new URL(`/api/data`, self.api.url);
                if (options.source) url.searchParams.append('source', options.source);
                if (options.layer) url.searchParams.append('layer', options.layer);
                if (options.name) url.searchParams.append('name', options.name);
                if (options.point) url.searchParams.append('point', options.point);

                const params = auth({
                    method: 'GET',
                    url: url,
                    json: true,
                }, self.api.user);

                request(params, (err, res) => {
                    if (err) return reject(err);
                    if (res.statusCode !== 200) return reject(new Error(JSON.stringify(res.body)));

                    return resolve(res.body);
                });
            });
        }
    }

    /**
     * Queries OA /api/data/:data endpoint
     * Returns a single data source
     *
     * @param {!Object} options Options for making a request
     * @param {String} options.id ID of data source to retrieve
     *
     * @return {Promise}
     */
    async single(options = {}) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            options.output = process.stdout;

            await main();
        } else if (options.cli) {
            const argv = await inquire.prompt([{
                name: 'id',
                required: true,
                type: 'string',
                default: options.id
            }]);

            options.id = argv.id;

            try {
                const body = await main();
                console.log(JSON.stringify(body, null, 4));
            } catch (err) {
                console.error(err.message)
                process.exit(1);
            }
        } else {
            await main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {Promise}
         */
        function main() {
            return new Promise((resolve, reject) => {
                let url = new URL(`/api/data/${options.id}`, self.api.url);

                const params = auth({
                    method: 'GET',
                    url: url,
                    json: true,
                }, self.api.user);

                request(params, (err, res) => {
                    if (err) return reject(err);
                    if (res.statusCode !== 200) return reject(new Error(JSON.stringify(res.body)));

                    return resolve(res.body);
                });
            });
        }
    }
}

module.exports = Data;
