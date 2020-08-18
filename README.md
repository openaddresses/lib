<h1 align='center'>OpenAddresses CLI & Lib</h1>

<p align='center'>Javascript Library and CLI for the <a href='https://github.com/openaddresses/batch'>OpenAddresses API</a></p>

## General Usage

### Installation

**JS Library**

```sh
yarn add 'oa'
```

**CLI**

```sh
yarn global add 'oa'
```

<h3 align=center>Instantiation</h3>

Note: if the username & password is not explicitly set, OA will fallback to checking for
a `OA_USERNAME` & `OA_PASSWORD` environment variable. For the `url` parameter, be sure to include the protocol and (if necessary) port number.

Alternatively an API token can be provided via a `OA_TOKEN` environment variable, or the server secret via the `OA_SECRET` variable.

**JS Library**

```js
const OA = require('oa');

const oa = new OA({
    username: 'ingalls',
    password: 'yeaheh',
    url: 'http://example.openaddresses.io',
});
```

**CLI**

The CLI tool must be provided the URL to connect to for each subcommand.
This can be accomplished by providing the URL to a local or remote OA server. Be sure to include the protocol and, for local connections, the port number.

```sh
# Connecting to a remote oa server
./cli.js --url 'https://example.openaddresses.io'
```

```sh
# Connecting to a local oa dev server
./cli.js --url 'http://localhost:5000'
```
