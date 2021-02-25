const { promisify } = require('util');
const request = promisify(require('request'));

async function run(api, url) {
    const schema = api.schema.schema[url]

    const res = await request({
        json: true,
        url: new URL('/api/' + url.split(' ')[1], api.url + '/api'),
        method: url.split(' ')[0]
    });

    return res.body;
}

module.exports = run;
