import {View} from "./view";


export class ClassNameControl<TFlag> {
    constructor(private readonly view: View) {
    }

    private _currentFlag: TFlag | null = null;

    public get currentFlag(): TFlag | null {
        return this._currentFlag;
    }

    private _currentClassName: string | null = null;

    public get currentClassName(): string | null {
        return this._currentClassName;
    }

    public activate(flag: TFlag, className: string) {
        if (flag !== this.currentFlag) {
            this._currentFlag = flag;
            this.removeClassNameIfNeeded();
            this.view.addClassName(className);
            this._currentClassName = className;
        }
    }

    private removeClassNameIfNeeded() {
        if (this.currentClassName) {
            this.view.removeClassName(this.currentClassName);
        }
    }
}