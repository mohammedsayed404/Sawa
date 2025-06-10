import { preventUnsavedChangesGuard } from './core/guards/prevent-unsaved-changes.guard';
import { authGuard } from './core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { memberDetailsResolver } from './core/resolvers/member-details.resolver';

const routes: Routes = [
  {path: '',canActivate:[authGuard] ,loadComponent:()=>import('./layouts/blank-layout/blank-layout.component').then((m)=>m.BlankLayoutComponent),
  children:[
    {path: '',redirectTo:'members',pathMatch:'full'},
    {path: 'matches',loadComponent:()=>import('./views/matches/matches.component').then((m)=>m.MatchesComponent)},
    {path: 'members',loadComponent:()=>import('./views/members/member-list/member-list.component').then((m)=>m.MemberListComponent)},
    // {path: 'members/:id',loadComponent:()=>import('./views/members/member-details/member-details.component').then((m)=>m.MemberDetailsComponent)},
    {path: 'members/:username',loadComponent:()=>import('./views/members/member-details/member-details.component').then((m)=>m.MemberDetailsComponent)
      ,resolve:{member:memberDetailsResolver}},
    {path: 'member/edit',canDeactivate:[preventUnsavedChangesGuard],loadComponent:()=>import('./views/members/member-edit/member-edit.component').then((m)=>m.MemberEditComponent)},
    {path: 'lists',loadComponent:()=>import('./views/lists/lists.component').then((m)=>m.ListsComponent)},
    {path: 'messages',loadComponent:()=>import('./views/messages/messages.component').then((m)=>m.MessagesComponent)},
    {path: 'errors',loadComponent:()=>import('./views/errors/errors.component').then((m)=>m.ErrorsComponent)},
    {path: 'server-error',loadComponent:()=>import('./views/errors/server-error/server-error.component').then((m)=>m.ServerErrorComponent)},
    {path:"notfound" , loadComponent:()=>import('./views/not-found/not-found.component').then((m) => m.NotFoundComponent)}

  ]},
  {path: '', loadComponent:()=>import('./layouts/auth-layout/auth-layout.component').then((m)=>m.AuthLayoutComponent) , children:[
    {path: '',redirectTo:'home',pathMatch:'full'},
    {path:'home' , loadComponent:()=> import('./views/home/home.component').then((m)=>m.HomeComponent)},
    {path:'register' , loadComponent:()=> import('./views/register/register.component').then((m)=>m.RegisterComponent)},
    {path:"notfound" , loadComponent:()=>import('./views/not-found/not-found.component').then((m) => m.NotFoundComponent)}

  ]},

   {path:"**" , loadComponent:()=>import('./views/not-found/not-found.component').then((m) => m.NotFoundComponent)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
