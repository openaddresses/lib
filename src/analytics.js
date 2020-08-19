#!/usr/bin/env node

'use strict';

const chart = require('asciichart');
const {auth} = require('./util');
const request = require('request');
const prompt = require('prompt');

/**
 * @class Analytics
 * @public
 */
class Analytics {
    /**
     * Create a new Schedule Instance
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
        console.error('Immediately execute a normally scheduled event');
        console.error();
        console.error('Usage: cli.js analytics <subcommand>');
        console.error();
        console.error('<subcommand>:');
        console.error('    collections      Downloaded collection analytics');
        console.error('    traffic          Session traffic analytics');
        console.error();
    }

    /**
     * Queries OA /api/dash/collections endpoint
     *
     * @param {!Object} options Options for making a request
     *
     * @return {Promise}
     */
    async collections(options = {}) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            options.output = process.stdout;

            await main();
        } else if (options.cli) {
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
                let url = new URL(`/api/dash/collections`, self.api.url);

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
     * Queries OA /api/dash/traffic endpoint
     *
     * @param {!Object} options Options for making a request
     *
     * @return {Promise}
     */
    async traffic(options = {}) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            options.output = process.stdout;

            await main();
        } else if (options.cli) {
            try {
                const body = await main();

                if (options.raw) {
                    console.log(JSON.stringify(body, null, 4));
                } else {
                    console.log();
                    console.log('Session Traffic');
                    console.log();
                    console.log(chart.plot(body.datasets[0].data.map(d => d.y)));
                    console.log();
                }
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
                let url = new URL(`/api/dash/traffic`, self.api.url);

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

module.exports = Analytics;
