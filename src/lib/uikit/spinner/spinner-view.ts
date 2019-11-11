import {View} from "../view";
import {Icon} from "@telegram/uikit";

const style = require("./spinner.scss");

export class SpinnerView extends View {
    private readonly icon: Icon = (() => {
        const view = new Icon(require("assets/icons/loader.svg"));
        view.addClassName(style.icon);
        this.addSubview(view);
        return view;
    })();

    constructor() {
        super();
        this.addClassName(style.spinnerView);
    }
}
