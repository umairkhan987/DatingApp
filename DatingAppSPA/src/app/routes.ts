import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { ListsComponent } from "./lists/lists.component";
import { MessagesComponent } from "./messages/messages.component";
import { AuthGuard } from "./_guards/auth.guard";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { MemberDetailResolver } from "./_resolvers/member-detail-resolver";
import { MemberListResolver } from "./_resolvers/member-list-resolver";

export const appRoutes: Routes = [
  { path: "home", component: HomeComponent },
  {
    path: "members",
    component: MemberListComponent,
    canActivate: [AuthGuard],
    resolve: { users: MemberListResolver }
  },
  {
    path: "members/:id",
    component: MemberDetailComponent,
    canActivate: [AuthGuard],
    resolve: { user: MemberDetailResolver }
  },
  { path: "messages", component: MessagesComponent, canActivate: [AuthGuard] },
  { path: "lists", component: ListsComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "home", pathMatch: "full" }
];
