import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteRoutingModule } from './router.module' ;
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes) , RouteRoutingModule ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
