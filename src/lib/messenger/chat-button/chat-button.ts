const styles = require("./chat-button.scss");


export class ChatButton extends HTMLElement {
    private readonly avatar: HTMLImageElement;
    private readonly onlineMarker: HTMLElement;
    private readonly nameContainer: HTMLElement;
    private readonly receiveDateLabel: HTMLElement;
    private readonly messageText: HTMLElement;
    private readonly newMessageCounter: HTMLElement;

    constructor() {
        super();

        this.classList.add(styles.host);

        const thumbnailContainer = document.createElement("div");
        thumbnailContainer.classList.add(styles.thumbnailContainer);
        this.append(thumbnailContainer);

        this.avatar = document.createElement("img");
        thumbnailContainer.append(this.avatar);

        this.onlineMarker = document.createElement("div");
        this.onlineMarker.classList.add(styles.onlineMarker);
        this.onlineMarker.hidden = true;
        thumbnailContainer.append(this.onlineMarker);

        const chatInfo = document.createElement("div");
        chatInfo.classList.add(styles.chatInfo);
        this.append(chatInfo);

        const chatName = document.createElement("div");
        chatName.classList.add(styles.chatName);
        chatInfo.append(chatName);

        this.nameContainer = document.createElement("h2");
        chatName.append(this.nameContainer);

        this.receiveDateLabel = document.createElement("div");
        this.receiveDateLabel.classList.add(styles.receiveDate);
        chatName.append(this.receiveDateLabel);

        const messagePreview = document.createElement("div");
        messagePreview.classList.add(styles.chatMessagePreview);
        chatInfo.append(messagePreview);

        this.messageText = document.createElement("p");
        messagePreview.append(this.messageText);

        this.newMessageCounter = document.createElement("div");
        this.newMessageCounter.classList.add(styles.newMessageCounter);
        this.newMessageCounter.hidden = true;
        messagePreview.append(this.newMessageCounter);
    }

    private _avatarUrl: string | null = null;

    public get avatarUrl(): string | null {
        return this._avatarUrl;
    }

    public set avatarUrl(value: string | null) {
        this._avatarUrl = value;
        this.avatar.src = this.avatarUrl || "";
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

    public get isOnline(): boolean {
        return !this.onlineMarker.hidden;
    }

    public set isOnline(value: boolean) {
        this.onlineMarker.hidden = !value;
    }

    public get message(): string {
        return this.messageText.innerText;
    }

    public set message(value: string) {
        this.messageText.innerText = value;
    }

    public get newMessageCount(): number {
        return Number(this.newMessageCounter.innerText) || 0;
    }

    public set newMessageCount(value: number) {
        const count = Math.abs(value).toString();
        this.newMessageCounter.innerText = count;
        this.newMessageCounter.style.width = 1 + count.length * .5 + "rem";
    }

    public get displayName(): string {
        return this.nameContainer.innerText;
    }

    public set displayName(value: string) {
        this.nameContainer.innerText = value;
    }
}

customElements.define("msg-chat-button", ChatButton);
