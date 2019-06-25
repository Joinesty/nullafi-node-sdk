<!-- Nullafi Node.js SDK
=============== -->

<!-- A Node.js interface to the [Nullafi API](http://enterprise-api.nullafi.com/docs).

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Copyright and License](#copyright-and-license) -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Installation
------------

[![NPM](https://nodei.co/npm/@joinesty/nullafi-node-sdk.png)](https://nodei.co/npm/@joinesty/nullafi-node-sdk/)

Nullafi SDK is supported on node versions above v10.14.0.

Getting Started
---------------
To get started with the SDK as a new developer, one must create a developer account. Go to the 
<a href="https://dashboard.nullafi.com/signup" target="_blank">Nullafi Signup Page</a>, and create a new developer account. As an account owner, you can retrieve the API key by going to the settings page, and selecting the 'API Key' tab. You may manage API key generation for the SDK from here. Create a new key and store the key value somewhere secure, as Nullafi will not store this key.

**Note:** Make sure to implement the nullafi-sdk in back end products only. Implementing the nullafi key on a front end product will expose the key to the public, and risk exposing private data. 

```js
const NullafiSDK = require('@joinesty/nullafi-node-sdk');

// We recommend storing your key in a secure non-public facing env file
const NULLAFI_API_KEY = ENV.fetch('NULLAFI_API_KEY')

// Since the Nullafi SDK makes use of the await feature in these examples, they must be run within an async function
const start = async () => {
	// Initialize the SDK with your API credentials
	const sdk = new NullafiSDK(NULLAFI_API_KEY);

	// Create a basic API client, which will also authenticate your client. 
	// Client authentication will expire after 60 minutes
	const client = await sdk.createClient();

	// Get your own user object from the Nullafi API
	// All client methods return a promise that resolves to the results of the API call,
	// or rejects when an error occurs
	// Adding tags is an important way to retrieve data
	const staticVault = await client.createStaticVault('my-static-vault', ['my-tag-1', 'my-tag-2']);
	const firstNameAliasObj = await staticVault.firstName.createFirstName('John', ['my-fName-tag1', 'my-fName-tag2']);
	console.log(firstNameAliasObj); 
	/*
		output example:
		{ 
			id: 'e490157b23534215b0369a2685aab47g', 
			firstname: 'John',
			firstnameAlias: 'Oliver', 
			tags: ['my-fName-tag1', 'my-fName-tag2'], 
			createdAt: '2018-07-13 T01:00:00Z' 
		}
	*/
}
start();
```

Authentication
------------
When a client is created, the client instance will be authenticated for a 60 minute period. After this time, you may either create a new client or refresh the existing client. 
```js
client.authenticate(NULLAFI_API_KEY);
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
The **ID** as well as the **Master Key** from the output will be used to retrieve the vault. These values must be stored in your database to retrieve the vault.
Retrieving a vault looks like this: 

```js
//Authenticated client
const client = await sdk.createClient();
// ID and Master key should be stored and retrieved from database
const staticVaultID = 'e490157b23534215b0369a2685aab47g';
const staticVaultMasterKey = 'MASTER_KEY';
const staticVault = await client.retrieveStaticVault(staticVaultID, staticVaultMasterKey);
```

You can also delete a vault using the vault ID. Deleting the vault will also remove all aliases stored within, so make sure data is properly saved before deleting a vault. Deleting a vault will return a response with a key of 'ok' and a boolean value. 

```js
//Authenticated client
const client = await sdk.createClient();
// ID should be stored and retrieved from database
const staticVaultID = 'e490157b23534215b0369a2685aab47g';
const staticVaultResponse = await client.deleteStaticVault(staticVaultID);
console.log(staticVaultResponse);
/*
	output example:
	{ 
		ok: true
	}
*/
}
```
Static Data Types
------------
### Address
Generates a fake address that will not trace to a real location. An optional parameter of state may be provided to choose the state associated with the fake address.

Address example:
```js
street, city, state abbreviation zipcode, USA
43520 Hills Flat, East Aricchester, AK 99761, USA

//example call
const addressAliasObj = await staticVault.address.createAddress('138 Congress St, Portland, ME 04101', 'ME', ['my-address-tag1', 'my-address-tag2']);
```

Providing an incorrect state abbreviation will return a random state. The list of acceptable inputs is below.
```text
'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY',
'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH',
'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
```
### Date of birth
Will generate a new date between the year span of 1949 and 2001. Year(YYYY) and month(MM) are both optional parameters that will set the date to the corresponding year and/or month. 

Date of birth example:
```js
YYYY-MM-DD
1980-12-20

//providing the optional year and month arguments 
const dobAliasObj = await staticVault.dateofbirth.createDateOfBirth('1999-07-02', '1999', '07', ['my-dob-tag1', 'my-dob-tag2']);
```
### Driver's license
Generates a randomly generated combination of numbers and letters based on the format of each state's format. A state may be provided as an optional parameter to return a license for that state. A list of formats may be viewed [**here**](https://ntsi.com/drivers-license-format/).

Providing an incorrect state abbreviation will return a random state. The list of acceptable inputs is below.
```text
'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY',
'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH',
'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
```

Example call: 
```js
//example call with optional state
const driverslicenseAliasObj = await staticVault.driversLicense.createDriversLicense('123456789', 'NY', ['my-driversLicense-tag1', 'my-driversLicense-tag2']);
```
### First name
Generates a random name with the optional input of gender. 

Genders available are:
```text
"male", 
"female"
```
Example call:
```js
const firstNameAliasObj = await staticVault.firstName.createFirstName('John', ['my-fName-tag1', 'my-fName-tag2']);
```
### Gender
Generates a random gender from a list.
Output options are: 
```text
"Male",
"Female",
"Other",
"Don't want to say"
```

Example call:
```js
const genderAliasObj = await staticVault.gender.createGender('male', ['my-gender-tag1', 'my-gender-tag2']);
```
### Generic
Generic takes a regular expression as input and will generate a value matching that expression. Use this to create formats not currently supported. Some example usages are for prescriptions, nations, and non-supported passport numbers. The template used to generate values will not be saved.

Example Generic Values:
```js
//input
\d{4}
//output
1234
//input
[a-zA-Z]{5}
//output
AbCde

//example call
const genericAliasObj = await staticVault.generic.createGeneric('Abcde', '[a-zA-Z]{5}', ['my-generic-tag1', 'my-generic-tag2']);
```

### Last name
Generates a random last name with optional input of gender. 

Example call:
```js
//example call
const lastNameAliasObj = await staticVault.lastName.createLastName('smith', ['my-lName-tag1', 'my-lName-tag2']);
```
### Passport number
Generates a random nine digit number. Currently only generates formats matching US passports.

Example call:
```js
//example call
const passportAliasObj = await staticVault.passport.createPassport('123456789', ['my-passport-tag1', 'my-passport-tag2']);
```
### Place of birth
Generates a random place of birth. An optional parameter of state may be provided to choose the state associated with the place of birth.

Place of birth example:
```js
city, state
Odachester, Washington

//example call with optional state param
const pobAliasObj = await staticVault.placeOfBirth.createPlaceOfBirth('Atlanta, Georgia', 'GA', ['my-pob-tag1', 'my-pob-tag2']);
```

Providing an incorrect state abbreviation will return a random state. The list of acceptable inputs is below.
```text
'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY',
'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH',
'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
```
### Race
Generates a random race from a list. 

Race example:
```js
const raceAliasObj = await staticVault.race.createRace('Native Hawaiian or Other Pacific Islander', ['my-race-tag1', 'my-race-tag2']);
```

Output options are: 
```text
"American Indian or Alaska Native",
"Asian",
"Black or African American",
"Native Hawaiian or Other Pacific Islander",
"White",
"Other",
"Hispanic or Latino"
``` 
### Random
Generates a random string value consisting of upper and lower case letters that will be 20, 35, 50, or 80 characters long. Similar to the generic generator, but does not need a template.

Random example:
```js
const randomAliasObj = await staticVault.race.createRandom('random value', ['my-race-tag1', 'my-race-tag2']);
```
### Social security number
Generates a random social security number. An optional parameter of state may be provided to choose the state used to generate the ssn.

Output format:
```js
###-##-####

//example call
const ssnAliasObj = await staticVault.ssn.createSSN('123-45-6789', ['my-ssn-tag1', 'my-ssn-tag2']);
```
### Tax payer ID
Generates a random tay payer ID. Currently only produces ITIN(Individual Taxpayer Identification Number) values.

Output format: 
```js
9#-##-####

//example call
const taxPayerIDAliasObj = await staticVault.taxPayerID.createTaxPayerID('92-45-6789', ['my-taxPayerID-tag1', 'my-taxPayerID-tag2']);
```
### Vehicle registration
Generates a random vehicle registration. Vehicle registration is 3 Capitalized letters followed by 4 digits.

Example Output: 
```js
ABC·1234

//example call
const vehicleRegistrationAliasObj = await staticVault.vehicleRegistration.createVehicleRegistration('92-45-6789', ['my-vehicleRegistration-tag1', 'my-vehicleRegistration-tag2']);
```

Communication Vaults
------------
Communicataion vaults will store aliases for data types that will need to maintain their transactional integrity. Creating a communication vault is a similar process to a static vault, but the data aliased inside will be different. 

The alias generated for communication emails will be a functioning email. Nullafi will handle receiving messages to this address and relaying them to the real email address. White list senders and domains are added to control who may contact these users. Control for these emails may be found in the <a href="https://dashboard.nullafi.com/login" target="_blank">Nullafi Dashboard</a> under the **'System'** tab.

```js
const client = await sdk.createClient();
const communicationVault = await client.createCommunicationVault('my-communication-vault', ['my-tag-1', 'my-tag-2']);
console.log(communicationVault)
/*
	output example:
	{ 
		id: 'e490157b23534215b0369a2685aab47g', 
		name: 'my-communication-vault',
		masterKey: 'MASTER_KEY',
		tags: ['my-tag-1', 'my-tag-2'], 
		createdAt: '2018-07-13 T01:00:00Z' 
	}
*/
```
The **ID** as well as the **Master Key** from the output will be used to retrieve the vault. These values must be stored in your database to retrieve the vault.
Retrieving a vault looks like this: 

```js
//Authenticated client
const client = await sdk.createClient();
// ID and Master key should be stored and retrieved from database
const communicationVaultID = 'e490157b23534215b0369a2685aab47g';
const communicationVaultMasterKey = 'MASTER_KEY';
// ID and Master key should be stored and retrieved from database
const communicationVault = await client.retrieveCommunicationVault(communicationVaultID, communicationVaultMasterKey);
```

You can also delete a vault using the vault ID. Deleting the vault will also remove all aliases stored within, so make sure data is properly saved before deleting a vault. Deleting a vault will return a response with a key of 'ok' and a boolean value. 

```js
//Authenticated client
const client = await sdk.createClient();
// ID should be stored and retrieved from database
const communicationVaultID = 'e490157b23534215b0369a2685aab47g';
const communicationVaultResponse = await client.deleteCommunicationVault(communicationVaultID);
console.log(communicationVaultResponse);
/*
	output example:
	{ 
		ok: true
	}
*/
}
```

Communication Data Types
------------
### Email
Generating email aliases will provide a new functional email to use in place of the real email. These alias addresses will work as relays to the real address, while also providing the ability to white list approved sender domains and addresses. 

Email example:
```js
//input
realEmail@gmail.com
//output
cizljfhxrazvcy@fipale.com

//example call
const emailAlias = await communicationVault.email.createEmail('realEmail@gmail.com', ['my-tag-1', 'my-tag-2']);
```

Copyright and License
---------------------

Copyright 2019 Joinesty, Inc. All rights reserved.
