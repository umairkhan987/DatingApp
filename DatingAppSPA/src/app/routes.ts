import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { ListsComponent } from "./lists/lists.component";
import { MessagesComponent } from "./messages/messages.component";
import { AuthGuard } from "./_guards/auth.guard";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { MemberDetailResolver } from "./_resolvers/member-detail-resolver";
import { MemberListResolver } from "./_resolvers/member-list-resolver";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { MemberEditResolver } from "./_resolvers/member-edit-resolver";
import { PreventUnsavedChanges } from "./_guards/prevent.unsaved.changes.guard";
import { ListsResolver } from "./_resolvers/lists.resolver";

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
  {
    path: "member/edit",
    component: MemberEditComponent,
    canActivate: [AuthGuard],
    resolve: { user: MemberEditResolver },
    canDeactivate: [PreventUnsavedChanges]
  },
  { path: "messages", component: MessagesComponent, canActivate: [AuthGuard] },
  {
    path: "lists",
    component: ListsComponent,
    canActivate: [AuthGuard],
    resolve: { users: ListsResolver }
  },
  { path: "**", redirectTo: "home", pathMatch: "full" }
];
