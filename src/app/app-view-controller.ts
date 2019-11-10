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

import {View, ViewController} from "@telegram/uikit";

export class AppViewController extends ViewController {
    public createView(): View {
        return new View();
    }

    public async viewWillAppear() {
        super.viewWillAppear();

        const {AuthViewController} = await import("@telegram/auth");
        this.present(new AuthViewController());
    }

    public embedIn(element: HTMLElement) {
        this.createViewIfNeeded();
        this.viewWillAppear();
        element.append(this.view.element);
        this.viewDidAppear();
    }
}
