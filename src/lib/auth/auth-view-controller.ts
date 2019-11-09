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
import {fatal} from "@telegram/foundation";
import {IdentityViewController} from "./identity/identity-view-controller";
import {VerificationCodeViewController} from "./verification-code/verification-code-view-controller";
import {first, map} from "rxjs/operators";

const style = require('./auth.scss');

export enum AuthState {
    identity,
    verificationCode
}

export class AuthViewController extends ViewController {
    public readonly hostView = new View();
    private currentViewController: ViewController | null = null;

    constructor() {
        super();
        this.hostView.addClassName(style.auth);
        this.navigateToState(AuthState.identity);
    }

    public navigateToState(state: AuthState) {
        if (this.currentViewController) {
            this.currentViewController.removeFromParent();
        }

        switch (state) {
            case AuthState.identity:
                this.currentViewController = this.createIdentityViewController();
                break;
            case AuthState.verificationCode:
                this.currentViewController = this.createVerificationCodeViewController();
                break;
            default:
                fatal("Unknown auth state")

        }

        this.addChild(this.currentViewController!);
    }

    private createIdentityViewController(): IdentityViewController {
        const controller = new IdentityViewController();
        controller.done$.pipe(
            map(() => this.navigateToState(AuthState.verificationCode)),
            first()
        ).subscribe();

        return controller;
    }

    private createVerificationCodeViewController(): VerificationCodeViewController {
        const controller = new VerificationCodeViewController();
        controller.editPhoneNumber$.pipe(
            map(() => this.navigateToState(AuthState.identity)),
            first()
        ).subscribe();

        return controller;
    }

    public embedIn(element: HTMLElement) {
        element.append(this.hostView.element);
    }
}