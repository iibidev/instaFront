import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatsComponent } from './chats/chats.component';
import { HomeComponent } from './home/home.component';
import { ExploreComponent } from './explore/explore.component';
import { ReelsComponent } from './reels/reels.component';
import { ProfileComponent } from './profile/profile.component';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { loginGuard } from './guard/login.guard';
import { BuscarComponent } from './buscar/buscar.component';
import { movilGuard } from './guard/movil.guard';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {path: "", component: HomeComponent, title: "Instagram - Inicio", canActivate: [AuthGuard]},
  {path: "chats", component: ChatsComponent, title: "Instagram - Chats", canActivate: [AuthGuard], children: [
    {path: ":id", component: ChatComponent}
  ]},
  {path: "explorar", component: ExploreComponent, title: "Instagram - explorar", canActivate: [AuthGuard], children: [
    {path: "buscar", component: BuscarComponent, canActivate: [movilGuard]}
  ]},
  {path: "crear/:tipo", component: UploadPageComponent, title: "Instagram - crear", canActivate: [AuthGuard]},
  {path: "reels", component: ReelsComponent, title: "Instagram - reels", canActivate: [AuthGuard]},
  {path: "perfil/:usuario", component: ProfileComponent, title: "Instagram - perfil", canActivate: [AuthGuard]},
  {path: "login", component: LoginComponent, title: "Instagram - iniciar sesión", canActivate: [loginGuard] },
  {path: "signup", component: SignupComponent, title: "Instagram - crear cuenta", canActivate: [loginGuard]},
  {path: "**", redirectTo: "login"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
