

# VIES-VAT - European VAT Number Validation
<p dir='auto'>
  <a href="https://bitinix.com"><img alt="VIES-VAT status Badge" src="https://img.shields.io/badge/build-passing-brightgreen" style="max-width: 100%;"></a>
  <a href="https://bitinix.com"><img alt="VIES-VAT license Badge" src="https://img.shields.io/badge/license-MIT-green" style="max-width: 100%;"></a>
  <a href="https://bitinix.com"><img alt="VIES-VAT license Badge" src="https://img.shields.io/github/last-commit/bitinix/VIES-VAT" style="max-width: 100%;"></a>
   <a href="https://twitter.com/bitinixdev" target="_blank"><img alt="VIES-VAT twitter Badge" src="https://img.shields.io/badge/Tweet--lightgrey?logo=twitter&style=social" style="max-width: 100%;"></a>
</p>

## What is VIES-VAT ?
A lightweight quick and easy to use NPM package written in node.js  A simple request with country code & VAT number ( timeout & debug optional ) will allow you to verify the validity of a VAT number issued by any European Union Member State via the VIES System. The returned response will show whether the VAT number is valid or not and any extra company information where available.

## What is VIES ?
VIES (VAT Information Exchange System) is an electronic means of validating VAT-identification ( VATIN ) numbers of economic operators registered in the European Union for cross border transactions on goods or service.

## Integration Support
Contact the developer at bitinix@gmail.com

## Get started
```bash
npm install --save vies-vat
```

#### Valid CountryCodes
```bash
AT BE BG HR CY CZ DK EE FI FR DE EL HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE XI
```
#### Callback example
```javascript
var vies = require('VIES-VAT');

var viesOptions = {
    "countryCode": "xx", // ie FR
    "vatNumber": 'xxxxxx', // vat Number without country code
    "timeout": 10000 // optional - default 30000 ( 30 seconds )
}

vies(viesOptions, function (error, viesInfo) {
    if (error) console.log('vies callback test - error ', error)
    
    console.log('vies callback test ', viesInfo)
});

```
#### async/await example
```javascript
var vies = require('VIES-VAT');

awaitTest()
async function awaitTest() {
    var viesOptions = {
        "countryCode": "xx", // ie FR
        "vatNumber": 'xxxxxx', // vat Number without country code
        "timeout": 10000 // optional - default 30000 ( 30 seconds )
    }

    var res = await vies(viesOptions)
    if (res.error) console.log('vies sync test - error ', res.error)

    console.log('vies sync test Result ', res.viesInfo)
}
```

##### Valid Response
```javascript
{
  valid: true,
  countryCode: 'xx',
  vatNumber: 'xxxxxxx',
  requestDate: '2021-12-08+01:00',
  name: 'Company Name', // if available
  address: 'Company Address' // if available
}
```
##### Invalid Response
```javascript
{
  valid: false,
  countryCode: 'xx',
  vatNumber: 'xxxxxxxxxx',
  requestDate: '2021-12-08+01:00',
  name: false,
  address: false,
  error : 'Error message'
}
```
##### Error Messages
```javascript
  'vies Badly formed request - Check vatNumber & countryCode'
  'vies Badly formed request - vatNumber is empty'
  'vies Badly formed request - countryCode is empty'
  'vies Badly formed request - Not EU Country'
  'vies vies call error'
  'vies Timeout'
```

##### Debug
Add the Debug key to your options<br />
This will give more details of the call including errors<br />
```javascript
debugTest()
async function debugTest() {
  var viesOptions = {
        "countryCode": "xx", // ie FR
        "vatNumber": 'xxxxxx', // vat Number without country code
        "timeout": 60000, // optional - default 30000 ( 30 seconds )
        "debug": true // optional - default false
      }
  var res = await vies(viesOptions)
  if (res.error) console.log('vies debug test - error ', res.error)
  console.log('vies debug test Result ', res.viesInfo)
}
```
## Common Issues

### Receive Error when testing a valid VAT Number
This could be an internet connection issue or dns lookup<br />
Check that you can ping 'ec.europa.eu' from your server<br />
Add the following entry to your host file:-<br />
147.67.34.30 ec.europa.eu<br />
<br />
## Change Log

### 1.2.2
Apply EU Updates<br />

### 1.2.1
Make for public use on GITHUB<br />
    
## License
The MIT License (MIT)

Copyright (c) 2022 bitinix@gmail.com<br />

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
