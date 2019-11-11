import {Icon, Image, TagName, View} from "@telegram/uikit";
import {fromEvent} from "rxjs";

const style = require("./profile-photo-picker.scss");


export class ProfilePhotoPicker extends View {
    public readonly fileInput: View<HTMLInputElement> = (() => {
        const view = new View<HTMLInputElement>(TagName.input);
        view.element.type = "file";
        view.element.accept = "image/x-png,image/gif,image/jpeg";
        view.addClassName(style.fileInput);
        this.addSubview(view);
        return view;
    })();


    public readonly image: Image = (() => {
        const image = new Image("");
        image.element.style.opacity = "0";
        image.addClassName(style.image);
        this.addSubview(image);
        return image;
    })();

    constructor() {
        super();

        this.addClassName(style.profilePhotoPicker);
        const icon = new Icon(require("assets/icons/cameraadd_svg.svg"));
        icon.addClassName(style.icon);
        this.addSubview(icon);

        fromEvent(this.element, "click").subscribe(() => this.fileInput.element.click());
    }
}
