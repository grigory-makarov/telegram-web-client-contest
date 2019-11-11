import {ViewController} from "@telegram/uikit";
import {VerificationCodeView} from "./verification-code-view";
import {filter, map, takeUntil} from "rxjs/operators";

export interface VerificationCodeViewControllerDelegate {
    userDidRequestIdentityChange(): void;

    userDidVerifyCode(): void;
}

export class VerificationCodeViewController extends ViewController<VerificationCodeView> {
    constructor(private readonly delegate: VerificationCodeViewControllerDelegate) {
        super();
    }

    public createView(): VerificationCodeView {
        return new VerificationCodeView();
    }

    public viewWillAppear() {
        super.viewWillAppear();
        this.view.codeField.value = "";
        this.view.phoneNumber = "+31 12 34 56 789";

        this.view.editPhoneNumberButton.tap$.pipe(
            map(() => this.delegate.userDidRequestIdentityChange()),
            takeUntil(this.viewDidDisappear$)
        ).subscribe();

        this.view.codeField.value$.pipe(
            filter(value => value.length === 6),
            map(() => this.delegate.userDidVerifyCode()),
            takeUntil(this.viewDidDisappear$)
        ).subscribe();
    }
}
