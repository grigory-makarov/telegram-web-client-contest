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

import {TagName} from "./tag-name";
import {assert, List, notImplemented} from "@telegram/foundation";

export class View {
    private _superview: View | null = null;
    private readonly _subviews = List.empty<View>();
    public readonly element: HTMLElement;

    public get superview(): View | null {
        return this._superview;
    }

    public get subviews(): List<View> {
        return this._subviews.copy();
    }

    constructor(private readonly tagName: TagName = TagName.div) {
        this.element = document.createElement(tagName);
    }

    public addSubview(subview: View) {
        this.assertViewCanBecomeSubview(subview);
        subview._superview = this;
        this.element.append(subview.element);
        this._subviews.append(subview);
    }

    public insertSubviewAt(subview: View, index: number) {
        return notImplemented();
    }

    public insertSubviewAbove(subview: View, target: View) {
        return notImplemented();
    }

    public insertSubviewBelow(subview: View, target: View) {
        return notImplemented();
    }

    public addClassName(name: string) {
        this.element.classList.add(name);
    }

    public removeClassName(name: string) {
        this.element.classList.remove(name);
    }

    public removeFromSuperview() {
        if (this._superview) {
            this._superview._subviews.remove(this);
            this.element.remove();
            this._superview = null;
        }
    }

    private assertViewCanBecomeSubview(view: View) {
        assert(!view._superview, "The given view is a subview of another superview");
    }
}
