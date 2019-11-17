import {MtProto} from "@telegram/mt-proto";
import {LoadingSpinner} from "@telegram/uikit";
import {AuthComponent} from "@telegram/auth";

const styles = require("./app-component.scss");


export class AppComponent extends HTMLElement {
    constructor() {
        super();

        this.classList.add(styles.host);
        this.presentedComponent = new LoadingSpinner();
    }

    private _presentedComponent: HTMLElement | null = null;

    private get presentedComponent(): HTMLElement | null {
        return this._presentedComponent;
    }

    private set presentedComponent(value: HTMLElement | null) {
        if (value !== this.presentedComponent) {
            if (this.presentedComponent) {
                this.presentedComponent.remove();
            }

            this._presentedComponent = value;

            if (value) {
                this.append(value);
            }
        }
    }

    public async connectedCallback() {
        await MtProto.shared.authService.authenticate();
        await this.loadAuthentication();
    }

    private async loadMessenger() {
        const {Messenger} = await import("@telegram/messenger");
        this.presentedComponent = new Messenger();
    }

    private async loadAuthentication() {
        const {AuthComponent} = await import("@telegram/auth");
        this.presentedComponent = new AuthComponent();
    }
}

customElements.define("app-root", AppComponent);
