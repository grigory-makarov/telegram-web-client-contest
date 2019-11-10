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

import {Icon, TagName, View} from "@telegram/uikit";
import {Subject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";
import {fatal} from "@telegram/foundation";

const style = require('./checkbox.scss');

export enum CheckboxState {
    checked,
    unchecked,
    indeterminate
}

export class Checkbox extends View {
    private readonly stateStream = new Subject<CheckboxState>();
    public readonly state$ = this.stateStream.pipe(
        distinctUntilChanged()
    );

    private _state = CheckboxState.unchecked;

    public get state(): CheckboxState {
        return this._state;
    }

    public set state(value: CheckboxState) {
        this.stateStream.next(value);
        this._state = value;
    }

    private readonly icon: Icon = (() => {
        const icon = new Icon();
        icon.addClassName(style.icon);
        this.addSubview(icon);
        return icon;
    })();

    private readonly labelView: View = (() => {
        const label = new View(TagName.span);
        label.addClassName(style.label);
        this.addSubview(label);
        return label;
    })();

    public get label(): string {
        return this.labelView.element.innerText;
    }

    public set label(value: string) {
        this.labelView.element.innerText = value;
    }

    constructor() {
        super();
        this.addClassName(style.checkbox);
        this.setupStateListener();
        this.state = CheckboxState.unchecked;
    }

    public toggle() {
        this.state = this.state === CheckboxState.checked ? CheckboxState.unchecked : CheckboxState.checked;
    }

    private setupStateListener() {
        this.element.onclick = () => this.toggle();

        let stateClassName: string | null = null;

        this.state$.subscribe(state => {
            if (stateClassName) {
                this.removeClassName(stateClassName);
            }

            switch (state) {
                case CheckboxState.unchecked:
                    this.icon.svgContent = require('assets/icons/checkboxempty_svg.svg');
                    stateClassName = null;
                    break;
                case CheckboxState.checked:
                    this.icon.svgContent = require('assets/icons/checkboxon_svg.svg');
                    stateClassName = style.indeterminate;
                    break;
                case CheckboxState.indeterminate:
                    this.icon.svgContent = require('assets/icons/checkboxblock_svg.svg');
                    stateClassName = style.checked;
                    break;
                default:
                    fatal('Unknown checkbox state')
            }

            if (stateClassName) {
                this.addClassName(stateClassName);
            }
        });
    }
}