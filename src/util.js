/**
 * Add authentication information to a request
 *
 * @param {Object} params request params
 * @param {Object} user OA User object
 *
 * @returns {Object}
 */
function auth(params, user) {
    if (!params.headers) params.headers = {};

    if (user.secret) {
        params.headers['shared-secret'] = user.secret;
    } else if (user.username && user.password) {
        params.headers['Authorization'] = `Basic ${new Buffer(`${user.username}:${user.password}`).toString("base64")}`;
    } else if (user.token) {
        params.headers['Authorization'] = `Bearer ${user.token}`;
    }

    return params;
}

module.exports = {
    auth
}