import {Button, IconButton, IconButtonType, TextField} from "@telegram/uikit";
import {fromEvent} from "rxjs";

const sharedStyles = require("../shared.scss");
const ownStyles = require("./verify-identity-component.scss");

export interface VerifyIdentityComponentDelegate {
    userDidVerifyIdentity(): void;

    userDidRequestIdentityChange(): void;
}

export class VerifyIdentityComponent extends HTMLElement {
    constructor(private readonly delegate: VerifyIdentityComponentDelegate) {
        super();

        this.classList.add(sharedStyles.host);

        const logo = document.createElement("figure");
        logo.innerHTML = require("assets/icons/logo.svg");
        logo.classList.add(sharedStyles.logo);
        this.append(logo);

        const phoneNumberContainer = document.createElement("div");
        phoneNumberContainer.classList.add(ownStyles.phoneNumberContainer);
        this.append(phoneNumberContainer);

        const phoneNumber = document.createElement("h1");
        phoneNumber.innerText = "+33 1 23 45 67 89";
        phoneNumberContainer.append(phoneNumber);

        const buttonBack = new IconButton();
        buttonBack.type = IconButtonType.inline;
        buttonBack.embedSvgContent(require("assets/icons/edit_svg.svg"));
        phoneNumberContainer.append(buttonBack);
        fromEvent(buttonBack, "click").subscribe(() => this.delegate.userDidRequestIdentityChange());

        const message = document.createElement("p");
        message.innerText = "We have sent you and SMS with the code";
        this.append(message);

        const codeField = new TextField();
        codeField.label = "Code";
        this.append(codeField);

        const nextButton = new Button();
        nextButton.text = "Next";
        this.append(nextButton);
        fromEvent(nextButton, "click").subscribe(() => this.delegate.userDidVerifyIdentity());
    }
}

customElements.define("auth-verify-identity", VerifyIdentityComponent);
