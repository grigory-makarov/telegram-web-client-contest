import {PromptIdentityComponent, PromptIdentityComponentDelegate} from "./prompt-identity-component";
import {VerifyIdentityComponent, VerifyIdentityComponentDelegate} from "./verify-identity/verify-identity-component";
import {SignUpComponent, SignUpComponentDelegate} from "./sign-up-component";

const styles = require("./auth.scss");

export class AuthComponent extends HTMLElement implements PromptIdentityComponentDelegate,
    VerifyIdentityComponentDelegate, SignUpComponentDelegate {

    private presentedComponent: HTMLElement | null = null;

    constructor() {
        super();
        this.classList.add(styles.host);

        this.segueTo(new PromptIdentityComponent(this));
    }

    public userDidProvideIdentity() {
        this.segueTo(new VerifyIdentityComponent(this));
    }

    public userDidRequestIdentityChange() {
        this.segueTo(new PromptIdentityComponent(this));
    }

    public userDidVerifyIdentity() {
        this.segueTo(new SignUpComponent(this));
    }

    public userDidSignUp() {
    }

    private segueTo(component: HTMLElement) {
        if (this.presentedComponent) {
            this.presentedComponent.remove();
        }

        this.presentedComponent = component;
        this.append(component);
    }
}

customElements.define("auth-root", AuthComponent);

