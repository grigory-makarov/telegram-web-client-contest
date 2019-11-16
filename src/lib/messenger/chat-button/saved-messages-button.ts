const styles = require("./chat-button.scss");


export class SavedMessagesButton extends HTMLElement {
    private readonly receiveDateLabel: HTMLElement;
    private readonly messageText: HTMLElement;

    constructor() {
        super();

        this.classList.add(styles.host);

        const thumbnailContainer = document.createElement("div");
        thumbnailContainer.classList.add(styles.thumbnailContainer);
        this.append(thumbnailContainer);

        const avatar = document.createElement("figure");
        avatar.innerHTML = require("assets/icons/avatar_savedmessages_svg.svg");
        thumbnailContainer.append(avatar);

        const chatInfo = document.createElement("div");
        chatInfo.classList.add(styles.chatInfo);
        this.append(chatInfo);

        const chatName = document.createElement("div");
        chatName.classList.add(styles.chatName);
        chatInfo.append(chatName);

        const title = document.createElement("h2");
        title.innerText = "Saved Messages";
        chatName.append(title);

        const receiveDate = document.createElement("div");
        receiveDate.classList.add(styles.savedMessageReceiveDate);
        chatName.append(receiveDate);

        const receiveDateIcon = document.createElement("figure");
        receiveDateIcon.innerHTML = require("assets/icons/2checks_svg.svg");
        receiveDate.append(receiveDateIcon);

        this.receiveDateLabel = document.createElement("span");
        this.receiveDateLabel.classList.add(styles.receiveDate);
        receiveDate.append(this.receiveDateLabel);

        const messagePreview = document.createElement("div");
        messagePreview.classList.add(styles.chatMessagePreview);
        chatInfo.append(messagePreview);

        this.messageText = document.createElement("p");
        messagePreview.append(this.messageText);

        const pinnedIndicator = document.createElement("figure");
        pinnedIndicator.classList.add(styles.pinnedIndicator);
        pinnedIndicator.innerHTML = require("assets/icons/pinnedchat_svg.svg");
        messagePreview.append(pinnedIndicator);
    }

    private _receiveDate: Date | null = null;

    public get receiveDate(): Date | null {
        return this._receiveDate;
    }

    public set receiveDate(value: Date | null) {
        this._receiveDate = value;

        if (this.receiveDate) {
            this.receiveDateLabel.innerText = this.receiveDate.toLocaleDateString();
        } else {
            this.receiveDateLabel.innerText = "";
        }
    }

    public get message(): string {
        return this.messageText.innerText;
    }

    public set message(value: string) {
        this.messageText.innerText = value;
    }
}

customElements.define("msg-saved-messages-button", SavedMessagesButton);
