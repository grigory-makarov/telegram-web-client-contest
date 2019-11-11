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

import {View} from "@telegram/uikit";

const style = require('./split-view.scss');

export class SplitView<TMasterView extends View = View, TDetailsView extends View = View> extends View {
    public get masterMinWidth(): string | null {
        return this.masterView.element.style.minWidth;
    }

    public set masterMinWidth(value: string | null) {
        this.masterView.element.style.minWidth = value;
    }

    public get masterMaxWidth(): string | null {
        return this.masterView.element.style.maxWidth;
    }

    public set masterMaxWidth(value: string | null) {
        this.masterView.element.style.maxWidth = value;
    }

    public get masterWidth(): string | null {
        return this.masterView.element.style.width;
    }

    public set masterWidth(value: string | null) {
        this.masterView.element.style.width = value;
        this.detailsView.element.style.width = value ? `calc(100% - ${value})` : '100%';
    }

    constructor(public readonly masterView: TMasterView,
                public readonly detailsView: TDetailsView) {
        super();

        this.addClassName(style.splitView);
        this.masterView.addClassName(style.masterView);
        this.detailsView.addClassName(style.detailsView);
        this.addSubview(this.masterView);
        this.addSubview(this.detailsView);
    }
}
