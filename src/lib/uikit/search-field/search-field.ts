import {fromEvent} from "rxjs";

const styles = require("./search-field.scss");


export class SearchField extends HTMLElement {
    private readonly input: HTMLInputElement;
    private readonly labelContainer: HTMLElement;

    constructor() {
        super();

        this.classList.add(styles.host);

        const icon = document.createElement("figure");
        icon.classList.add(styles.icon);
        icon.innerHTML = require("assets/icons/search_svg.svg");
        this.append(icon);

        this.input = document.createElement("input");
        this.input.type = "search";
        this.input.classList.add(styles.input);
        this.append(this.input);

        fromEvent(this.input, "input").subscribe(() => this.handleInput(this.value));
        fromEvent(this.input, "focus").subscribe(() => this.focused = true);
        fromEvent(this.input, "blur").subscribe(() => this.focused = false);
        fromEvent(this, "click").subscribe(() => this.input.focus());

        this.labelContainer = document.createElement("div");
        this.labelContainer.classList.add(styles.label);
        this.append(this.labelContainer);

        this.label = "Search Field";
    }

    private _focused = false;

    public get focused(): boolean {
        return this._focused;
    }

    public set focused(value: boolean) {
        if (this.focused !== value) {
            this._focused = value;

            this.focused ? this.classList.add(styles.focused) : this.classList.remove(styles.focused);
        }
    }

    public get label(): string {
        return this.labelContainer.innerText;
    }

    public set label(value: string) {
        if (value !== this.label) {
            this.labelContainer.innerText = value;
        }
    }

    public get value(): string {
        return this.input.value;
    }

    public set value(value: string) {
        if (value !== this.value) {
            this.input.value = value;
        }
    }

    private handleInput(value: string) {
        if (this.value.length > 0) {
            this.labelContainer.classList.add(styles.hidden);
        } else {
            this.labelContainer.classList.remove(styles.hidden);
        }
    }
}

customElements.define("ui-search-field", SearchField);
