import {ChatSidebar} from "./chat-sidebar/chat-sidebar";
import {User} from "./user";
import {LoadingSpinner} from "@telegram/uikit";

const styles = require("./messenger.scss");

export class Messenger extends HTMLElement {
    private readonly sidebarContainer: HTMLElement;
    private readonly content: HTMLElement;

    constructor() {
        super();

        this.classList.add(styles.host);

        this.sidebarContainer = document.createElement("div");
        this.sidebarContainer.classList.add(styles.sidebarContainer);
        this.append(this.sidebarContainer);

        this.presentedSidebarContent = new LoadingSpinner();

        this.content = document.createElement("div");
        this.content.classList.add(styles.content);
        this.append(this.content);
    }

    private _presentedSidebarContent: HTMLElement | null = null;

    public get presentedSidebarContent(): HTMLElement | null {
        return this._presentedSidebarContent;
    }

    public set presentedSidebarContent(value: HTMLElement | null) {
        if (value !== this.presentedSidebarContent) {
            if (this.presentedSidebarContent) {
                this.presentedSidebarContent.remove();
            }

            this._presentedSidebarContent = value;

            if (this.presentedSidebarContent) {
                this.sidebarContainer.append(this.presentedSidebarContent);
            }
        }
    }

    public async connectedCallback() {
        const users = await this.fetchUsers();
        this.presentedSidebarContent = new ChatSidebar(users);
    }

    private async fetchUsers(): Promise<User[]> {
        const result = await fetch("https://randomuser.me/api?results=500");
        return (await result.json()).results;
    }
}

customElements.define("msg-messenger", Messenger);
