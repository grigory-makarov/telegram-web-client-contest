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

import {ViewController} from "@telegram/uikit";
import {VerificationCodeView} from "./verification-code-view";
import {filter, map, takeUntil} from "rxjs/operators";

export interface VerificationCodeViewControllerDelegate {
    userDidRequestIdentityChange(): void;
    userDidVerifyCode(): void;
}

export class VerificationCodeViewController extends ViewController<VerificationCodeView> {
    constructor(private readonly delegate: VerificationCodeViewControllerDelegate) {
        super();
    }

    public createView(): VerificationCodeView {
        return new VerificationCodeView();
    }

    public viewWillAppear() {
        super.viewWillAppear();
        this.view.codeField.value = "";
        this.view.phoneNumber = "+31 12 34 56 789";

        this.view.editPhoneNumberButton.tap$.pipe(
            map(() => this.delegate.userDidRequestIdentityChange()),
            takeUntil(this.viewDidDisappear$)
        ).subscribe();

        this.view.codeField.value$.pipe(
            filter(value => value.length === 6),
            map(() => this.delegate.userDidVerifyCode()),
            takeUntil(this.viewDidDisappear$)
        ).subscribe();
    }
}
