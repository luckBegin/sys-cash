import { NgModule } from '@angular/core' ;
import { CommonModule } from '@angular/common' ;
import {CountComponent} from './component/count/count.component' ;
import {RoomComponent} from './component/room/room.component' ;
import {ReserveComponent} from './component/reserve/reserve.component' ;
import {OutrightComponent} from "./component/cash/outright/outright.component";
import { AdvanceComponent } from './component/cash/advanve/advance.component' ;
import {TimePipe, StatusPipe, CusCurrencyPipe, DatePipe , FilterSymbolPipe } from "./pipe";
import {FormsModule} from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import {HttpIntercept} from "./interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TimePriceDetailComponent} from "./component/cash/timePriceDetail/timePriceDetail.component";
import {CheckoutRoomComponent} from "./component/casher/room/room.component";
import {PaymentMethodComponent} from "./component/paymentMethod/paymentMethod.component";
import {RoomOrderComponent} from "./component/order/room/roomOrder.component";
import {ResetComponent} from "./component/reset/reset.component";

const modules = [ CommonModule , FormsModule , NgZorroAntdModule ] ;
const components = [
	CountComponent ,
	RoomComponent ,
	ReserveComponent ,
	OutrightComponent ,
	AdvanceComponent ,
	TimePriceDetailComponent ,
	CheckoutRoomComponent ,
	PaymentMethodComponent ,
	RoomOrderComponent ,
	ResetComponent
] ;
const pipes = [ StatusPipe , TimePipe , CusCurrencyPipe , DatePipe , FilterSymbolPipe ] ;
@NgModule({
	declarations: [
		...components ,
		...pipes
	],
	imports: [
		...modules
	],
	exports: [ ...modules , ...components , ...pipes ] ,
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true }
	],
	bootstrap: [],
})
export class SharedModule {
}
