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

import {View} from "./view";
import {environment} from "../../environments/environment";


export abstract class ViewController<TView extends View = View> {
    private _view: TView | null = null;

    public get view(): TView {
        if (!this._view) {
            this._view = this.createView();

            if (!environment.production) {
                this._view.element.dataset.viewController = this.constructor.name;
            }
        }

        return this._view;
    }

    public abstract createView(): TView;

    public viewWillAppear() {
    }

    public viewDidAppear() {
    }

    public viewWillDisappear() {
    }

    public viewDidDisappear() {
    }
}
