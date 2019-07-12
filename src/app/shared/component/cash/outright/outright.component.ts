import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core' ;
import {MsgService, CalcService} from '../../../../service';
import {RESPONSE} from '../../../../models';

@Component({
	selector: 'cash-outright',
	templateUrl: './outright.component.html',
	styleUrls: ['./outright.component.less']
})
export class OutrightComponent implements OnInit {
	constructor(
		private readonly msg: MsgService,
		private readonly service: CalcService
	) {
	} ;
	
	selectOutright: any = {};
	withTimePrice: boolean = false;
	@Input() outrightArr: any[];
	@Input() typeId: number;
	@Output() priceSure: EventEmitter<any> = new EventEmitter();
	
	money: any = {
		shouldPay: 0,
		vipShouldPay: 0
	};
	timePrice: any[] = [];
	time: { startTime: string, endTime: string };
	
	ngOnInit(): void {
		this.selectOutright = this.outrightArr[0];
		this.calc();
	}
	
	outrightChange($event: any): void {
		this.selectOutright = $event;
		this.getTimePrice();
	}
	
	calc() {
		this.money.shouldPay = this.selectOutright.price.outrightPrice;
		this.money.vipShouldPay = this.selectOutright.price.vipOutrightPrice;
		this.timePrice.forEach(item => {
			this.money.shouldPay += item.timePrice;
			this.money.vipShouldPay += item.vipTimePrice;
		});
	}
	
	private getTimePrice(): void {
		this.timePrice = [];
		if (this.withTimePrice) {
			this.service.timePrice({endTime: this.selectOutright.startTime, typeId: this.typeId, type: 'time'})
			.subscribe((res: RESPONSE) => {
				if (res.success) {
					this.timePrice = res.data.prices;
					this.time = res.data.time;
					this.calc();
				} else {
					this.msg.error('获取数据失败 , ' + res.message);
				}
			}, err => {
				this.msg.error('计算金额失败 ,' + err);
			});
		} else {
			this.calc();
		}
	}
	
	init(): void {
		this.selectOutright = this.outrightArr[0];
		this.timePrice = [];
		this.money = {
			shouldPay: 0,
			vipShouldPay: 0
		};
		this.time = null;
		this.calc();
	}
	
	getPrice(): any {
		return this.money;
	}
	
	getTime(): any {
		return this.time;
	}
	
	getWithTimePrice(): boolean {
		return this.withTimePrice;
	}
	
	getSelectOutright(): any {
		return this.selectOutright;
	}
}
