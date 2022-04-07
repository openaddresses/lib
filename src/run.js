
import fetch from 'node-fetch';
import path from 'path';

export default async function run(api, schema, url, payload) {
    const req_url = new URL('/api' + url.split(' ')[1], api.url + '/api');

    const req = {
        json: true,
        method: url.split(' ')[0],
        headers: {}
    };

    if (!!path.parse(req_url.pathname).ext && path.parse(req_url.pathname).ext !== 'json') {
        req.encoding = null;
    }

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

    if (schema.body) {
        req.body = payload;
    } else if (schema.query) {
        for (const key of Object.keys(payload)) {
            req_url.searchParams.append(key, payload[key]);
        }
    }

    const res = await fetch(req_url, req);

    if (res.status !== 200) {
        try {
            const body = await res.json();

            if (body && body.message) {
                throw new Error(res.status + ': ' + body.message);
            } else {
                throw new Error(res.status + ': ' + 'No .message');
            }
        } catch (err) {
            const text = res.text();
            throw new Error(res.status + ': ' + text);
        }
    }

    if (!!path.parse(req_url.pathname).ext && path.parse(req_url.pathname).ext !== 'json') {
        return res.body;
    } else {
        const body = await res.json();
        return body;
    }
}
