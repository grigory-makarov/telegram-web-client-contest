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

import { Range } from './range';
import { assert, assertNotNil, fatal, Type } from './utils';

export class List<TElement> {
    public get lastIndex(): number {
        return this.elements.length - 1;
    }

    public get count(): number {
        return this.elements.length;
    }

    public get isEmpty(): boolean {
        return this.elements.length === 0;
    }

    public get isNotEmpty(): boolean {
        return !this.isEmpty;
    }

    public get indices(): Range {
        assert(this.isNotEmpty);
        return Range.to(this.lastIndex);
    }

    public get first(): TElement | null {
        return this.get(0);
    }

    public get last(): TElement | null {
        return this.get(this.lastIndex);
    }

    public get min(): TElement | null {
        return this.sorted().first;
    }

    public get max(): TElement | null {
        return this.sorted().last;
    }

    public get sum(): number {
        return this.sumBy(element => element as any);
    }

    private constructor(private elements: TElement[]) {
    }

    public static from<T>(array: T[]): List<T> {
        return new List(array);
    }

    public static of<T>(...elements: T[]): List<T> {
        return new List(elements);
    }

    public static empty<T>(): List<T> {
        return new List([]);
    }

    public get(index: number): TElement | null {
        const element = this.elements[index];
        return element !== undefined ? element : null;
    }

    public firstWhere(closure: (element: TElement) => boolean): TElement | null {
        return this.elements.find(closure) || null;
    }

    public lastWhere(closure: (element: TElement) => boolean): TElement | null {
        return this.elements.reverse().find(closure) || null;
    }

    public indexOf(element: TElement): number {
        return this.elements.indexOf(element);
    }

    public* [Symbol.iterator](): Iterator<TElement> {
        if (this.isNotEmpty) {
            let currentIndex = 0;

            do {
                yield this.elements[currentIndex];
                currentIndex += 1;
            } while (currentIndex !== this.count);

            return this.last;
        }
    }

    public minBy(closure: (first: TElement, second: TElement) => boolean): TElement | null {
        return this.sortedWith(closure).first;
    }

    public maxBy(closure: (first: TElement, second: TElement) => boolean): TElement | null {
        return this.sortedWith(closure).last;
    }

    public sumBy(closure: (element: TElement) => number): number {
        let result = 0;

        for (const element of this) {
            result += closure(element);
        }

        assertNotNil(result);

        return result;
    }

    public sort(): void {
        this.sortWith((first, second) => first > second);
    }

    public sortWith(closure: (first: TElement, second: TElement) => boolean): void {
        this.elements = this.elements.sort((a, b) => closure(a, b) ? 1 : -1);
    }

    public sortBy(closure: (element: TElement) => number) {
        this.sortWith((first, second) => closure(first) > closure(second));
    }

    public sorted(): this {
        return this.sortedWith((first, second) => first > second);
    }

    public sortedWith(closure: (first: TElement, second: TElement) => boolean): this {
        const list = this.copy();
        list.sortWith(closure);
        return list as this;
    }

    public sortedBy(closure: (element: TElement) => number): this {
        const list = this.copy();
        list.sortBy(closure);
        return list as this;
    }

    public filterInstance<TNewElement extends TElement>(type: Type<TNewElement>): List<TNewElement> {
        return this.filterInstanceBy(element => element instanceof type);
    }

    public filterInstanceBy<TNewElement extends TElement>(closure: (element: TElement) => boolean): List<TNewElement> {
        return this.filter(closure) as any;
    }

    public clear() {
        this.elements = [];
    }

    public filter(closure: (element: TElement) => boolean): this {
        const list = this.copy();
        list.elements = this.elements.filter(element => closure(element));
        return list;
    }

    public filterMatching(collection: List<TElement>): this {
        const list = this.copy();
        list.removeMatching(collection);
        return list;
    }

    public reverse(): void {
        this.elements = this.elements.reverse();
    }

    public reversed(): this {
        const list = this.copy();
        list.reverse();
        return list as this;
    }

    public shuffle(): void {
        if (this.count > 2) {
            for (const index of this.indices) {
                this.exchangeAt(index, this.indices.randomInt());
            }
        }
    }

    public shuffled(): this {
        const list = this.copy();
        list.shuffle();
        return list as this;
    }

    public joined(): string {
        return this.joinedWith('');
    }

    public joinedWith(separator: string): string {
        return this.elements.join(separator);
    }

    public exchange(firstElement: TElement, secondElement: TElement) {
        if (firstElement !== secondElement) {
            this.exchangeAt(this.indexOf(firstElement), this.indexOf(secondElement));
        }
    }

    public exchangeAt(firstIndex: number, secondIndex: number) {
        assert(this.indices.containsAll(firstIndex, secondIndex));

        const firstElement = this.get(firstIndex);
        this.elements[firstIndex] = this.get(secondIndex)!;
        this.elements[secondIndex] = firstElement!;

    }

    public forEach(closure: (element: TElement) => void): void {
        this.elements.forEach(element => closure(element));
    }

    public map<TResult>(closure: (element: TElement) => TResult): List<TResult> {
        return new List(this.elements.map(element => closure(element))) as any;
    }

    public flatMap<TResult>(closure: (element: TElement) => TResult[]): List<TResult> {
        const result: TResult[] = [];

        for (const element of this) {
            result.push(...closure(element));
        }

        return new List(result);
    }

    public associateBy<TKey>(closure: (element: TElement) => TKey): Dictionary<TKey, TElement> {
        const map = new Map(this.map(element => [closure(element), element]));
        return Dictionary.from(map);
    }

    public someSatisfy(closure: (element: TElement) => boolean): boolean {
        return this.elements.find(element => closure(element)) !== undefined;
    }

    public allSatisfy(closure: (element: TElement) => boolean): boolean {
        for (const index of this.indices) {
            if (!closure(this.get(index)!)) {
                return false;
            }
        }

        return true;
    }

    public contains(element: TElement): boolean {
        return this.elements.indexOf(element) !== -1;
    }

    public containsWhere(element: TElement, closure: (element: TElement) => boolean): boolean {
        for (const index of this.indices) {
            const currentElement = this.get(index);

            if (currentElement === element && closure(element)) {
                return true;
            }
        }

        return false;
    }

    public elementsEqual(other: List<TElement>): boolean {
        return this.elementsEqualBy(other, (first, second) => first === second);
    }

    public elementsEqualBy(other: List<TElement>, closure: (first: TElement, second: TElement) => boolean): boolean {
        if (this.count !== other.count) {
            return false;
        }

        for (const index of this.indices) {
            const first = this.get(index)!;
            const second = other.get(index)!;

            if (!closure(first, second)) {
                return false;
            }
        }

        return true;
    }

    public append(element: TElement) {
        this.elements.push(element);
    }

    public merge(elements: List<TElement>) {
        this.elements.push(...elements);
    }

    public merged(elements: List<TElement>): this {
        const instance = this.copy();
        instance.merge(elements);
        return instance;
    }

    public insertAt(index: number, element: TElement) {
        assert((this.isEmpty && index === 0)
            || this.indices.shiftingEnd(1).contains(index), 'Index out of bounds');

        this.elements[index] = element;
    }

    public insertAfter(element: TElement, target: TElement) {
        const targetIndex = this.elements.indexOf(target);

        assert(targetIndex >= 0, 'Element to insert after is not found!');

        this.elements = [
            ...this.elements.slice(0, targetIndex + 1),
            element,
            ...this.elements.slice(targetIndex - 1)
        ];
    }

    public insertBefore(element: TElement, target: TElement) {
        const targetIndex = this.elements.indexOf(target);

        assert(targetIndex >= 0, 'Element to insert before is not found!');

        this.elements = [
            ...this.elements.slice(0, targetIndex),
            element,
            ...this.elements.slice(targetIndex)
        ];
    }

    public remove(element: TElement) {
        this.elements = this.elements.filter(it => it !== element);
    }

    public removeFirst() {
        return this.dropFirst(1);
    }

    public dropFirst(offset: number) {
        assert(offset > 0);
        fatal('Not Implemented');
    }

    public removeLast() {
        this.dropLast(1);
    }

    public dropLast(offset: number) {
        assert(offset > 0);
        fatal('Not Implemented');
    }

    public removeAllWhere(closure: (element: TElement) => boolean) {
        this.elements = this.elements.filter(element => closure(element));
    }

    public removeMatching(collection: List<TElement>) {
        this.elements = this.elements.filter(element => {
            for (const item of collection) {
                if (item === element) {
                    return false;
                }
            }

            return true;
        });
    }

    public removeAt(index: number) {
        assert(this.indices.contains(index));

        this.elements = [
            ...this.elements.slice(0, index - 1),
            ...this.elements.slice(index + 1)
        ];
    }

    public toArray(): TElement[] {
        return this.elements;
    }

    public copy(): this {
        return new List([...this.elements]) as this;
    }
}

export class Dictionary<TKey, TValue> {
    public get isEmpty(): boolean {
        return this.map.size === 0;
    }

    public get isNotEmpty(): boolean {
        return !this.isEmpty;
    }

    public get count(): number {
        return this.map.size;
    }

    public get entries(): List<{ key: TKey, value: TValue }> {
        const entries = List.empty<{ key: TKey, value: TValue }>();
        this.map.forEach((value, key) => entries.append({ key, value }));
        return entries;
    }

    public get keys(): List<TKey> {
        return List.from(Array.from(this.map.keys()));
    }

    public get values(): List<TValue> {
        return List.from(Array.from(this.map.values()));
    }

    private constructor(private readonly map: Map<TKey, TValue>) {
    }

    public static from<K, V>(source: Map<K, V>): Dictionary<K, V> {
        return new Dictionary(source);
    }

    public static empty<K, V>(): Dictionary<K, V> {
        return new Dictionary<K, V>(new Map());
    }

    public containsKey(key: TKey): boolean {
        return this.map.has(key);
    }

    public containsValue(value: TValue): boolean {
        for (const _value of this.map.values()) {
            if (_value === value) {
                return true;
            }
        }

        return false;
    }

    public get(key: TKey): TValue | null {
        return this.map.get(key) || null;
    }

    public set(key: TKey, value: TValue) {
        this.map.set(key, value);
    }

    public setAllBy(values: List<TValue>, closure: (value: TValue) => TKey) {
        for (const value of values) {
            const key = closure(value);
            this.map.set(key, value);
        }
    }

    public merge(other: Dictionary<TKey, TValue>) {
        for (const entry of other.map.entries()) {
            const [key, value] = entry;
            this.set(key, value);
        }
    }

    public merged(other: Dictionary<TKey, TValue>): this {
        const dictionary = this.clone();
        dictionary.merge(other);
        return dictionary;
    }

    public remove(key: TKey) {
        this.map.delete(key);
    }

    public removeAll(closure: (entry: [TKey, TValue]) => boolean) {
        for (const entry of this.map.entries()) {
            if (closure(entry)) {
                const [key] = entry;
                this.remove(key);
            }
        }
    }

    public clear() {
        this.map.clear();
    }

    private clone(): this {
        return new Dictionary(new Map(this.map.entries())) as this;
    }
}
