import {View} from "../view";
import {TagName} from "../tag-name";

const style = require("./icon.scss");

export class Icon extends View {
    constructor(content: string | null = null) {
        super(TagName.figure);
        this.addClassName(style.icon);
        this.svgContent = content;
    }

    private _svgContent: string | null = null;

    public get svgContent(): string | null {
        return this._svgContent;
    }

    public set svgContent(value: string | null) {
        this._svgContent = value;
        this.element.innerHTML = value || "";
    }
}
