import {ViewController} from "@telegram/uikit";
import {SignUpView} from "./sign-up-view";
import {ProfilePhotoPickerController} from "../common/profile-photo-picker/profile-photo-picker-controller";
import {map, takeUntil} from "rxjs/operators";

export interface SignUpViewControllerDelegate {
    userDidSignUp(): void;
}

export class SignUpViewController extends ViewController<SignUpView> {
    private readonly profilePhotoPickerController = new ProfilePhotoPickerController();

    constructor(private readonly delegate: SignUpViewControllerDelegate) {
        super();
    }

    public createView(): SignUpView {
        return new SignUpView(this.profilePhotoPickerController.view);
    }

    public viewWillAppear() {
        super.viewWillAppear();

        this.view.completeButton.tap$.pipe(
            map(() => this.delegate.userDidSignUp()),
            takeUntil(this.viewDidDisappear$)
        ).subscribe();
    }
}
