import {IdentityView} from "./identity-view";
import {ViewController} from "@telegram/uikit";
import {map, takeUntil} from "rxjs/operators";

export interface IdentityViewControllerDelegate {
    userDidProvideIdentityData(): void;
}

export class IdentityViewController extends ViewController<IdentityView> {
    constructor(private readonly delegate: IdentityViewControllerDelegate) {
        super();
    }

    public createView(): IdentityView {
        return new IdentityView();
    }

    public viewWillAppear() {
        super.viewWillAppear();

        this.view.nextButton.tap$.pipe(
            map(() => this.delegate.userDidProvideIdentityData()),
            takeUntil(this.viewDidDisappear$)
        ).subscribe();
    }
}
