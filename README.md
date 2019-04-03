Nullafi Node.js SDK
===============

A Node.js interface to the [Nullafi API](http://enterprise-api.nullafi.com/docs).

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Copyright and License](#copyright-and-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Installation
------------

```
npm install --save nullafi-node-sdk
```

Getting Started
---------------

To get started with the SDK, get a API Key from the Configuration page
of your app in the [Settings Page - API Key][settings-api-key].
You can use this token to make calls for your own Nullafi account.

```js
var NullafiSDK = require('nullafi-node-sdk');

// Initialize the SDK with your API credentials
var sdk = new NullafiSDK();

// Create a basic API client, which does not automatically refresh the access token
var client = sdk.getBasicClient('API_KEY');

// Get your own user object from the Box API
// All client methods return a promise that resolves to the results of the API call,
// or rejects when an error occurs
client.vault.emailAddress.get('original.email@domain.com')
	.then(token => console.log('My tokenized email:', token.email, '!'))
	.catch(err => console.log('Got an error!', err));
```

[settings-api-key]: https://app.box.com/developers/console


Copyright and License
---------------------

Copyright 2019 Joinesty, Inc. All rights reserved.