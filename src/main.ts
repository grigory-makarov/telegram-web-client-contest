import "./global.scss";
import {Button} from "@telegram/uikit";

const button = new Button();
button.embedTrailingIconSvgContent(require("assets/icons/loader.svg"));

document.body.append(button);
