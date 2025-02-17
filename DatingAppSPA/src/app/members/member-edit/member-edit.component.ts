import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "./../../_models/user";
import { ActivatedRoute } from "@angular/router";
import { AlertifyService } from "src/app/_services/alertify.service";
import { NgForm } from "@angular/forms";
import { UserService } from "src/app/_services/user.service";
import { AuthService } from "./../../_services/auth.service";

@Component({
  selector: "app-member-edit",
  templateUrl: "./member-edit.component.html",
  styleUrls: ["./member-edit.component.css"]
})
export class MemberEditComponent implements OnInit {
  @ViewChild("editForm", { static: true }) editForm: NgForm;
  user: User;
  photoUrl: string;

  constructor(
    private route: ActivatedRoute,
    private alterify: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data["user"];
    });
    this.authService.currentPhototUrl.subscribe(photoUrl => {
      this.photoUrl = photoUrl;
    });
  }

  updateUser() {
    this.userService
      .updateUser(this.authService.decodedToken.nameid, this.user)
      .subscribe(
        next => {
          this.alterify.success("profile updated successfully.");
          this.editForm.reset(this.user);
        },
        error => {
          this.alterify.error(error);
        }
      );
  }

  updateMainPhoto(url) {
    this.user.photoUrl = url;
  }
}
