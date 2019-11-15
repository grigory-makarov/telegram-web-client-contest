import {View} from "../view";
import {ScrollDirection, ScrollView} from "../scroll-view/scroll-view";

const style = require("./list-view.scss");

export interface ListViewDelegate {
    countSections(): number;

    countItemsInSectionAt(index: number): number;

    sectionAt(index: number): View;

    sectionHeightAt(index: number): number;

    itemAt(indexPath: { sectionIndex: number, itemIndex: number }): View;

    itemHeightAt(indexPath: { sectionIndex: number, itemIndex: number }): number;
}

export class ListView extends View {
    private readonly scrollView: ScrollView = (() => {
        const view = new ScrollView(ScrollDirection.horizontal);
        this.addSubview(view);
        return view;
    })();

    constructor(private readonly delegate: ListViewDelegate) {
        super();
        this.addClassName(style.listView);
        this.reloadData();
    }

    public reloadData() {
        for (let i = 0; i < this.delegate.countSections(); i++) {
            const section = this.delegate.sectionAt(i);

            for (let j = 0; j < this.delegate.countItemsInSectionAt(i); j++) {
                const item = this.delegate.itemAt({sectionIndex: i, itemIndex: j});
                section.addSubview(item);
            }

            this.scrollView.addSubview(section);
        }
    }
}
