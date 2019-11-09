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
import {assert, List} from "@telegram/foundation";

export abstract class ViewController {
    public abstract readonly hostView: View;

    private _parent: ViewController | null = null;

    public get parent(): ViewController | null {
        return this._parent;
    }

    private _children = List.empty<ViewController>();

    public get children(): List<ViewController> {
        return this._children.copy();
    }

    public addChild(controller: ViewController) {
        assert(controller._parent === null);
        this._children.append(controller);
        this.hostView.addSubview(controller.hostView);
        controller._parent = this;
    }

    public removeFromParent() {
        if (this._parent) {
            this.hostView.removeFromSuperview();
            this._parent._children.remove(this);
            this._parent = null;
        }
    }
}
