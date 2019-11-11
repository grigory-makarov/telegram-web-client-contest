import {View} from "../view";

const style = require("./modal-container.scss");


export class ModalContainerView extends View {
    constructor() {
        super();
        this.addClassName(style.modalContainerView);
    }
}
