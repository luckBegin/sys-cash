import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../default/layout/layout.component';
import {LoginComponent} from '../default/login/login.component';
import {PreloginComponent} from '../default/prelogin/prelogin.component' ;
import {RouteguardService} from './route-guard' ;
const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: 'operate' ,
				loadChildren : '../page/cash/cash.module#CashModule'
			}
		],
		canActivate: [RouteguardService]
	} , {
		path: 'login',
		component: LoginComponent,
		data: {
			title: '登录'
		}
	} , {
		path: 'prelogin' ,
		component: PreloginComponent ,
		data: {
			title: '选择'
		},
		canActivate: [RouteguardService]
	},
	{ path: '**', redirectTo: 'cash' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class RouteRoutingModule {
}
