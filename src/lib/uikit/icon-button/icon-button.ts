import {fatal} from "@telegram/foundation";

const styles = require("./icon-button.scss");

export enum IconButtonType {
    inline,
    fab
}

export class IconButton extends HTMLElement {
    private readonly icon: HTMLElement;
    private typeClassName: string | null = null;

    constructor() {
        super();

        this.classList.add(styles.host);

        this.icon = document.createElement("figure");
        this.append(this.icon);

        this.type = IconButtonType.inline;
    }

    private _type!: IconButtonType;

    public get type(): IconButtonType {
        return this._type;
    }

    public set type(value: IconButtonType) {
        if (value !== this.type) {
            this._type = value;

            if (this.typeClassName) {
                this.classList.remove(this.typeClassName);
            }

            switch (this.type) {
                case IconButtonType.fab:
                    this.typeClassName = styles.fab;
                    break;
                case IconButtonType.inline:
                    this.typeClassName = styles.inline;
                    break;
                default:
                    fatal("Unknown icon button type");
            }

            this.classList.add(this.typeClassName!);
        }
    }

    public embedSvgContent(content: string) {
        this.icon.innerHTML = content;
    }
}

customElements.define("ui-icon-button", IconButton);
