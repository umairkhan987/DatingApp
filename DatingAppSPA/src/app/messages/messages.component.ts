import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Message } from "../_models/message";
import { Pagination, PaginatedResult } from "../_models/Pagination";
import { UserService } from "src/app/_services/user.service";
import { AuthService } from "./../_services/auth.service";
import { AlertifyService } from "./../_services/alertify.service";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"]
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = "Unread";

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data["messages"].result;
      this.pagination = data["messages"].pagination;
    });
  }

  loadMessages() {
    this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  deleteMessage(id: number) {
    this.alertify.confirm(
      "Are you suren you want to delete this message",
      () => {
        this.userService
          .deleteMessage(id, this.authService.decodedToken.nameid)
          .subscribe(
            () => {
              this.messages.splice(
                this.messages.findIndex(m => m.id === id),
                1
              );
              this.alertify.success("Message has been deleted.");
            },
            error => {
              this.alertify.error("Failed to delete the message.");
            }
          );
      }
    );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
