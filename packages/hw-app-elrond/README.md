<img src="https://user-images.githubusercontent.com/211411/34776833-6f1ef4da-f618-11e7-8b13-f0697901d6a8.png" height="100" />

[Github](https://github.com/LedgerHQ/ledgerjs/),
[Ledger Devs Slack](https://ledger-dev.slack.com/)

## @ledgerhq/hw-app-elrond

Ledger Hardware Wallet Elrond JavaScript bindings.

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

*   [getAppConfiguration](#getappconfiguration)
    *   [Examples](#examples)
*   [getAddress](#getaddress)
    *   [Parameters](#parameters)
    *   [Examples](#examples-1)
*   [setAddress](#setaddress)
    *   [Parameters](#parameters-1)
    *   [Examples](#examples-2)
*   [signTransaction](#signtransaction)
    *   [Parameters](#parameters-2)

### getAppConfiguration

Get Elrond app configuration.

#### Examples

```javascript
const result = await elrond.getAppConfiguration();
const { contractData, accountIndex, addressIndex, version } = result;
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<{contractData: ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)), accountIndex: ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)), addressIndex: ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)), version: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)}>** an object with a contractData, accountIndex, addressIndex, version

### getAddress

Get Elrond address for a given BIP 32 path.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** a path in BIP 32 format
*   `display` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** optionally enable or not the display

#### Examples

```javascript
const result = await elrond.getAddress("44'/508'/0'/0'/0'");
const { address, returnCode } = result;
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<{address: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)}>** an object with a address

### setAddress

Set Elrond address for a given BIP 32 path.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** a path in BIP 32 format
*   `display` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** optionally enable or not the display

#### Examples

```javascript
const result = await elrond.setAddress("44'/508'/0'/0/0");
result : Buffer;
```

Returns **any** an object with a address

### signTransaction

Sign Elrond transaction for a given BIP 32 path.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** a path in BIP 32 format
*   `message` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** string with an unsigned transaction
*   `usingHash` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** boolean wich indicate if transaction is hash or raw

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** a signature for transaction

## getAppConfiguration

Get Elrond app configuration.

### Examples

```javascript
const result = await elrond.getAppConfiguration();
const { contractData, accountIndex, addressIndex, version } = result;
```

Returns **[Promise][11]<{version: [string][12]}>** an object with a contractData, accountIndex, addressIndex, version

[1]: #getappconfiguration

[2]: #examples

[3]: #getaddress

[4]: #parameters

[5]: #examples-1

[6]: #setaddress

[7]: #parameters-1

[8]: #examples-2

[9]: #signtransaction

[10]: #parameters-2

[11]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[12]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[13]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
