# @interop/http-signature-header

JavaScript library, fork of (`@digitalbazaar/http-signature-header`) for creating and
verifying HTTP Signature headers, implementing
the [Cavage HTTP Signatures Draft 12](https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures-12)
spec.

This library is a low-level building block used by zCap (Authorization
Capability) implementations. Higher-level zCap clients (e.g.
`@interop/ezcap`) call into this library to construct the
`Authorization` and signature string components of HTTP requests.

## Package Info

- **npm**: `@interop/http-signature-header`
- **Module type**: ESM (`"type": "module"`)
- **Node.js**: >=14
- **License**: BSD-3-Clause

## Project Structure

```
lib/
  index.js          # Main exports: createAuthzHeader, createSignatureString,
                    #   parseRequest, parseSignatureHeader, extractPseudoHeaders
  HttpSignatureError.js  # Custom error class (name, type)
  util.js           # Node.js: re-exports assert-plus
  util-browser.js   # Browser: browser-compatible assert shim
bin/
  http-signature-header-js.js   # CLI entry
  http-signature-header-js-c14n # Canonicalization subcommand
  http-signature-header-js-sign # Sign subcommand
  http-signature-header-js-verify # Verify subcommand
  io.js / util.js   # CLI helpers
tests/
  10-test.spec.js   # Mocha/Chai tests for all exported functions
  parseRequest.js   # Test helper
```

## Key API

### `createSignatureString({ includeHeaders, requestOptions })`

Builds the canonicalized signing string from a list of covered
headers/pseudo-headers and a request object (`{ url, method, headers }`). Header
names are lowercased; `(request-target)` is `method path`; `host` is extracted
from the URL.

###
`createAuthzHeader({ includeHeaders, keyId, signature, algorithm?, created?, expires? })`

Returns the `Authorization: Signature ...` header string. `created`/`expires`
must be UNIX timestamps (integer or string) or `Date` objects.

### `parseRequest(request, options?)`

Parses and validates an incoming request's `Authorization` header. Enforces
clock skew (default 300s), validates `(created)`/`(expires)` pseudo-headers, and
reconstructs the signing string for verification. Returns
`{ scheme, params, signingString, algorithm, keyId }`.

### `parseSignatureHeader(sigString)`

Low-level parser for either an `Authorization` or `Signature` header value.
Returns `{ scheme, params, signingString }`.

### Pseudo-headers

`(created)`, `(expires)`, `(algorithm)`, `(key-id)` — extracted from signature
params, not from actual HTTP headers. Older algorithms (`rsa-*`, `hmac-*`,
`ecdsa-*`) cannot use `(created)` or `(expires)`.

## Commands

```bash
npm test              # Run Node.js tests (mocha)
npm run test-karma    # Run browser tests (karma + webpack)
npm run lint          # ESLint
npm run coverage      # c8 coverage
```

## Testing

- Framework: Mocha + Chai (`chai.should()` style)
- Tests live in `tests/10-test.spec.js`
- Use `pnpm` (there is a `pnpm-lock.yaml`)
- Browser tests via `karma.conf.cjs` + webpack

## Spec Context

- **Current deployments** use Cavage HTTP Signatures Draft 12 (
  `Authorization: Signature ...`) and the `Digest` header from
  `draft-ietf-httpbis-digest-headers-05`.
- **Future** iterations are expected to migrate
  to [RFC 9421: HTTP Message Signatures](https://www.rfc-editor.org/rfc/rfc9421.html) (
  `Signature-Input`, `Signature`, `Content-Digest` headers).
- This library targets the current (Cavage) format.

## Usage in zCap Context

When used with zCaps, the signing workflow is:

1. Construct `Capability-Invocation` header (handled by ezcap, not this library)
2. Optionally construct `Digest` header for requests with a body
3. Call `createSignatureString({ includeHeaders, requestOptions })` to get the
   plaintext to sign
4. Sign with the private key, base64url-encode the result
5. Call
   `createAuthzHeader({ includeHeaders, keyId, signature, created, expires })`
   to get the `Authorization` header

Typical `includeHeaders` for a zCap request:

```js
['(key-id)', '(created)', '(expires)', '(request-target)', 'host', 'capability-invocation']
// add 'content-type', 'digest' for requests with a body
```