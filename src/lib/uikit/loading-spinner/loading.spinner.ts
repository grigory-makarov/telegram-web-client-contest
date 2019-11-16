const styles = require("./loading-spinner.scss");


export class LoadingSpinner extends HTMLElement {
    constructor() {
        super();

        this.classList.add(styles.host);

        const icon = document.createElement("figure");
        icon.classList.add(styles.icon);
        icon.innerHTML = require("assets/icons/loader.svg");
        this.append(icon);
    }
}

customElements.define("ui-loading-spinner", LoadingSpinner);
