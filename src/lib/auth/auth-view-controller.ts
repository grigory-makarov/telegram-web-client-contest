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
import {SignUpViewController} from "./sign-up/sign-up-view-controller";

const style = require('./auth.scss');

export class AuthViewController extends ViewController {
    public createView(): View {
        const view = new View();
        view.addClassName(style.auth);
        return view;
    }

    public viewWillAppear() {
        super.viewWillAppear();

        const signUpViewController = new SignUpViewController();
        signUpViewController.viewWillAppear();
        this.view.addSubview(signUpViewController.view);
        signUpViewController.viewDidAppear();
    }
}
