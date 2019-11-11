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

import {Button, ButtonType, Image, SecureField, TagName, View} from "@telegram/uikit";

const style = require("./password.scss");

export class PasswordView extends View {
    public readonly passwordField: SecureField;
    public readonly nextButton: Button;

    constructor() {
        super();

        this.addClassName(style.password);

        const image = new Image("assets/images/logo.png");
        image.addClassName(style.image);
        this.addSubview(image);

        const heading = new View(TagName.h1);
        heading.element.innerText = "Enter a Password";
        heading.addClassName(style.heading);
        this.addSubview(heading);

        const message = new View(TagName.p);
        message.element.innerText = "Your account is protected with an additional password";
        message.addClassName(style.message);
        this.addSubview(message);

        this.passwordField = new SecureField();
        this.passwordField.label = "Password";
        this.passwordField.addClassName(style.field);
        this.addSubview(this.passwordField);

        this.nextButton = new Button();
        this.nextButton.type = ButtonType.pushButton;
        this.nextButton.text = "Next";
        this.nextButton.addClassName(style.button);
        this.addSubview(this.nextButton);
    }
}