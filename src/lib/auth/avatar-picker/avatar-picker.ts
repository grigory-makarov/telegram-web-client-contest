import {fromEvent} from "rxjs";

const styles = require("./avatar-picker.scss");

export class AvatarPicker extends HTMLElement {
    private readonly offscreenInput: HTMLInputElement;
    private readonly image: HTMLImageElement;

    constructor() {
        super();

        this.classList.add(styles.host);

        this.image = document.createElement("img");
        this.append(this.image);

        const icon = document.createElement("figure");
        icon.innerHTML = require("assets/icons/cameraadd_svg.svg");
        this.append(icon);

        this.offscreenInput = document.createElement("input");
        this.offscreenInput.type = "file";
        this.offscreenInput.accept = "image/x-png,image/gif,image/jpeg";
        this.offscreenInput.classList.add(styles.offscreenInput);
        this.append(this.offscreenInput);

        fromEvent(this, "click").subscribe(() => this.offscreenInput.click());
        fromEvent(this.offscreenInput, "change").subscribe(() => this.selectFile(this.offscreenInput.files![0]));

    }

    public selectFile(file: File | null) {
        if (file) {
            this.image.src = URL.createObjectURL(file);
        }
    }
}

customElements.define("wgt-avatar-picker", AvatarPicker);
