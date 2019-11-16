import {fromEvent} from "rxjs";

const styles = require("./text-field.scss");

export class TextField extends HTMLElement {
    private static readonly offscreenLabel: HTMLElement = (() => {
        const label = document.createElement("span");
        label.classList.add(styles.offscreenLabel);
        document.body.append(label);
        return label;
    })();

    private readonly input: HTMLInputElement;
    private readonly labelContainer: HTMLElement;
    private readonly outlineGap: HTMLElement;

    constructor() {
        super();

        this.classList.add(styles.host);

        this.input = document.createElement("input");
        this.input.classList.add(styles.input);
        this.append(this.input);

        fromEvent(this.input, "focus").subscribe(() => this.focused = true);
        fromEvent(this.input, "blur").subscribe(() => this.focused = false);
        fromEvent(this, "click").subscribe(() => this.input.focus());
        fromEvent(this.input, "input").subscribe(() => this.handleInput(this.value));

        this.labelContainer = document.createElement("div");
        this.labelContainer.classList.add(styles.label);
        this.append(this.labelContainer);

        const outlineContainer = document.createElement("div");
        outlineContainer.classList.add(styles.outlineContainer);
        this.append(outlineContainer);

        const outlineStart = document.createElement("div");
        outlineStart.classList.add(styles.outline, styles.outlineStart);
        outlineContainer.append(outlineStart);

        this.outlineGap = document.createElement("div");
        this.outlineGap.classList.add(styles.outline, styles.outlineGap);
        outlineContainer.append(this.outlineGap);

        const outlineEnd = document.createElement("div");
        outlineEnd.classList.add(styles.outline, styles.outlineEnd);
        outlineContainer.append(outlineEnd);

        this.label = "Text Field";
    }

    private _label!: string;

    public get label(): string {
        return this._label;
    }

    public set label(value: string) {
        this._label = value;

        if (!this.hasError) {
            this.labelContainer.innerText = this.label;
        }
    }

    private _error: string | null = null;

    public get error(): string | null {
        return this._error;
    }

    public set error(value: string | null) {
        if (this.error !== value) {
            this._error = value;

            if (this.hasError) {
                this.labelContainer.innerText = this.error!;
                this.labelContainer.classList.add(styles.invalid);
            } else {
                this.labelContainer.innerText = this._label;
                this.labelContainer.classList.remove(styles.invalid);
            }
        }
    }

    public get hasError(): boolean {
        return !!this.error;
    }

    private _focused = false;

    public get focused(): boolean {
        return this._focused;
    }

    public set focused(value: boolean) {
        if (value !== this.focused) {
            this._focused = value;
            this.focused ? this.classList.add(styles.focused) : this.classList.remove(styles.focused);
        }
    }

    public get value(): string {
        return this.input.value;
    }

    public set value(value: string) {
        this.input.value = value;
    }

    public get type(): string {
        return this.input.type;
    }

    public set type(value: string) {
        this.input.type = value;
    }

    private _floating = false;

    private get floating(): boolean {
        return this._floating;
    }

    private set floating(value: boolean) {
        if (value !== this._floating) {
            this._floating = value;

            if (this.floating) {
                this.classList.add(styles.floating);
                this.extendOutlineGap();
            } else {
                this.classList.remove(styles.floating);
                this.collapseOutlineGap();
            }
        }
    }

    private handleInput(value: string) {
        this.floating = !!value;
    }

    private extendOutlineGap() {
        TextField.offscreenLabel.innerText = this.hasError ? this.error! : this.label;
        const labelWidth = TextField.offscreenLabel.clientWidth;
        this.outlineGap.style.width = `${labelWidth + 12}px`;
    }

    private collapseOutlineGap() {
        this.outlineGap.style.width = "0";
    }
}

customElements.define("ui-text-field", TextField);
