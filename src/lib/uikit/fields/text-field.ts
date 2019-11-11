import {KeyboardInputField} from "./keyboard-input-field";

export enum ContentType {
    text = "text",
    email = "email",
    phoneNumber = "tel",
    number = "number"
}

export class TextField extends KeyboardInputField {
    constructor() {
        super();

        this.label = "Text Field";
    }

    public get contentType(): ContentType {
        return this.inputView.element.type as ContentType;
    }

    public set contentType(value: ContentType) {
        this.inputView.element.type = value;
    }
}