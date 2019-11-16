import {User} from "../user";
import {SavedMessagesButton} from "../chat-button/saved-messages-button";
import {ChatButton} from "../chat-button/chat-button";

const styles = require("./chat-list.scss");


export class ChatList extends HTMLElement {
    constructor(private readonly users: User[]) {
        super();

        this.classList.add(styles.host);
        this.createPinnedMessages();
        this.createMessages();
    }

    private createPinnedMessages() {
        const container = document.createElement("div");
        container.classList.add(styles.pinnedMessages);
        this.append(container);

        const savedMessagesButton = new SavedMessagesButton();
        savedMessagesButton.receiveDate = new Date();
        savedMessagesButton.message = "Hello World";
        container.append(savedMessagesButton);
    }

    private createMessages() {
        const container = document.createElement("div");
        container.classList.add(styles.messages);
        this.append(container);

        for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i];
            const chatButton = new ChatButton();
            chatButton.displayName = `${user.name.first} ${user.name.last} ${user.name.first} ${user.name.last}`;
            chatButton.receiveDate = new Date();
            chatButton.avatarUrl = user.picture.thumbnail;
            chatButton.message = user.email + user.email + user.email;
            chatButton.newMessageCount = user.dob.age;
            container.append(chatButton);
        }
    }
}

customElements.define("msg-chat-list", ChatList);
