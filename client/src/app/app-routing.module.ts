import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', loadComponent:()=>import('./layouts/blank-layout/blank-layout.component').then((m)=>m.BlankLayoutComponent),
  children:[
    {path: '',redirectTo:'matches',pathMatch:'full'},
    {path: 'matches',loadComponent:()=>import('./views/matches/matches.component').then((m)=>m.MatchesComponent)},
    {path: 'lists',loadComponent:()=>import('./views/lists/lists.component').then((m)=>m.ListsComponent)},
    {path: 'messages',loadComponent:()=>import('./views/messages/messages.component').then((m)=>m.MessagesComponent)},
    {path: 'errors',loadComponent:()=>import('./views/errors/errors.component').then((m)=>m.ErrorsComponent)},
  ]},
  {path: '', loadComponent:()=>import('./layouts/auth-layout/auth-layout.component').then((m)=>m.AuthLayoutComponent) , children:[
    {path: '',redirectTo:'home',pathMatch:'full'},
    {path:'home' , loadComponent:()=> import('./views/home/home.component').then((m)=>m.HomeComponent)},
    {path:'register' , loadComponent:()=> import('./views/register/register.component').then((m)=>m.RegisterComponent)},

  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
