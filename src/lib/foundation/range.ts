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

import {assert} from "./utils";

export class Range {
    public readonly start: number;
    public readonly end: number;
    public readonly step: number;

    constructor({start, end, step}: { start: number, end: number, step: number }) {
        assert(start <= end);
        assert(step !== 0);
        assert(step <= end - start);

        this.start = start;
        this.end = end;
        this.step = step;
    }

    public static between({start, end}: { start: number, end: number }): Range {
        return new Range({start, end, step: 1});
    }

    public static to(end: number): Range {
        return new Range({start: 0, end, step: 1});
    }

    public* [Symbol.iterator](): Iterator<number> {
        let current = this.start;

        while (current + this.step < this.end) {
            yield current;
            current += this.step;
        }

        return this.end;
    }

    public contains(element: number): boolean {
        return element >= this.start && element <= this.end;
    }

    public containsAll(...elements: number[]): boolean {
        for (const element of elements) {
            if (!this.contains(element)) {
                return false;
            }
        }

        return true;
    }

    public randomInt(): number {
        return Math.floor(this.start + Math.random() * (this.end + 1 - this.start));
    }

    public randomFloat(precision: number): number {
        assert(precision > 0 && precision <= 100);

        const result = Math.random() * (this.end - this.start) + this.start;
        return +result.toFixed(precision);
    }

    public shiftingStart(value: number): Range {
        return this.shifting({start: value, end: 0});
    }

    public shiftingEnd(value: number): Range {
        return this.shifting({start: 0, end: value});
    }

    public shifting({start, end}: { start: number, end: number }): Range {
        return new Range({start: this.start + start, end: this.end + end, step: this.step});
    }
}
