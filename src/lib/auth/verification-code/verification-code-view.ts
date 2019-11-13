import {Button, ButtonType, ContentType, Icon, TagName, TextField, View} from "@telegram/uikit";

const style = require("./verification-code.scss");

export class VerificationCodeView extends View {
    public readonly codeField: TextField;
    public readonly phoneNumberView: View;
    public readonly editPhoneNumberButton: Button;

    constructor() {
        super();

        this.addClassName(style.verificationCode);

        const logo = new Icon(require("assets/icons/logo.svg"));
        logo.addClassName(style.logo);
        this.addSubview(logo);

        const phoneNumberContainer = new View();
        phoneNumberContainer.addClassName(style.phoneNumberContainer);
        this.addSubview(phoneNumberContainer);

        this.phoneNumberView = new View(TagName.h1);
        this.phoneNumberView.addClassName(style.phoneNumber);
        phoneNumberContainer.addSubview(this.phoneNumberView);

        this.editPhoneNumberButton = new Button();
        this.editPhoneNumberButton.type = ButtonType.textButton;
        this.editPhoneNumberButton.text = null;
        this.editPhoneNumberButton.icon = new Icon(require("assets/icons/edit_svg.svg"));
        phoneNumberContainer.addSubview(this.editPhoneNumberButton);

        const message = new View(TagName.p);
        message.element.innerText = "We have sent you an SMS with the code";
        message.addClassName(style.message);
        this.addSubview(message);

        this.codeField = new TextField();
        this.codeField.label = "Code";
        this.codeField.contentType = ContentType.number;
        this.codeField.addClassName(style.field);
        this.addSubview(this.codeField);
    }

    public get phoneNumber(): string {
        return this.phoneNumberView.element.innerText;
    }

    public set phoneNumber(value: string) {
        this.phoneNumberView.element.innerText = value;
    }
}