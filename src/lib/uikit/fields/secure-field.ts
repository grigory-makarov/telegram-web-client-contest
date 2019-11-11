import {KeyboardInputField} from "./keyboard-input-field";

export class SecureField extends KeyboardInputField {
    constructor() {
        super();

        this.label = "Secure Field";
        this.inputView.element.type = "password";
    }
}