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

import {Button, ButtonType, ContentType, Icon, Image, TagName, TextField, View} from "@telegram/uikit";

const style = require('./verification-code.scss');

export class VerificationCodeView extends View {
    public readonly codeField: TextField;
    public readonly phoneNumberView: View;
    public readonly editPhoneNumberButton: Button;

    constructor() {
        super();

        this.addClassName(style.verificationCode);

        const logo = new Image("assets/images/logo.png");
        logo.addClassName(style.logo);
        this.addSubview(logo);

        const phoneNumberContainer = new View();
        phoneNumberContainer.addClassName(style.phoneNumberContainer);
        this.addSubview(phoneNumberContainer);

        this.phoneNumberView = new View(TagName.h1);
        this.phoneNumberView.addClassName(style.phoneNumber);
        phoneNumberContainer.addSubview(this.phoneNumberView);

        this.editPhoneNumberButton = new Button();
        this.editPhoneNumberButton.type = ButtonType.textButton;
        this.editPhoneNumberButton.text = null;
        this.editPhoneNumberButton.icon = new Icon(require('assets/icons/edit_svg.svg'));
        phoneNumberContainer.addSubview(this.editPhoneNumberButton);

        const message = new View(TagName.p);
        message.element.innerText = "We have sent you an SMS with the code";
        message.addClassName(style.message);
        this.addSubview(message);

        this.codeField = new TextField();
        this.codeField.label = "Code";
        this.codeField.contentType = ContentType.number;
        this.codeField.addClassName(style.field);
        this.addSubview(this.codeField);
    }

    public get phoneNumber(): string {
        return this.phoneNumberView.element.innerText;
    }

    public set phoneNumber(value: string) {
        this.phoneNumberView.element.innerText = value;
    }
}