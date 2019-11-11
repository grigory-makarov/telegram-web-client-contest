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

import {Icon, Image, TagName, View} from "@telegram/uikit";
import {fromEvent} from "rxjs";

const style = require('./profile-photo-picker.scss');


export class ProfilePhotoPicker extends View {
    public readonly fileInput: View<HTMLInputElement> = (() => {
        const view = new View<HTMLInputElement>(TagName.input);
        view.element.type = "file";
        view.element.accept = "image/x-png,image/gif,image/jpeg";
        view.addClassName(style.fileInput);
        this.addSubview(view);
        return view;
    })();


    public readonly image: Image = (() => {
        const image = new Image("");
        image.element.style.opacity = "0";
        image.addClassName(style.image);
        this.addSubview(image);
        return image;
    })();

    constructor() {
        super();

        this.addClassName(style.profilePhotoPicker);
        const icon = new Icon(require('assets/icons/cameraadd_svg.svg'));
        icon.addClassName(style.icon);
        this.addSubview(icon);

        fromEvent(this.element, 'click').subscribe(() => this.fileInput.element.click());
    }
}
