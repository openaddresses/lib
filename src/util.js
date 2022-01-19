'use strict';
const { promisify } = require('util');
const request = promisify(require('request'));
const fs = require('fs');
const path = require('path');

function local_schema() {
    const local = JSON.parse(fs.readFileSync(path.resolve(__dirname, './schema.json')));
    return local;
}

async function schema(url, method, path) {
    url = new URL('/api/schema', url);

    if (method) url.searchParams.append('method', method);
    if (path) url.searchParams.append('url', path);

    const res = await request({
        json: true,
        method: 'GET',
        url: url
    });

    if (res.statusCode !== 200) throw new Error(res.body.message ? res.body.message : res.body);

    if (!method && !path) {
        const local = local_schema();
        local.schema = res.body;

        fs.writeFileSync(path.resolve(__dirname, './schema.json'), JSON.stringify(local, null, 4));

        return local;
    } else {
        return res.body;
    }
}

module.exports = {
    schema,
    local_schema
};

