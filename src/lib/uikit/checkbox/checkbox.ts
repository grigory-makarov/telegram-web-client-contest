import {fromEvent} from "rxjs";

const styles = require("./checkbox.scss");

export class Checkbox extends HTMLElement {
    private readonly checkbox: HTMLElement;
    private readonly labelContainer: HTMLElement;

    constructor() {
        super();

        this.classList.add(styles.host);

        this.checkbox = document.createElement("figure");
        this.checkbox.classList.add(styles.checkbox);
        this.append(this.checkbox);

        this.labelContainer = document.createElement("div");
        this.labelContainer.classList.add(styles.label);
        this.append(this.labelContainer);

        this.checked = true;
        fromEvent(this, "click").subscribe(() => this.checked = !this.checked);
    }

    private _checked = false;

    public get checked(): boolean {
        return this._checked;
    }

    public set checked(value: boolean) {
        if (value !== this.checked) {
            this._checked = value;

            if (this.checked) {
                this.checkbox.innerHTML = require("assets/icons/checkboxon_svg.svg");
                this.classList.add(styles.checked);
            } else {
                this.checkbox.innerHTML = require("assets/icons/checkboxempty_svg.svg");
                this.classList.remove(styles.checked);
            }
        }
    }

    private _label: string | null = null;

    public get label(): string | null {
        return this._label;
    }

    public set label(value: string | null) {
        if (this.label !== value) {
            this._label = value;

            this.labelContainer.innerText = this.label || "";
            this.labelContainer.hidden = !this.hasLabel;
        }
    }

    public get hasLabel(): boolean {
        return !!this.label;
    }
}

customElements.define("ui-checkbox", Checkbox);
