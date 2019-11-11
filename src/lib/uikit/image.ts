import {View} from "./view";
import {TagName} from "./tag-name";

export class Image extends View<HTMLImageElement> {
    constructor(url: string) {
        super(TagName.img);
        this.url = url;
    }

    public get url(): string {
        return this.element.src;
    }

    public set url(value: string) {
        this.element.src = value;
    }
}
