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

import {IdentityView} from "./identity-view";
import {ViewController} from "@telegram/uikit";
import {map, takeUntil} from "rxjs/operators";

export interface IdentityViewControllerDelegate {
    userDidProvideIdentityData(): void;
}

export class IdentityViewController extends ViewController<IdentityView> {
    constructor(private readonly delegate: IdentityViewControllerDelegate) {
        super();
    }

    public createView(): IdentityView {
        return new IdentityView();
    }

    public viewWillAppear() {
        super.viewWillAppear();

        this.view.nextButton.tap$.pipe(
            map(() => this.delegate.userDidProvideIdentityData()),
            takeUntil(this.viewDidDisappear$)
        ).subscribe();
    }
}
