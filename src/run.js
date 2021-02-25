const { promisify } = require('util');
const request = promisify(require('request'));

async function run(api, url, body) {
    const schema = api.schema.schema[url]

    const req = {
        json: true,
        url: new URL('/api/' + url.split(' ')[1], api.url + '/api'),
        method: url.split(' ')[0]
        headers: {}
    };

    if (body) req.body = body;

    if (api.username && api.password) {
        req.auth = {
            'user': api.username,
            'pass': api.password
        };
    }

    if (api.token) {
        req.auth = {
            bearer: api.token
        };
    }

    if (api.secret) {
        req.headers['shared-secret'] = api.secret;
    }

    const res = await request(req);

    return res.body;
}

module.exports = run;
