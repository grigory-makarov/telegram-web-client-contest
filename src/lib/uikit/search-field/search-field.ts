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
import {Subject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";


export class SearchField extends View {
    private readonly style = require('./search-field.scss');

    private readonly queryStream = new Subject<string>();

    public readonly query$ = this.queryStream.pipe(
        distinctUntilChanged()
    );

    public get query(): string {
        return this.inputView.element.value;
    }

    private readonly iconView: Icon = (() => {
        const view = new Icon(require('assets/icons/search_svg.svg'));
        view.addClassName(this.style.icon);
        this.addSubview(view);
        return view;
    })();

    private readonly inputView: View<HTMLInputElement> = (() => {
        const view = new View<HTMLInputElement>(TagName.input);
        view.element.type = 'search';
        view.addClassName(this.style.input);
        this.addSubview(view);
        return view;
    })();

    private readonly labelView: View = (() => {
        const view = new View(TagName.span);
        view.addClassName(this.style.label);
        this.addSubview(view);
        return view;
    })();

    public get label(): string {
        return this.labelView.element.innerText;
    }

    public set label(value: string) {
        this.labelView.element.innerText = value;
    }

    constructor() {
        super();
        this.label = "Search";
        this.addClassName(this.style.searchField);
        this.setupQueryListener();
    }

    private setupQueryListener() {
        this.inputView.element.oninput = () => this.queryStream.next(this.query);

        let labelHidden = false;

        this.query$.subscribe(query => {
            if (query && !labelHidden) {
                this.labelView.addClassName(this.style.hidden);
                labelHidden = true;
            } else if (!query && labelHidden) {
                this.labelView.removeClassName(this.style.hidden);
                labelHidden = false;
            }
        })
    }
}