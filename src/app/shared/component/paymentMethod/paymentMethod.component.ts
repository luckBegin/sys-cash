import {Component, Input, OnInit} from '@angular/core' ;
import {ENUM} from '../../../models';
import {MsgService} from '../../../service';

@Component({
	selector: 'payment-method',
	templateUrl: './paymentMethod.component.html',
	styleUrls: ['./paymentMethod.component.less']
})
export class PaymentMethodComponent implements OnInit {
	constructor(
		private readonly msg: MsgService
	) {
	}
	
	@Input() methods: ENUM[] = [];
	@Input() money: number = 0;
	private inputModel: object = {};
	private checked: number[] = [];
	private checkedMap: any = {};
	private checkedInput: any = {};
	private realGet: number = 0;
	private otherOptions = {};
	
	ngOnInit(): void {
	}
	
	init(): void {
		this.checked = [];
		this.realGet = 0 ;
		this.methods.forEach(item => {
			this.inputModel[item.value as string] = 0;
			this.checkedMap[item.value as string] = false;
			this.checkedInput[item.value as string] = false;
			this.otherOptions[item.key] = [];
		});
	}
	
	private checkChange($event: boolean, item: ENUM): void {
		if ($event) {
			this.checked.push(item.value as number);
			this.checkedMap[item.value as string] = true;
		} else {
			const idx = this.checked.indexOf(item.value as number);
			this.checked.splice(idx, 1);
			this.checkedMap[item.value as string] = false;
			this.inputModel[item.value as string] = 0;
			this.checkedInput[item.value as string] = false;
		}
		
		if (this.checked.length > 0) {
			let hasCheckedMoney = this.money;
			let checkMethod = this.checked.length;
			this.checked.forEach(( numItem: number) => {
				const money = Math.ceil(hasCheckedMoney / checkMethod);
				this.inputModel[numItem] = money;
				hasCheckedMoney -= money;
				checkMethod -= 1;
			});
		}
	}
	
	private inputChange($event: string): void {
		this.checkedInput[$event] = false;
	}
	
	private inputEnter($event: string, value: string): void {
		if (/\d+(.\d+)?/g.test(value)) {
			const money = Number(value);
			let all = 0;
			
			Object.keys(this.checkedInput).forEach(key => {
				if (this.checkedInput[key]) {
					all += Number(this.inputModel[key]);
				}
			});
			
			this.checkedInput[$event] = true;
			if (all + money > this.money) {
				this.msg.warn('输入的金额总和超过应付金额');
				return;
			}
			
			let rest = this.money - all - Number(value);
			let len = 0;
			
			this.checked.forEach(item => {
				if (!this.checkedInput[item]) {
					len += 1;
				}
			});
			
			this.checked.forEach(item => {
				if (!this.checkedInput[item]) {
					const itemMoney = Math.ceil(rest / len);
					this.inputModel[item] = itemMoney;
					len -= 1;
					rest -= itemMoney;
				}
			});
		}
	}
	
	getMoneyMethod(): any {
		const data = {};
		Object.keys(this.inputModel).forEach(item => {
			if (this.inputModel[item]) {
				data[item] = this.inputModel[item];
			}
		});
		return data;
	}
}
