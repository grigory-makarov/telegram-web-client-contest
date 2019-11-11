import {ViewController} from "@telegram/uikit";
import {PasswordView} from "./password-view";

export class PasswordViewController extends ViewController<PasswordView> {
    public createView(): PasswordView {
        return new PasswordView();
    }
}
