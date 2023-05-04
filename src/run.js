import path from 'path';

/**
 * Make a request to the API and return the response
 *
 * @param {OA}      api OA Instance
 * @param {Object}  schema API Schema
 * @param {String}  url URL
 * @param {Object}  payload payload
 * @param {Object}  opts - Options
 * @param {Boolean} [opts.stream=false] - Return a streamable response
 */
export default async function run(api, schema, url, payload, opts = {}) {
    const req_url = new URL('/api' + url.split(' ')[1], api.url + '/api');

    const req = {
        method: url.split(' ')[0],
        headers: {}
    };

    if (!!path.parse(req_url.pathname).ext && path.parse(req_url.pathname).ext !== 'json') {
        req.encoding = null;
    }

    if (api.user.token) {
        req.headers['Authorization'] = `Bearer ${api.user.token}`;
    } else if (api.user.secret) {
        req.headers['shared-secret'] = api.user.secret;
    } else if (req.auth && req.auth.username && req.auth.password) {
        req.headers['Authorization'] = 'Basic ' + btoa(api.user.username + ':' + api.user.password);
    }

    if (schema.body) {
        if (typeof payload === 'object') {
            req.body = JSON.stringify(payload);
            req.headers['Content-Type'] = 'application/json';
        } else {
            req.body = payload;
        }
    } else {
        delete req.body;
    }

    if (schema.query) {
        for (const key of Object.keys(payload)) {
            req_url.searchParams.append(key, payload[key]);
        }
    }

    const res = await fetch(req_url, req);

    if (!res.ok) {
        let body;

        try {
            body = await res.json();
        } catch (prime_err) {
            try {
                throw new Error(res.status + ': ' + await res.text() + ' - ' + prime_err.message);
            } catch (sec_err) {
                throw new Error(res.status + ': ' + prime_err.message + ' - ' + sec_err);
            }
        }

        if (body && body.message) {
            throw new Error(res.status + ': ' + body.message);
        } else {
            throw new Error(res.status + ': ' + 'No .message');
        }
    }

    if (opts.stream || (!!path.parse(req_url.pathname).ext && path.parse(req_url.pathname).ext !== 'json')) {
        return res.body;
    } else {
        const body = await res.json();
        return body;
    }
}
