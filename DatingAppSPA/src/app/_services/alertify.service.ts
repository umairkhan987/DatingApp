import { Injectable } from "@angular/core";
import * as alterify from "alertifyjs";

@Injectable({
  providedIn: "root"
})
export class AlertifyService {
  constructor() {}

  confirm(message: string, okCallBack: () => any) {
    alterify.confirm(message, (e: any) => {
      if (e) {
        okCallBack();
      } else {
      }
    });
  }

  success(message: string) {
    alterify.success(message);
  }

  error(message: string) {
    alterify.error(message);
  }

  warning(message: string) {
    alterify.warning(message);
  }

  message(message: string) {
    alterify.message(message);
  }
}
