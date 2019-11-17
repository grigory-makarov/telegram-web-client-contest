import {Button, Checkbox, TextField} from "@telegram/uikit";
import {fromEvent} from "rxjs";

const styles = require("./shared.scss");

export interface PromptIdentityComponentDelegate {
    userDidProvideIdentity(): void;
}

export class PromptIdentityComponent extends HTMLElement {
    constructor(private delegate: PromptIdentityComponentDelegate) {
        super();

        this.classList.add(styles.host);

        const logo = document.createElement("figure");
        logo.innerHTML = require("assets/icons/logo.svg");
        logo.classList.add(styles.logo);
        this.append(logo);

        const heading = document.createElement("h1");
        heading.innerText = "Sign in to Telegram";
        this.append(heading);

        const message = document.createElement("p");
        message.innerText = "Please confirm your country and enter your phone number";
        this.append(message);

        const countryField = new TextField();
        countryField.label = "Country";
        this.append(countryField);

        const phoneNumberField = new TextField();
        phoneNumberField.label = "Phone Number";
        phoneNumberField.type = "tel";
        this.append(phoneNumberField);

        const keepSignedInCheckbox = new Checkbox();
        keepSignedInCheckbox.label = "Keep me signed in";
        this.append(keepSignedInCheckbox);

        const nextButton = new Button();
        nextButton.text = "Next";
        fromEvent(nextButton, "click").subscribe(() => this.delegate.userDidProvideIdentity());
        this.append(nextButton);
    }
}

customElements.define("auth-identity", PromptIdentityComponent);
