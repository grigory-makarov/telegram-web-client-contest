import {TagName, View} from "@telegram/uikit";
import {Observable, Subject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";

const style = require("./field.scss");

export enum FocusState {
    focused,
    blurred
}

export abstract class Field<TValue> extends View {
    public abstract value$: Observable<TValue>;
    public abstract value: TValue;
    protected readonly focusStateSubject = new Subject<FocusState>();
    public readonly focusState$ = this.focusStateSubject.pipe(
        distinctUntilChanged()
    );
    private readonly labelView: View = (() => {
        const view = new View(TagName.span);
        view.addClassName(style.label);
        this.addSubview(view);
        return view;
    })();

    constructor() {
        super();

        this.addClassName(style.field);
        this.label = "Field";

        setTimeout(() => {
            this.listenFloatingLabelChanges();
            this.listenFocusStateChanges();
        }, 0);
    }

    public get label(): string {
        return this.labelView.element.innerText;
    }

    public set label(value: string) {
        this.labelView.element.innerText = value;
    }

    private listenFloatingLabelChanges() {
        let hasFloatingClassName = false;

        this.value$.subscribe(value => {
            if (value && !hasFloatingClassName) {
                this.labelView.addClassName(style.floating);
                hasFloatingClassName = true;
            } else if (!value && hasFloatingClassName) {
                this.labelView.removeClassName(style.floating);
                hasFloatingClassName = false;
            }
        });
    }

    private listenFocusStateChanges() {
        this.focusState$.subscribe(state => {
            if (state === FocusState.focused) {
                this.addClassName(style.focused);
            } else {
                this.removeClassName(style.focused);
            }
        });
    }
}
