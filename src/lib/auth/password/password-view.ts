import {Button, ButtonType, Icon, SecureField, TagName, View} from "@telegram/uikit";

const style = require("./password.scss");

export class PasswordView extends View {
    public readonly passwordField: SecureField;
    public readonly nextButton: Button;

    constructor() {
        super();

        this.addClassName(style.password);

        const image = new Icon(require("assets/icons/logo.svg"));
        image.addClassName(style.image);
        this.addSubview(image);

        const heading = new View(TagName.h1);
        heading.element.innerText = "Enter a Password";
        heading.addClassName(style.heading);
        this.addSubview(heading);

        const message = new View(TagName.p);
        message.element.innerText = "Your account is protected with an additional password";
        message.addClassName(style.message);
        this.addSubview(message);

        this.passwordField = new SecureField();
        this.passwordField.label = "Password";
        this.passwordField.addClassName(style.field);
        this.addSubview(this.passwordField);

        this.nextButton = new Button();
        this.nextButton.type = ButtonType.pushButton;
        this.nextButton.text = "Next";
        this.nextButton.addClassName(style.button);
        this.addSubview(this.nextButton);
    }
}