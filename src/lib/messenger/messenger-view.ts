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

import {ContainerView, SplitView, View} from "@telegram/uikit";

const style = require("./messenger.scss");

export class MessengerView extends ContainerView {
    constructor() {
        super();
        this.addClassName(style.messengerView);

        const splitView = new SplitView(new View(), new View());
        splitView.masterView.addClassName(style.masterView);
        splitView.detailsView.addClassName(style.detailsView);
        splitView.masterWidth = "420px";
        this.addSubview(splitView);
    }
}
