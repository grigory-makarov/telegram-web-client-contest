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

import {
    Button,
    ButtonType,
    Checkbox,
    CheckboxState,
    ContentType,
    Image,
    TagName,
    TextField,
    View
} from "@telegram/uikit";

const style = require('./sign-in.scss');

export class SignInView extends View {
    public readonly countryField: TextField;
    public readonly phoneNumberField: TextField;
    public readonly keepSignedInCheckbox: Checkbox;
    public readonly signInButton: Button;

    constructor() {
        super();

        this.addClassName(style.signIn);

        const container = new View();
        container.addClassName(style.container);
        this.addSubview(container);

        const logo = new Image("assets/images/logo.png");
        logo.addClassName(style.logo);
        container.addSubview(logo);

        const heading = new View(TagName.h1);
        heading.element.innerText = "Sign in to Telegram";
        heading.addClassName(style.heading);
        container.addSubview(heading);

        const message = new View(TagName.p);
        message.element.innerText = "Please confirm your country and enter your phone number.";
        message.addClassName(style.message);
        container.addSubview(message);

        const fieldsContainer = new View();
        fieldsContainer.addClassName(style.fieldsContainer);
        container.addSubview(fieldsContainer);

        this.countryField = new TextField();
        this.countryField.label = "Country";
        this.countryField.contentType = ContentType.text;
        this.countryField.addClassName(style.field);
        fieldsContainer.addSubview(this.countryField);

        this.phoneNumberField = new TextField();
        this.phoneNumberField.label = "Phone Number";
        this.phoneNumberField.contentType = ContentType.phoneNumber;
        this.phoneNumberField.addClassName(style.field);
        fieldsContainer.addSubview(this.phoneNumberField);

        const checkboxContainer = new View();
        checkboxContainer.addClassName(style.checkboxContainer);
        fieldsContainer.addSubview(checkboxContainer);

        this.keepSignedInCheckbox = new Checkbox();
        this.keepSignedInCheckbox.state = CheckboxState.checked;
        checkboxContainer.addSubview(this.keepSignedInCheckbox);

        const checkboxLabel = new View(TagName.span);
        checkboxLabel.element.innerText = "Keep me signed in";
        checkboxLabel.addClassName(style.checkboxLabel);
        checkboxContainer.addSubview(checkboxLabel);

        this.signInButton = new Button();
        this.signInButton.type = ButtonType.pushButton;
        this.signInButton.text = "Next";
        this.signInButton.addClassName(style.button);
        fieldsContainer.addSubview(this.signInButton);
    }
}
