/*
 * Copyright 2019 Grigory Makarov <makkgregory@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Ensures that the given expression evaluated to boolean `value` is `true` otherwise throws an assertion error with
 * optional `message`
 */
export function assert(value: boolean, message: string | null = null) {
    if (!value) {
        throw new Error(message ? `Assertion Error: ${message}` : 'Assertion Error!');
    }
}

/**
 * Ensures that the given value is not `null` or `undefined`, otherwise throws assertion error
 */
export function assertNotNil(value: any, message: string | null = null) {
    assert(checkNotNil(value), message || 'Expected value to be not nil!');
}

/**
 * Ensures that the given `value` is valid javascript string, otherwise throws an assertion error
 */
export function assertString(value: any) {
    assert(checkString(value));
}

/**
 * Ensures that the given `value` is valid javascript boolean value, otherwise throws an assertion error
 */
export function assertBoolean(value: any) {
    assert(checkBoolean(value));
}

/**
 * Ensures that the given `value` is valid javascript number value, otherwise throws an assertion error
 */
export function assertNumber(value: any) {
    assert(checkNumber(value));
}

/**
 * Ensures that the given `value` is callable javascript function or constructor, otherwise throws an assertion error
 */
export function assertFunction(value: any) {
    assert(checkFunction(value));
}

/**
 * Ensures that the given `value` is valid javascript `Date` object, otherwise throws an assertion error
 */
export function assertDate(value: any) {
    assert(checkDate(value));
}

/**
 * Ensures that the given `value` is instance of the given `type`, otherwise throws an assertion error
 */
export function assertInstance(value: any, type: Type<any>) {
    assert(checkInstance(value, type));
}

/**
 * Ensures that the given `value` is a pure javascript object created by deriving only from `Object` class, otherwise throws an assertion error
 */
export function assertObject(value: any) {
    assert(checkObject(value));
}

/**
 * Checks whether the given `value` is `null` or `undefined`
 */
export function checkNil(value: any): boolean {
    return value === null || value === undefined || (typeof value === 'number' && Number.isNaN(value));
}

/**
 * Checks whether the given `value` is not `null` or `undefined`
 */
export function checkNotNil(value: any): boolean {
    return !checkNil(value);
}

/**
 * Checks whether the given `value` is valid javascript number.
 */
export function checkNumber(value: any): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Checks whether the given `value` is valid javascript boolean value
 */
export function checkBoolean(value: any): boolean {
    return typeof value === 'boolean';
}

/**
 * Checks whether the given `value` is valid javascript string
 */
export function checkString(value: any): boolean {
    return typeof value === 'string';
}

/**
 * Checks whether the given `value` is valid javascript `Date`
 */
export function checkDate(value: any): boolean {
    return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * Checks whether the given `value` is callable javascript function or constructor
 */
export function checkFunction(value: any): boolean {
    return typeof value === 'function';
}

/**
 * Checks whether the given `value` is instance of the passed `type`
 */
export function checkInstance(value: any, type: Type<any>): boolean {
    return value instanceof type;
}

/**
 * Checks whether the given `value` is pure javascript object created by deriving only from `Object` class
 */
export function checkObject(value: any): boolean {
    return typeof value === 'object' && value.constructor === Object;
}

/**
 * Checks whether the given `value` not empty string
 */
export function checkNotEmpty(value: string): boolean {
    assertString(value);
    return value !== '';
}

/**
 * Checks whether the given `value` is string that contains any characters different from whitespaces
 */
export function checkNotBlank(value: string): boolean {
    return checkNotEmpty(value) && value.replace(/\s+/gmi, '').length > 0;
}

export function run<TResult>(expression: () => TResult, fallback: () => TResult): TResult {
    try {
        return expression();
    } catch (e) {
        return fallback();
    }
}

export function runOrNull<TResult>(expression: () => TResult): TResult | null {
    return run(expression, () => null);
}

export function fatal(message: string): never {
    throw new Error(message);
}

export function notImplemented(): never {
    return fatal('Not Implemented');
}

export type Type<T> = { new(...args: any[]): T } | Function;
