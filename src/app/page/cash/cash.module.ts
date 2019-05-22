import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule, Router, Routes } from '@angular/router' ;
import {CashComponent} from './cash/cash.component' ;
import {SharedModule} from '../../shared/shared.module' ;
const routes: Routes = [
	{ path: 'cash', component: CashComponent, data: { title: '短信模板', titleI18n: '短信模板' } },
];

const component = [
	CashComponent
];

@NgModule({
	declarations: [
		...component,
	],
	imports: [
		NgZorroAntdModule,
		RouterModule.forChild(routes),
		SharedModule,
	],
	providers: [],
	bootstrap: [],
})
export class CashModule {
}
