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

import {Button, ButtonType, ContentType, Image, SecureField, TagName, TextField, View} from "@telegram/uikit";

const style = require('./sign-up.scss');

export class SignUpView extends View {
    public readonly firstNameField: TextField;
    public readonly lastNameField: TextField;
    public readonly completeButton: Button;

    constructor() {
        super();

        this.addClassName(style.signUp);

        const image = new Image("assets/images/logo.png");
        image.addClassName(style.image);
        this.addSubview(image);

        const heading = new View(TagName.h1);
        heading.element.innerText = "Your Name";
        heading.addClassName(style.heading);
        this.addSubview(heading);

        const message = new View(TagName.p);
        message.element.innerText = "Enter your name and add a profile picture";
        message.addClassName(style.message);
        this.addSubview(message);

        const fieldsContainer = new View();
        fieldsContainer.addClassName(style.fieldsContainer);
        this.addSubview(fieldsContainer);

        this.firstNameField = new TextField();
        this.firstNameField.contentType = ContentType.text;
        this.firstNameField.label = "Name";
        this.firstNameField.addClassName(style.field);
        fieldsContainer.addSubview(this.firstNameField);

        this.lastNameField = new TextField();
        this.lastNameField.contentType = ContentType.text;
        this.lastNameField.label = "Last Name (optional)";
        this.lastNameField.addClassName(style.field);
        fieldsContainer.addSubview(this.lastNameField);

        this.completeButton = new Button();
        this.completeButton.type = ButtonType.pushButton;
        this.completeButton.text = "Start Messaging";
        this.completeButton.addClassName(style.button);
        this.addSubview(this.completeButton);
    }
}
