import {ViewController} from "@telegram/uikit";
import {ProfilePhotoPicker} from "./profile-photo-picker";
import {fromEvent} from "rxjs";
import {map, takeUntil} from "rxjs/operators";

export class ProfilePhotoPickerController extends ViewController<ProfilePhotoPicker> {
    public createView(): ProfilePhotoPicker {
        return new ProfilePhotoPicker();
    }

    public viewWillAppear() {
        super.viewWillAppear();

        fromEvent(this.view.fileInput.element, "change").pipe(
            map(() => this.view.fileInput.element.files![0]),
            map(file => this.userDidPickFile(file)),
            takeUntil(this.viewDidDisappear$)
        ).subscribe();
    }

    private userDidPickFile(file: File | null) {
        console.log("User did select file!");
    }
}
