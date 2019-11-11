import {ViewController} from "@telegram/uikit";
import {MessengerView} from "./messenger-view";

export class MessengerViewController extends ViewController<MessengerView> {
    public createView(): MessengerView {
        return new MessengerView();
    }
}
