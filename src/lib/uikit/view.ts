import {TagName} from "./tag-name";
import {assert, assertNotNil, List} from "@telegram/foundation";

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

    public get style(): CSSStyleDeclaration {
        return this.element.style;
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

    public addClassName(name: string) {
        this.element.classList.add(name);
    }

    public removeClassName(name: string) {
        this.element.classList.remove(name);
    }

    public removeFromSuperview() {
        assertNotNil(this._superview, "Missing superview to remove from");
        this._superview!._subviews.remove(this);
        this.element.remove();
        this._superview = null;
    }

    private assertViewCanBecomeSubview(view: View) {
        assert(!view._superview, "The given view is a subview of another superview");
    }
}
