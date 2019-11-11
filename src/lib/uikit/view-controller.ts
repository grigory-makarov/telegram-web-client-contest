/*
 * Copyright 2019 Grigory Makarov <makkgregory@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {View} from "./view";
import {assert, List} from "@telegram/foundation";
import {ModalContainerView} from "./modal-container/modal-container-view";
import {environment} from "../../environments/environment";

export abstract class ViewController<TView extends View = View> {
    private static readonly modalViewContainer: ModalContainerView = (() => {
        const view = new ModalContainerView();
        document.body.append(view.element);
        return view;
    })();

    // region Managing View Controller's View
    private _view: TView | null = null;

    public get view(): TView {
        return this._view!;
    }

    public get isViewCreated(): boolean {
        return this._view !== null;
    }

    public abstract createView(): TView;

    public createViewIfNeeded() {
        if (!this.isViewCreated) {
            this._view = this.createView();
            this.viewDidLoad();
        }
    }

    // endregion

    public viewDidLoad() {
        if (!environment.production) {
            this.view.element.dataset.viewController = this.constructor.name;
        }
    }

    public viewWillAppear() {

    }

    public viewDidAppear() {
    }

    public viewWillDisappear() {
    }

    public viewDidDisappear() {
    }

    // region Presenting And Dismissing Child View Controllers
    private _presentingViewController: ViewController | null = null;

    public get presentingViewController(): ViewController | null {
        return this._presentingViewController;
    }

    private readonly _presentedViewControllers = List.empty<ViewController>();

    public get presentedViewControllers(): List<ViewController> {
        return this._presentedViewControllers.copy();
    }

    public present(controller: ViewController) {
        this.prepareToPresent(controller);
        this.view.addSubview(controller.view);
        controller.viewDidAppear();
    }

    public presentModal(controller: ViewController) {
        this.prepareToPresent(controller);
        ViewController.modalViewContainer.addSubview(controller.view);
        controller.viewDidAppear();
    }

    private prepareToPresent(controller: ViewController) {
        assert(controller._presentingViewController === null);
        controller._presentingViewController = this;
        this._presentedViewControllers.append(controller);
        controller.createViewIfNeeded();
        controller.viewWillAppear();
    }

    public dismiss() {
        if (this._presentingViewController) {
            for (const controller of this._presentedViewControllers) {
                controller.dismiss();
            }

            this.viewWillDisappear();
            this._presentingViewController = null;
            this.view.removeFromSuperview();
            this.viewDidDisappear();
        }
    }

    // endregion
}
