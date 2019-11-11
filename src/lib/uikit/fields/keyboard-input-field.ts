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

import {Field, FocusState} from "./field";
import {TagName, View} from "@telegram/uikit";
import {fromEvent} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";

const style = require("./field.scss");


export abstract class KeyboardInputField extends Field<string> {
    protected readonly inputView: View<HTMLInputElement> = (() => {
        const view = new View<HTMLInputElement>(TagName.input);
        fromEvent(this.element, "click").subscribe(() => view.element.focus());
        fromEvent(view.element, "focus").subscribe(() => this.focusStateSubject.next(FocusState.focused));
        fromEvent(view.element, "blur").subscribe(() => this.focusStateSubject.next(FocusState.blurred));
        view.addClassName(style.input);
        this.addSubview(view);
        return view;
    })();

    public readonly value$ = fromEvent(this.inputView.element, "input").pipe(
        map(() => this.value),
        distinctUntilChanged()
    );

    public get value(): string {
        return this.inputView.element.value;
    }

    public set value(value: string) {
        this.inputView.element.value = value;
    }
}