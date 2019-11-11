import {ContainerView, View, ViewController} from "@telegram/uikit";
import {MessengerViewController} from "@telegram/messenger";

export class AppViewController extends ViewController {
    private constructor() {
        super();
    }

    public static presentIn(element: HTMLElement) {
        const controller = new AppViewController();
        controller.viewWillAppear();
        element.append(controller.view.element);
        controller.viewDidAppear();
    }

    public createView(): View {
        return new ContainerView();
    }

    public viewWillAppear() {
        super.viewWillAppear();

        this.present(new MessengerViewController());
    }

    private present(controller: ViewController) {
        controller.viewWillAppear();
        this.view.addSubview(controller.view);
        controller.viewDidAppear();
    }
}
