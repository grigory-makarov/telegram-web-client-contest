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

const style = require("./identity.scss");

export class IdentityView extends View {
    public readonly countryField: TextField;
    public readonly phoneNumberField: TextField;
    public readonly keepSignedInCheckbox: Checkbox;
    public readonly nextButton: Button;

    constructor() {
        super();

        this.addClassName(style.signIn);

        const logo = new Image("assets/images/logo.png");
        logo.addClassName(style.logo);
        this.addSubview(logo);

        const heading = new View(TagName.h1);
        heading.element.innerText = "Sign in to Telegram";
        heading.addClassName(style.heading);
        this.addSubview(heading);

        const message = new View(TagName.p);
        message.element.innerText = "Please confirm your country and enter your phone number";
        message.addClassName(style.message);
        this.addSubview(message);

        const fieldsContainer = new View();
        fieldsContainer.addClassName(style.fieldsContainer);
        this.addSubview(fieldsContainer);

        this.countryField = new TextField();
        this.countryField.label = "Country";
        this.countryField.addClassName(style.field);
        fieldsContainer.addSubview(this.countryField);

        this.phoneNumberField = new TextField();
        this.phoneNumberField.label = "Phone Number";
        this.phoneNumberField.contentType = ContentType.phoneNumber;
        this.phoneNumberField.addClassName(style.field);
        fieldsContainer.addSubview(this.phoneNumberField);

        this.keepSignedInCheckbox = new Checkbox();
        this.keepSignedInCheckbox.addClassName(style.checkbox);
        this.keepSignedInCheckbox.state = CheckboxState.checked;
        this.keepSignedInCheckbox.label = "Keep me signed in";
        fieldsContainer.addSubview(this.keepSignedInCheckbox);

        this.nextButton = new Button();
        this.nextButton.type = ButtonType.pushButton;
        this.nextButton.text = "Next";
        this.nextButton.addClassName(style.button);
        fieldsContainer.addSubview(this.nextButton);
    }
}
