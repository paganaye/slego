import { App } from "../controls/App";
import { IScreen } from "../core/IScreen";
import { PagedScreen } from "./PagedScreen";


export class UnknownScreen extends PagedScreen implements IScreen {
    constructor(app: App) {
    super(app, { layerType: "Screen" });
    this.addDiv({
      text: "The screen " + this.getTitle() + " does not exist."
    })
  }

  getTitle(): string {
    let hashCode = document.location.hash
    if (hashCode.startsWith("#")) hashCode = hashCode.substring(1);
    if (hashCode.indexOf("/") >= 0) hashCode = hashCode.split("/")[0];
    return hashCode;
  }

}

