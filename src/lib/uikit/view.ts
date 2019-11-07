import {TagName} from "./tag-name";
import {assert, List, notImplemented} from "@telegram/foundation";

export class View {
    private _superview: View | null = null;
    private readonly _subviews = List.empty<View>();
    public readonly element: HTMLElement;

    public get superview(): View | null {
        return this._superview;
    }

    public get subviews(): List<View> {
        return this._subviews.copy();
    }

    constructor(private readonly tagName: TagName = TagName.div) {
        this.element = document.createElement(tagName);
    }

    public addSubview(subview: View) {
        this.assertViewCanBecomeSubview(subview);
        subview._superview = this;
        this.element.append(subview.element);
        this._subviews.append(subview);
    }

    public insertSubviewAt(subview: View, index: number) {
        return notImplemented();
    }

    public insertSubviewAbove(subview: View, target: View) {
        return notImplemented();
    }

    public insertSubviewBelow(subview: View, target: View) {
        return notImplemented();
    }

    public addClassName(name: string) {
        this.element.classList.add(name);
    }

    public removeClassName(name: string) {
        this.element.classList.remove(name);
    }

    public removeFromSuperview() {
        if (this._superview) {
            this._superview._subviews.remove(this);
            this.element.remove();
            this._superview = null;
        }
    }

    private assertViewCanBecomeSubview(view: View) {
        assert(!view._superview, "The given view is a subview of another superview");
    }
}
