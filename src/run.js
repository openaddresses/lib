const { promisify } = require('util');
const request = promisify(require('request'));

async function run(api, url, params, body) {
    const schema = api.schema.schema[url]

    const req = {
        json: true,
        url: new URL('/api/' + url.split(' ')[1], api.url + '/api'),
        method: url.split(' ')[0],
        headers: {}
    };

    if (body) req.body = body;

    if (api.user.username && api.user.password) {
        req.auth = {
            'user': api.user.username,
            'pass': api.user.password
        };
    }

    if (api.user.token) {
        req.auth = {
            bearer: api.user.token
        };
    }

    if (api.user.secret) {
        req.headers['shared-secret'] = api.user.secret;
    }

    const res = await request(req);

    return res.body;
}

module.exports = run;
