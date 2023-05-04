# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

## Version History

### v2.4.2

- :rocket: Include an error handler if the `.json` call has already consumed the body and `.text` cannot be called

### v2.4.1

- :arrow_up: General Dep Update

### v4.4.0

- :rocket: Automate NPM Releases

### v4.2.0

- :bug: Fix query payload

### v4.1.0

- :bug: Fix body payload

### v4.0.0

- :rocket: Require node >= 18 & Use internal `fetch`

### v3.1.1

- :bug: await promise on text returns

### v3.1.0

- :tada: Add the ability to explicityly request a `Response`

### v3.0.0

- :rocket: Migrate library to ES Module

### v2.8.0

- :rocket: Add support for `GET /map/features`

### v2.7.0

- :rocket: Add support for `GET /map/:mapid`

### v2.6.0

- :tada: Allow scripting params via the cli ie: --:job 123
- :bug: Add support for binary output if an extension is present in URL
- :rocket: Add support for validated data downloads

### v2.5.4

- :arrow_up: Update ESLint & remove Babel now that ECMA v13 is supported

### v2.5.3

- :tada: Add API descriptions to help documentation

### v2.5.2

- :tada: Add `oa` to bin of package.json

### v2.5.1

- :arrow_up: General Dep Update

### v2.5.0

- :rocket: Add basic support for automatically generating CLI prompt flows for body contents

### v2.4.1

- :bug: remove hashbang for web compat

### v2.4.0

- :tada: Add support for query params

### v2.3.0

- :rocket: Add new API Endpoints (job#raw, export#download)

### v2.2.3

- :bug: Fix error message formatting

### v2.2.2

- :bug: Better response body error handling

### v2.2.1

- :bug: Better async error handling

### v2.2.0

- :bug: Fix authentication
- :tada: Add exports API support
- :rocket: Add suppport for request params/body

### v2.1.0

- :tada: Add support for query params

### v2.0.0

- :tada: Automatically generate CLI from Schema API
- :rocket: Add support for all JSON apis

### v1.3.0

- :tada: Add support for `POST /run` and `POST /run/:run/jobs`

### v1.2.0

- :tada: Add support for `GET /data` and `GET /data/:data`

### v1.1.1

- :rocket: move to `inquirer` for better async prompt support

### v1.1.0

- :tada: Add support for `GET /api/dash/traffic`
- :tada: Add support for `GET /api/dash/collections`
- :rocket: Add centralized request auth manager

### v1.0.1

- :tada: Add support for `POST /api/schedule`

### v0.0.1

- :rocket: Initial Frameworking

