import {Component, Input, OnInit} from '@angular/core' ;
import {CalcService, MsgService, UtilsService} from '../../../../service';
import {RESPONSE} from '../../../../models';
import {DateUtils} from '../../../utils';

@Component({
	selector: 'cash-advance',
	templateUrl: './advance.component.html',
	styleUrls: ['./advance.component.less', '../outright/outright.component.less']
})
export class AdvanceComponent implements OnInit {
	constructor(
		private readonly utilSer: UtilsService,
		private readonly msg: MsgService,
		private readonly calcSer: CalcService,
	) {
	} ;
	
	ngOnInit(): void {
		this.getCurrentDate();
	}
	
	currentDate: { date: string, timeStamp: number } = {date: null, timeStamp: null};
	money: { shouldPay: number, vipShouldPay: number } = {shouldPay: 0, vipShouldPay: 0};
	inputTime: { h: number, m: number } = {h: 0, m: 0};
	endTime: string = null;
	@Input() typeId: number;
	
	getCurrentDate(): void {
		this.utilSer.getCurrentDate()
		.subscribe((res: RESPONSE) => {
			if (res.success) {
				this.currentDate = res.data;
			}
			this.endTime = res.data.date;
		}, err => {
			this.msg.error('获取服务器时间失败 , ' + err);
		});
	}
	
	inputKeyDown($event: any, type: string): void {
		if ($event.key === 'Enter') {
			this.getPriceByTime();
		}
	}
	
	valueChange(type: string): void {
		if (type === 'h' || type === 'm') {
			if (this.inputTime.m >= 60) {
				this.inputTime.h = Number(this.inputTime.h) + Math.floor(this.inputTime.m / 60);
				this.inputTime.m = Number(this.inputTime.m) % 60;
			}
			const date = this.currentDate.timeStamp + DateUtils.timeStampAdd(0, this.inputTime.h, this.inputTime.m);
			this.endTime = DateUtils.format(date);
		}
		
		if (type === 'date') {
			const endTime = DateUtils.format(DateUtils.toTimeStamp(this.endTime));
			const diff = DateUtils.dateDiff(this.currentDate.date, endTime);
			this.inputTime.h = diff.d * 60 + diff.h;
			this.inputTime.m = diff.m;
		}
		
		this.initPrice();
	}
	
	timePrice: any[] = [];
	
	getPriceByTime(): void {
		this.initPrice();
		const startTime = DateUtils.format(this.currentDate.date, 'HI');
		const endTime = DateUtils.format(this.endTime, 'HI');
		this.calcSer.timePrice({typeId: this.typeId, startTime, endTime, type: 'advance'})
		.subscribe((res: RESPONSE) => {
			if (res.success) {
				this.timePrice = res.data.prices;
				this.calc();
			} else {
				this.msg.error('计算价格失败 , ' + res.message);
			}
		}, err => {
			this.msg.error('计算价格失败 , ' + err);
		});
	}
	
	calc() {
		this.timePrice.forEach(item => {
			this.money.shouldPay += item.timePrice;
			this.money.vipShouldPay += item.vipTimePrice;
		});
	}
	
	initPrice(): void {
		this.timePrice = [];
		this.money = {
			shouldPay: 0,
			vipShouldPay: 0
		};
		this.calc();
	}
	
	init( typeId: number ): void {
		this.inputTime = {
			h: 0,
			m: 0
		};
		this.typeId = typeId
		this.initPrice();
		this.getCurrentDate();
	}
	
	getPrice(): any {
		return this.money;
	}
	
	getTime(): any {
		return {
			joinTime: this.currentDate.date,
			leaveTime: this.endTime
		}
	}
}
