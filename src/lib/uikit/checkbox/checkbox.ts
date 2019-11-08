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

import {Icon, View} from "@telegram/uikit";
import {Subject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";

export enum CheckboxState {
    checked,
    unchecked
}

export class Checkbox extends View {
    private readonly style = require('./checkbox.scss');

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

    private readonly checkMark: Icon = (() => {
        const icon = new Icon(require('assets/icons/1check_svg.svg'));
        icon.addClassName(this.style.checkMark);
        this.addSubview(icon);
        return icon;
    })();

    constructor() {
        super();
        this.addClassName(this.style.checkbox);
        this.setupStateListener();
    }


    public toggle() {
        this.state = this.state === CheckboxState.unchecked ? CheckboxState.checked : CheckboxState.unchecked;
    }

    private setupStateListener() {
        this.element.onclick = () => this.toggle();
        this.state$.subscribe(state => {
            if (state === CheckboxState.unchecked && state !== this.state) {
                this.removeClassName(this.style.checked);
            } else if (state === CheckboxState.checked && state !== this.state) {
                this.addClassName(this.style.checked);
            }
        })
    }
}