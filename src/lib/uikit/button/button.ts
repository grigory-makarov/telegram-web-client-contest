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

import {View} from "../view";
import {Icon} from "../icon/icon";
import {TagName} from "../tag-name";
import {Subject} from "rxjs";
import {fatal} from "@telegram/foundation";

export enum ButtonType {
    pushButton,
    textButton,
    mixedButton
}

export class Button extends View {
    private readonly style = require('./button.scss');
    private readonly tapStream = new Subject();
    public readonly tap$ = this.tapStream.asObservable();

    // region Managing button appearance
    private _type?: ButtonType;
    private currentClassName?: string;

    public get type(): ButtonType {
        return this._type!;
    }

    public set type(value: ButtonType) {
        this._type = value;

        this.removeClassName(this.currentClassName!);

        switch (value) {
            case ButtonType.pushButton:
                this.currentClassName = this.style.pushButton;
                break;
            case ButtonType.textButton:
                this.currentClassName = this.style.textButton;
                break;
            case ButtonType.mixedButton:
                this.currentClassName = this.style.mixedButton;
                break;
            default:
                fatal('Unknown button type!')
        }

        this.addClassName(this.currentClassName!);
        this.viewDidUpdate();
    }

    // endregion

    // region Adding icon to the button
    private _icon: Icon | null = null;

    public get icon(): Icon | null {
        return this._icon;
    }

    public set icon(value: Icon | null) {
        if (this._icon) {
            this._icon.removeFromSuperview();
            this._icon.removeClassName(this.style.icon);
        }

        this._icon = value;

        if (value) {
            this.insertSubviewAbove(value, this.textView);
            value.addClassName(this.style.icon);
        }

        this.viewDidUpdate();
    }

    // endregion

    // region Setting text content of the button
    private readonly textView: View = (() => {
        const textView = new View(TagName.span);
        textView.addClassName(this.style.text);
        this.addSubview(textView);
        return textView;
    })();

    public get text(): string | null {
        return this.textView.element.innerText || null;
    }

    public set text(value: string | null) {
        this.textView.element.innerText = value || "";
        this.viewDidUpdate();
    }

    // endregion

    constructor() {
        super(TagName.button);

        this.type = ButtonType.textButton;
        this.text = "Button";
        this.addClassName(this.style.button);
        this.element.onclick = () => this.tapStream.next();
    }

    private viewDidUpdate() {
        if (!this.text) {
            this.addClassName(this.style.noTextButton);
        } else {
            this.removeClassName(this.style.noTextButton);
        }
    }
}
