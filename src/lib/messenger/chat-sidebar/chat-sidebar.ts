import {IconButton, IconButtonType, SearchField} from "@telegram/uikit";
import {User} from "../user";
import {ChatList} from "../chat-list/chat-list";

const styles = require("./chat-sidebar.scss");


export class ChatSidebar extends HTMLElement {
    constructor(users: User[]) {
        super();

        const header = document.createElement("div");
        header.classList.add(styles.header);
        this.append(header);

        const menuButton = new IconButton();
        menuButton.embedSvgContent(require("assets/icons/menu_svg.svg"));
        menuButton.type = IconButtonType.inline;
        header.append(menuButton);

        const searchField = new SearchField();
        header.append(searchField);

        const content = document.createElement("div");
        content.classList.add(styles.content);
        this.append(content);

        content.append(new ChatList(users));
    }
}

customElements.define("msg-chat-sidebar", ChatSidebar);
