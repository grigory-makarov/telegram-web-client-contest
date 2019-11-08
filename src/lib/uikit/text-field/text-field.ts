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

import {View} from '../view';
import {TagName} from "@telegram/uikit";
import {Subject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";

export enum ContentType {
    text = "text",
    email = "email",
    phoneNumber = "tel",
    number = "number"
}

export enum FocusState {
    focused,
    blurred
}

export class TextField extends View {
    private readonly style = require("./text-field.scss");

    private readonly valueStream = new Subject<string>();
    public readonly value$ = this.valueStream.pipe(
        distinctUntilChanged()
    );

    private readonly focusStateStream = new Subject<FocusState>();
    public readonly focusState$ = this.focusStateStream.asObservable();


    private readonly inputView: View<HTMLInputElement> = (() => {
        const view = new View<HTMLInputElement>(TagName.input);
        view.addClassName(this.style.input);
        this.addSubview(view);
        return view;
    })();

    public get contentType(): ContentType {
        return this.inputView.element.type as ContentType;
    }

    public set contentType(value: ContentType) {
        this.inputView.element.type = value;
    }

    private readonly labelView: View = (() => {
        const view = new View(TagName.span);
        view.addClassName(this.style.label);
        this.addSubview(view);
        return view;
    })();

    public get label(): string {
        return this.labelView.element.innerText;
    }

    public set label(value: string) {
        this.labelView.element.innerText = value;
    }

    constructor() {
        super();

        this.label = "Text Field";
        this.addClassName(this.style.textField);

        this.setupFocusStateListeners();
        this.setupValueListeners();
    }

    private setupValueListeners() {
        this.inputView.element.oninput = () => this.valueStream.next(this.inputView.element.value);

        let hasFloatingClassName = false;
        this.value$.subscribe(value => {

            if (value && !hasFloatingClassName) {
                this.labelView.addClassName(this.style.floating);
                hasFloatingClassName = true;
            } else if (!value && hasFloatingClassName) {
                this.labelView.removeClassName(this.style.floating);
                hasFloatingClassName = false;
            }
        });
    }

    private setupFocusStateListeners() {
        this.inputView.element.onfocus = () => this.focusStateStream.next(FocusState.focused);
        this.inputView.element.onblur = () => this.focusStateStream.next(FocusState.blurred);

        this.focusState$.subscribe(state => {
            if (state === FocusState.focused) {
                this.addClassName(this.style.focused);
            } else {
                this.removeClassName(this.style.focused);
            }
        });
    }
}