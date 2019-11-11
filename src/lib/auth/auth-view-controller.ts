import {View, ViewController} from "@telegram/uikit";
import {IdentityViewController, IdentityViewControllerDelegate} from "./identity/identity-view-controller";
import {
    VerificationCodeViewController,
    VerificationCodeViewControllerDelegate
} from "./verification-code/verification-code-view-controller";
import {SignUpViewController, SignUpViewControllerDelegate} from "./sign-up/sign-up-view-controller";

const style = require("./auth.scss");

export interface AuthViewControllerDelegate {
    userDidAuthenticate(): void;
}

export class AuthViewController extends ViewController implements SignUpViewControllerDelegate, IdentityViewControllerDelegate, VerificationCodeViewControllerDelegate {
    private readonly signUpViewController = new SignUpViewController(this);
    private readonly identityViewController = new IdentityViewController(this);
    private readonly verificationCodeViewController = new VerificationCodeViewController(this);

    constructor(private readonly delegate: AuthViewControllerDelegate) {
        super();
    }

    public createView(): View {
        const view = new View();
        view.addClassName(style.auth);
        return view;
    }

    public viewWillAppear() {
        super.viewWillAppear();

        this.identityViewController.viewWillAppear();
        this.view.addSubview(this.identityViewController.view);
        this.identityViewController.viewDidAppear();
    }

    public userDidProvideIdentityData() {
        this.segue(this.identityViewController, this.verificationCodeViewController);
    }

    public userDidRequestIdentityChange() {
        this.segue(this.verificationCodeViewController, this.identityViewController);
    }

    public userDidVerifyCode() {
        this.segue(this.verificationCodeViewController, this.signUpViewController);
    }

    public userDidSignUp() {
        this.delegate.userDidAuthenticate();
    }

    private segue(source: ViewController, destination: ViewController) {
        source.viewWillDisappear();
        source.view.removeFromSuperview();
        source.viewDidDisappear();

        destination.viewWillAppear();
        this.view.addSubview(destination.view);
        destination.viewDidAppear();
    }
}
