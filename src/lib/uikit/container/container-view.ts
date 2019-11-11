import {View} from "@telegram/uikit";

const style = require("./container.scss");


export class ContainerView extends View {
    constructor() {
        super();

        this.addClassName(style.containerView);
    }
}
