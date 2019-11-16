import {fatal} from "@telegram/foundation";

const styles = require("./button.scss");

export enum ButtonType {
    text,
    mixed,
    push
}

export class Button extends HTMLElement {
    private typeClassName: string | null = null;
    private readonly textContainer: HTMLElement;
    private leadingIcon: HTMLElement;
    private trailingIcon: HTMLElement;

    constructor() {
        super();

        this.classList.add(styles.host);

        this.leadingIcon = document.createElement("figure");
        this.leadingIcon.classList.add(styles.icon);
        this.append(this.leadingIcon);

        this.textContainer = document.createElement("span");
        this.textContainer.classList.add(styles.text);
        this.append(this.textContainer);

        this.trailingIcon = document.createElement("figure");
        this.trailingIcon.classList.add(styles.icon);
        this.append(this.trailingIcon);

        this.type = ButtonType.push;
        this.text = "Button";
    }

    private _type!: ButtonType;

    public get type(): ButtonType {
        return this._type;
    }

    public set type(value: ButtonType) {
        if (value !== this.type) {
            this._type = value;

            if (this.typeClassName) {
                this.classList.remove(this.typeClassName);
            }

            switch (this.type) {
                case ButtonType.text:
                    this.typeClassName = styles.textButton;
                    break;
                case ButtonType.mixed:
                    this.typeClassName = styles.mixedButton;
                    break;
                case ButtonType.push:
                    this.typeClassName = styles.pushButton;
                    break;
                default:
                    fatal("Unknown button type");
            }

            this.classList.add(this.typeClassName!);
        }
    }

    private _text = "Button";

    public get text(): string {
        return this.textContainer.innerText;
    }

    public set text(value: string) {
        if (value !== this.text) {
            this.textContainer.innerText = value;
        }
    }

    public embedLeadingIconSvgContent(content: string) {
        this.leadingIcon.innerHTML = content;
    }

    public clearLeadingIconSvgContent() {
        this.leadingIcon.innerHTML = "";
    }

    public embedTrailingIconSvgContent(content: string) {
        this.trailingIcon.innerHTML = content;
    }

    public clearTrailingIconSvgContent() {
        this.trailingIcon.innerHTML = "";
    }

}

customElements.define("ui-button", Button);
