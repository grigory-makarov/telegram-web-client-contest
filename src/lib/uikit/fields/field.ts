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

import {TagName, View} from "@telegram/uikit";
import {Observable, Subject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";

const style = require('./field.scss');

export enum FocusState {
    focused,
    blurred
}

export abstract class Field<TValue> extends View {
    protected readonly focusStateSubject = new Subject<FocusState>();

    public readonly focusState$ = this.focusStateSubject.pipe(
        distinctUntilChanged()
    );

    public abstract value$: Observable<TValue>;
    public abstract value: TValue;

    private readonly labelView: View = (() => {
        const view = new View(TagName.span);
        view.addClassName(style.label);
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

        this.addClassName(style.field);
        this.label = "Field";

        setTimeout(() => {
            this.listenFloatingLabelChanges();
            this.listenFocusStateChanges();
        }, 0);
    }

    private listenFloatingLabelChanges() {
        let hasFloatingClassName = false;

        this.value$.subscribe(value => {
            if (value && !hasFloatingClassName) {
                this.labelView.addClassName(style.floating);
                hasFloatingClassName = true;
            } else if (!value && hasFloatingClassName) {
                this.labelView.removeClassName(style.floating);
                hasFloatingClassName = false;
            }
        })
    }

    private listenFocusStateChanges() {
        this.focusState$.subscribe(state => {
            if (state === FocusState.focused) {
                this.addClassName(style.focused);
            } else {
                this.removeClassName(style.focused);
            }
        });
    }
}
