'use strict';
import fetch from 'node-fetch';
import path from 'path';

export default async function run(api, schema, url, payload) {
    const req = {
        json: true,
        url: new URL('/api' + url.split(' ')[1], api.url + '/api'),
        method: url.split(' ')[0],
        headers: {}
    };

    if (path.parse(String(req.url)).ext !== 'json') {
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
            req.url.searchParams.append(key, payload[key]);
        }
    }

    const res = await fetch(req.url, req);

    if (res.statusCode !== 200) {
        if (typeof res.body === 'object') {
            if (res.body.message) {
                throw new Error(res.statusCode + ': ' + res.body.message);
            } else {
                throw new Error(res.statusCode + ': ' + 'No .message');
            }
        }

        throw new Error(res.body);
    }

    return res.body;
}
