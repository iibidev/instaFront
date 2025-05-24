import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatsComponent } from './chats/chats.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ExploreComponent } from './explore/explore.component';
import { ReelsComponent } from './reels/reels.component';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CameraComponent } from './camera/camera.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { BuscarComponent } from './buscar/buscar.component';
import { RoutingBtnComponent } from './routing-btn/routing-btn.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MsgmodalComponent } from './msgmodal/msgmodal.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { UserReelsComponent } from './user-reels/user-reels.component';
import { ReelComponent } from './reel/reel.component';
import { PostComponent } from './post/post.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatsComponent,
    HomeComponent,
    ProfileComponent,
    ExploreComponent,
    ReelsComponent,
    UploadPageComponent,
    NavBarComponent,
    CameraComponent,
    LoginComponent,
    SignupComponent,
    LoadingScreenComponent,
    BuscarComponent,
    RoutingBtnComponent,
    EditProfileComponent,
    MsgmodalComponent,
    UserPostsComponent,
    UserReelsComponent,
    ReelComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
