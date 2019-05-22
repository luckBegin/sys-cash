import { Component , Input } from '@angular/core' ;

@Component({
	selector : 'time-price-detail' ,
	templateUrl: './timePriceDetail.component.html' ,
	styleUrls: ['../outright/outright.component.less']
})
export class TimePriceDetailComponent {
	constructor(){} ;
	
	@Input() timePrice: any[] = [] ;
}