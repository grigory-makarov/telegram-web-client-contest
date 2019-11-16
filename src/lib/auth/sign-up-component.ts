import {Button, TextField} from "@telegram/uikit";
import {AvatarPicker} from "./avatar-picker/avatar-picker";
import {fromEvent} from "rxjs";

const styles = require("./shared.scss");

export interface SignUpComponentDelegate {
    userDidSignUp(): void;
}

export class SignUpComponent extends HTMLElement {
    constructor(private readonly delegate: SignUpComponentDelegate) {
        super();

        this.classList.add(styles.host);

        const avatarPicker = new AvatarPicker();
        this.append(avatarPicker);

        const heading = document.createElement("h1");
        heading.innerText = "Your Name";
        this.append(heading);

        const message = document.createElement("p");
        message.innerText = "Enter your name and add a profile picture";
        this.append(message);

        const firstNameField = new TextField();
        firstNameField.label = "Name";
        this.append(firstNameField);

        const lastNameField = new TextField();
        lastNameField.label = "Last Name (optional)";
        this.append(lastNameField);

        const signUpButton = new Button();
        signUpButton.text = "Start Messaging";
        this.append(signUpButton);

        fromEvent(signUpButton, "click").subscribe(() => this.delegate.userDidSignUp());
    }
}

customElements.define("auth-sign-up", SignUpComponent);

