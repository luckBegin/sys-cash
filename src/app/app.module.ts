import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './router/app-routing.module';
import {AppComponent} from './app.component';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {LayoutComponent} from './default/layout/layout.component';
import {LoginComponent} from './default/login/login.component';
import { QRCodeModule } from 'angularx-qrcode';
import {PreloginComponent} from './default/prelogin/prelogin.component'
import {SharedModule} from "./shared/shared.module";
registerLocaleData(zh);

@NgModule({
	declarations: [
		AppComponent,
		LayoutComponent,
		LoginComponent,
		PreloginComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgZorroAntdModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		ReactiveFormsModule ,
		QRCodeModule,
		SharedModule
	],
	providers: [{provide: NZ_I18N, useValue: zh_CN}],
	bootstrap: [AppComponent]
})
export class AppModule {
}
