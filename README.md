<!-- Nullafi Node.js SDK
=============== -->

<!-- A Node.js interface to the [Nullafi API](http://enterprise-api.nullafi.com/docs).

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Copyright and License](#copyright-and-license) -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Installation
------------

```
npm install --save nullafi-node-sdk
```
Getting Started
---------------
To get started with the SDK, one must be a 'Super Owner' on a nullafi account. Go to the settings page, and select the 'API Key' tab. Create a new key and store the key value somewhere secure, as Nullafi will not store this key for security reasons. You can use this key to make calls through the Nullafi SDK.

```js
const NullafiSDK = require('nullafi-node-sdk');

// Initialize the SDK with your API credentials
const sdk = new NullafiSDK('API_KEY');

// Create a basic API client, which does not automatically refresh the access token
const client = await sdk.createClient();

// Get your own user object from the Nullafi API
// All client methods return a promise that resolves to the results of the API call,
// or rejects when an error occurs

const staticVault = await client.createStaticVault('my-static-vault', ['my-tag-1', 'my-tag-2']);
const firstNameAliasObj = await staticVault.firstName.createFirstName('John Doe', ['my-fName-tag1', 'my-fName-tag2']);
console.log(firstNameAliasObj); 
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

Authentication
------------
The client authentication period will last 60 minutes. The client will authenticate on instatiation. 
```text
const client = await sdk.createClient();
//after 60 minutes
client.authenticate('API_KEY');
```


Static Vaults
------------
Static vaults are used to hold all created aliases for non transactional data. Static Vaults can be managed through the Static Vault class.

There is no limit on how many types of data may be stored in one static vault. It is up to users to determine how to split their data into vaults. Note that the master key must be stored to retrieve the vault at later times.  
A Static Vault can be created like this:
```js
const client = await sdk.createClient();
const staticVault = await client.createStaticVault('my-static-vault', ['my-tag-1', 'my-tag-2']);
console.log(staticVault)
/*
	output example:
	{ 
		id: 'e490157b23534215b0369a2685aab47g', 
		name: 'my-static-vault',
		masterKey: 'MASTER_KEY',
		tags: ['my-tag-1', 'my-tag-2'], 
		createdAt: '2018-07-13 T01:00:00Z' 
	}
*/
```

Retrieving a vault looks like this: 

```js
const client = await sdk.createClient();
const staticVault = await client.retrieveStaticVault(client, 'e490157b23534215b0369a2685aab47g', 'MASTER_KEY');
```

Static Data Types
------------
* address
* date of birth
* driver's license
* first name
* gender
* generic
* last name
* passport number
* place of birth
* race
* random
* social security number
* tax payer ID
* vehicle registration

Communication Vaults
------------
Communicataion vaults will store aliases for data types that will need to maintain their transactional integrity. Control for these data types may be customized in the Nullafi dashboard under the 'System' tab. 

```js
const client = await sdk.createClient();
const communicationVault = await client.createCommunicationVault('my-communication-vault', ['my-tag-1', 'my-tag-2']);
console.log(staticVault)
/*
	output example:
	{ 
		id: 'e490157b23534215b0369a2685aab47g', 
		name: 'my-communication-vault,
		masterKey: 'MASTER_KEY',
		tags: ['my-tag-1', 'my-tag-2'], 
		createdAt: '2018-07-13 T01:00:00Z' 
	}
*/
```

Retrieving a communication vault looks like this: 
```js
const client = await sdk.createClient();
const staticVault = await client.retrieveStaticVault(client, 'e490157b23534215b0369a2685aab47g', 'MASTER_KEY');
```

Communication Data Types
------------
* email

Copyright and License
---------------------

Copyright 2019 Joinesty, Inc. All rights reserved.
