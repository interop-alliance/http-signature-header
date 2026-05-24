/*!
 * Copyright (c) 2018-2022 Digital Bazaar, Inc. All rights reserved.
 */

export type HttpSignatureErrorType =
  | 'SyntaxError'
  | 'ConstraintError'
  | 'DataError'
  | 'InvalidStateError';

export declare class HttpSignatureError extends Error {
  name: HttpSignatureErrorType;
  constructor(message: string, name: HttpSignatureErrorType);
}

/**
 * Raw (unvalidated) params from the low-level `parseSignatureHeader` parser.
 * All fields are optional; use `SignatureParams` for validated output from
 * `parseRequest`.
 */
export interface RawSignatureParams {
  keyId?: string;
  signature?: string;
  /** Space-separated string in raw form; array after `parseRequest` processing. */
  headers?: string | string[];
  algorithm?: string;
  /** UNIX timestamp string. */
  created?: string;
  /** UNIX timestamp string. */
  expires?: string;
  [key: string]: unknown;
}

export interface SignatureParams {
  keyId: string;
  signature: string;
  /** Space-separated string in raw form; array after `parseRequest` processing. */
  headers: string | string[];
  algorithm?: string;
  /** UNIX timestamp string. */
  created?: string;
  /** UNIX timestamp string. */
  expires?: string;
  [key: string]: unknown;
}

export interface ParsedSignature {
  scheme: string;
  params: RawSignatureParams;
  signingString: string;
}

export interface ParsedRequest extends ParsedSignature {
  /** Validated by `parseRequest`; all required fields are present. */
  params: SignatureParams;
  /** Uppercased algorithm from params, or `undefined` if not present. */
  algorithm: string | undefined;
  keyId: string;
}

export interface RequestOptions {
  url: string;
  method: string;
  headers: Record<string, string | string[] | Date>;
  /** Value for the `(key-id)` pseudo-header. */
  keyId?: string;
  /** Value for the `(algorithm)` pseudo-header. */
  algorithm?: string;
  /** Value for the `(created)` pseudo-header; UNIX timestamp or Date. */
  created?: string | number | Date;
  /** Value for the `(expires)` pseudo-header; UNIX timestamp or Date. */
  expires?: string | number | Date;
}

export interface ParseRequestOptions {
  /**
   * Covered headers the verifier requires to be signed.
   * Throws if any are absent from the request signature.
   * @default ['(created)']
   */
  headers?: string[];
  /** Permitted clock skew in seconds when validating `(created)` and `(expires)`. @default 300 */
  clockSkew?: number;
  /** Current time as UNIX timestamp (seconds). Defaults to `Date.now() / 1000`. */
  now?: number;
  /** Header name containing the HTTP signature, if non-standard. @default 'authorization' */
  authorizationHeaderName?: string;
}

export interface CreateAuthzHeaderOptions {
  includeHeaders: string[];
  keyId: string;
  signature: string;
  algorithm?: string;
  created?: string | number | Date;
  expires?: string | number | Date;
}

export interface CreateSignatureStringOptions {
  requestOptions: RequestOptions;
  /** @default ['(created)'] */
  includeHeaders?: string[];
}

/**
 * Parses either an `Authorization` or `Signature` header value.
 */
export function parseSignatureHeader(sigString: string): ParsedSignature;

/**
 * Copies pseudo-header values (`created`, `expires`, `algorithm`, `keyId`)
 * from parsed signature params into `requestOptions`.
 */
export function extractPseudoHeaders(
  params: RawSignatureParams,
  requestOptions: Record<string, unknown>
): Record<string, unknown>;

/**
 * Returns the `Authorization: Signature ...` header string.
 */
export function createAuthzHeader(options: CreateAuthzHeaderOptions): string;

/**
 * Builds the canonicalized signing string from a list of covered
 * headers/pseudo-headers and a request object.
 */
export function createSignatureString(
  options?: CreateSignatureStringOptions
): string;

/**
 * Parses and validates an incoming request's Authorization header.
 * Enforces clock skew, validates `(created)`/`(expires)` pseudo-headers,
 * and reconstructs the signing string for verification.
 *
 * @throws {HttpSignatureError} If the signature is missing, malformed,
 *   expired, or does not cover all required headers.
 */
export function parseRequest(
  request: {
    headers: Record<string, string>;
    method?: string;
    url?: string;
  },
  options?: ParseRequestOptions
): ParsedRequest;
