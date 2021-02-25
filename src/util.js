const { promisify } = require('util');
const request = promisify(require('request'));
const fs = require('fs');
const path = require('path');

async function schema(api) {
    const res = await request({
        json: true,
        method: 'GET',
        url: new URL(`/api/schema`, api.url)
    });

    if (res.statusCode !== 200) throw new Error(res.body.message ? res.body.message : res.body);

    const local = JSON.parse(fs.readFileSync(path.resolve(__dirname, './schema.json')));

    local.schema = res.body;

    fs.writeFileSync(path.resolve(__dirname, './schema.json'), JSON.stringify(local, null, 4));

    return local;
}

module.exports = {
    schema
};

