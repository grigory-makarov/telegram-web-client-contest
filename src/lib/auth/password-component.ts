import {Button, TextField} from "../uikit";

const styles = require("./shared.scss");

export class PasswordComponent extends HTMLElement {
    constructor() {
        super();

        this.classList.add(styles.host);

        const logo = document.createElement("figure");
        logo.innerHTML = require("assets/icons/logo.svg");
        logo.classList.add(styles.logo);
        this.append(logo);

        const heading = document.createElement("h1");
        heading.innerText = "Enter a Password";
        this.append(heading);

        const message = document.createElement("p");
        message.innerText = "Your account is protected with an additional password";
        this.append(message);

        const passwordField = new TextField();
        passwordField.type = "password";
        passwordField.label = "Password";
        this.append(passwordField);

        const nextButton = new Button();
        nextButton.text = "Next";
        this.append(nextButton);
    }
}

customElements.define("auth-password", PasswordComponent);
