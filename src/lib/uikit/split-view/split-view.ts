import {View} from "@telegram/uikit";

const style = require("./split-view.scss");

export class SplitView<TMasterView extends View = View, TDetailsView extends View = View> extends View {
    constructor(public readonly masterView: TMasterView,
                public readonly detailsView: TDetailsView) {
        super();

        this.addClassName(style.splitView);
        this.masterView.addClassName(style.masterView);
        this.detailsView.addClassName(style.detailsView);
        this.addSubview(this.masterView);
        this.addSubview(this.detailsView);
    }

    public get masterMinWidth(): string | null {
        return this.masterView.element.style.minWidth;
    }

    public set masterMinWidth(value: string | null) {
        this.masterView.element.style.minWidth = value;
    }

    public get masterMaxWidth(): string | null {
        return this.masterView.element.style.maxWidth;
    }

    public set masterMaxWidth(value: string | null) {
        this.masterView.element.style.maxWidth = value;
    }

    public get masterWidth(): string | null {
        return this.masterView.element.style.width;
    }

    public set masterWidth(value: string | null) {
        this.masterView.element.style.width = value;
        this.detailsView.element.style.width = value ? `calc(100% - ${value})` : "100%";
    }
}
