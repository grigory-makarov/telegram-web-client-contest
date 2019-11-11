import {TagName} from "./tag-name";
import {assert, List} from "@telegram/foundation";
import {environment} from "../../environments/environment";

export class View<TElement extends HTMLElement = HTMLElement> {
    public readonly element: TElement;
    private readonly _subviews = List.empty<View>();

    constructor(private readonly tagName: TagName = TagName.div) {
        this.element = document.createElement(tagName) as TElement;

        if (!environment.production) {
            this.element.dataset.view = this.constructor.name;
        }
    }

    private _superview: View | null = null;

    public get superview(): View | null {
        return this._superview;
    }

    public get subviews(): List<View> {
        return this._subviews.copy();
    }

    public addSubview(subview: View) {
        this.assertViewCanBecomeSubview(subview);
        subview._superview = this;
        this.element.append(subview.element);
        this._subviews.append(subview);
    }

    public insertSubviewAt(subview: View, index: number) {
        this.assertViewCanBecomeSubview(subview);
        this._subviews.insertAt(subview, index);

        const subviewBefore = this._subviews.get(index + 1);

        if (subviewBefore) {
            this.element.insertBefore(subview.element, subviewBefore.element);
        } else {
            this.element.append(subview.element);
        }
    }

    public insertSubviewAbove(subview: View, target: View) {
        const index = this._subviews.indexOf(target);
        this.insertSubviewAt(subview, index);
    }

    public insertSubviewBelow(subview: View, target: View) {
        const index = this._subviews.indexOf(target);
        assert(index >= 0);
        this.insertSubviewAt(subview, index + 1);
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
