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
import {View} from '../view';
import {Icon, TagName} from "@telegram/uikit";
import {fromEvent, Observable} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";

const style = require('./search-box.scss');

export class SearchBox extends View {
    private readonly iconView: Icon = (() => {
        const view = new Icon(require('assets/icons/search_svg.svg'));
        view.addClassName(style.icon);
        this.addSubview(view);
        return view;
    })();

    private readonly inputView: View<HTMLInputElement> = (() => {
        const view = new View<HTMLInputElement>(TagName.input);
        view.element.type = 'search';
        view.addClassName(style.input);
        this.addSubview(view);
        return view;
    })();

    public readonly query$: Observable<string> = fromEvent(this.inputView.element, 'input').pipe(
        map(() => this.query),
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
        this.label = "Search";
        this.addClassName(style.searchField);

        fromEvent(this.element, 'click').subscribe(() => this.inputView.element.focus());

        this.setupHidingLabelFeature();
    }

    public get query(): string {
        return this.inputView.element.value;
    }

    public set query(value: string) {
        this.inputView.element.value = value;
    }

    public get label(): string {
        return this.labelView.element.innerText;
    }

    public set label(value: string) {
        this.labelView.element.innerText = value;
    }

    private setupHidingLabelFeature() {
        let hasHiddenClass = false;

        this.query$.subscribe(query => {
            if (query && !hasHiddenClass) {
                this.labelView.addClassName(style.hidden);
                hasHiddenClass = true;
            } else if (!query && hasHiddenClass) {
                this.labelView.removeClassName(style.hidden);
                hasHiddenClass = false;
            }
        });
    }
}