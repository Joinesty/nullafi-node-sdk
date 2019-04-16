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
const NullafiSDK = require('nullafi-node-sdk');

// Initialize the SDK with your API credentials
const sdk = new NullafiSDK('API_KEY');

// Create a basic API client, which does not automatically refresh the access token
const client = await sdk.createClient();

// Get your own user object from the Nullafi API
// All client methods return a promise that resolves to the results of the API call,
// or rejects when an error occurs

const staticVault = await client.addStaticVault('my-static-vault', ['my-tag-1', 'my-tag-2']);
const firstNameTokenObj = await staticVault.firstName.postFirstName('John Doe', ['my-fName-tag1', 'my-fName-tag2']);
 id: 'e490157b23534215b0369a2685aab47g',
                firstnameToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
console.log(firstNameTokenObj); 
/*
	output example:
	{ 
		id: 'e490157b23534215b0369a2685aab47g', 
		firstname: 'John Doe', 
		firstnameToken: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=', 
		tags: ['my-fName-tag1', 'my-fName-tag2'], 
		createdAt: '2018-07-13 T01:00:00Z' 
	}
*/
```

[settings-api-key]: https://dashboard.nullafi.com/admin/settings/api


Copyright and License
---------------------

Copyright 2019 Joinesty, Inc. All rights reserved.
