import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AuthService } from "./../_services/auth.service";
import { AlertifyService } from "./../_services/alertify.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(
    private authServices: AuthService,
    private alterify: AlertifyService
  ) {}

  ngOnInit() {}

  register() {
    this.authServices.register(this.model).subscribe(
      next => {
        this.alterify.success("Successfully register");
      },
      error => {
        this.alterify.error(error);
      }
    );
  }

  cancel() {
    this.cancelRegister.emit(false);
    //console.log("cancel fun");
  }
}
