# HTTP Signature Header _(@interop/http-signature-header)_

[![NPM Version](https://img.shields.io/npm/v/http-signature-header.svg)](https://npm.im/http-signature-header)
[![Build Status](https://img.shields.io/github/actions/workflow/status/interop-alliance/http-signature-header/main.yaml)](https://github.com/interop-alliance/http-signature-header/actions/workflows/main.yaml)
[![Coverage Status](https://img.shields.io/codecov/c/github/interop-alliance/http-signature-header)](https://codecov.io/gh/interop-alliance/http-signature-header)

> A JavaScript library for creating and verifying HTTP Signature headers

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Background

**[HTTP Signatures IETF draft](https://tools.ietf.org/html/draft-cavage-http-signatures)**

## Install

To install locally (for development):

```
git clone https://github.com/interop-alliance/http-signature-header.git
cd http-signature-header
npm install
```

## Usage

```js
import {
  createAuthzHeader, createSignatureString
} from '@interop/http-signature-header';

const requestOptions = {
  url,
  method: 'POST',
  headers
}
const includeHeaders = ['expires', 'host', '(request-target)'];
const plaintext = createSignatureString({includeHeaders, requestOptions});

const data = new TextEncoder().encode(plaintext);
const signature = base64url.encode(await signer.sign({data}));

const Authorization = createAuthzHeader({
  includeHeaders,
  keyId: signer.id,
  signature
});
```

## Contribute

Please follow the existing code style.

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[BSD-3-Clause](LICENSE.md) © Digital Bazaar
