import {ContainerView, SpinnerView, SplitView, View} from "@telegram/uikit";

const style = require("./messenger.scss");

export class MessengerView extends ContainerView {
    constructor() {
        super();
        this.addClassName(style.messengerView);

        const splitView = new SplitView(new View(), new View());
        splitView.masterView.addClassName(style.masterView);
        splitView.detailsView.addClassName(style.detailsView);
        splitView.masterWidth = "420px";
        this.addSubview(splitView);

        const spinnerView = new SpinnerView();
        splitView.masterView.addSubview(spinnerView);
    }
}
