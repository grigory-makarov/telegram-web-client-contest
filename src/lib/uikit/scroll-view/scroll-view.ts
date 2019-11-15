import {View} from "../view";
import {ClassNameControl} from "../class-name-control";
import {fatal} from "@telegram/foundation";

const style = require("./scroll-view.scss");


export enum ScrollDirection {
    horizontal,
    vertical,
    bidirectional
}

export class ScrollView extends View {
    private scrollDirectionControl = new ClassNameControl<ScrollDirection>(this);

    constructor(scrollDirection: ScrollDirection) {
        super();
        this.addClassName(style.scrollView);
        this.scrollDirection = scrollDirection;
    }

    public get scrollDirection(): ScrollDirection {
        return this.scrollDirectionControl.currentFlag!;
    }

    public set scrollDirection(value: ScrollDirection) {
        switch (value) {
            case ScrollDirection.horizontal:
                this.scrollDirectionControl.activate(value, style.horizontal);
                break;
            case ScrollDirection.vertical:
                this.scrollDirectionControl.activate(value, style.vertical);
                break;
            case ScrollDirection.bidirectional:
                this.scrollDirectionControl.activate(value, style.bidirectional);
                break;
            default:
                fatal("Unknown scroll direction");
        }
    }
}
