import {Component, Input, OnInit, ViewChild} from '@angular/core' ;
import {ENUM, RESPONSE} from '../../../../models';
import {CalcService, MsgService, PaymentService} from '../../../../service';
import {AdaptorUtils, DateUtils} from '../../../utils';
import {PaymentMethodComponent} from '../../paymentMethod/paymentMethod.component';
import {Strategy} from '../../../../../decorators';
import {WebsocketService, WsEvent} from '../../../../service/websocket/websocket.service';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
	selector: 'checkout-room',
	styleUrls: ['./room.component.less'],
	templateUrl: './room.component.html'
})
export class CheckoutRoomComponent implements OnInit {
	constructor(
		private readonly msg: MsgService,
		private readonly service: CalcService,
		private readonly paymentSer: PaymentService ,
		private readonly WsSocketSer: WebsocketService
	) {
	}
	
	type: number;
	
	time: any;
	
	withTimePrice: boolean;
	
	selectItem: any;
	
	remark: string;
	
	vipId: number = null;
	
	userInfo: { vipInfo?: any, typeInfo?: any } = {};
	
	entityCard: string = '' ;
	
	@ViewChild('paymentMethodComponent')
	paymentMethodComponent: PaymentMethodComponent;
	
	private WsSocket!: Subscription ;
	
	private money: { allMoney: number, shouldMoney: number } = {
		allMoney: 0,
		shouldMoney: 0
	};
	ngOnInit(): void {
		this.getPaymentMethod();
	}
	
	private timePrice: any[] = [];
	
	makeCalc(type ?: number, withTimePrice?: boolean, selectItem?: any): void {
		this.type = type;
		this.withTimePrice = withTimePrice;
		this.selectItem = selectItem;
		
		this.WsSocket = this.WsSocketSer.WSEvent$.pipe(
			filter( (event: WsEvent ) => event.event === 'vip' || event.event === 'entityCard') ,
		)
		.subscribe( ( event: WsEvent ) => {
			if ( event.event === 'vip') {
				this.vipId = event.data.vipId ;
				this.entityCard = null ;
			}
			
			if ( event.event === 'entityCard' ) {
				this.entityCard = event.data.entityCardNumber ;
				this.vipId = null;
			}
			
			this.calc() ;
		});
		
		this.calc();
	}
	
	@Strategy({
		0() {
			(this as CheckoutRoomComponent).calcWithTime();
		},
		1() {
			(this as CheckoutRoomComponent).calcWithOutright();
		},
		2() {
			(this as CheckoutRoomComponent).calcWithAdvance();
		},
	})
	private calc(): number {
		return this.type;
	}
	
	init(): void {
		this.type = null;
		this.time = null;
		this.withTimePrice = null;
		this.selectItem = null;
		this.money = {
			allMoney: 0,
			shouldMoney: 0
		};
		this.remark = '';
	}
	
	initPaymentMethod(): void {
		this.paymentMethodComponent.init();
	}
	
	private calcWithOutright(): void {
		this.service.outrightPrice({
			endTime: this.selectItem.startTime,
			priceId: this.selectItem.price.id,
			vipId: this.vipId,
			withTimePrice: this.withTimePrice,
			typeId: this.selectItem.price.roomTypeId ,
			entityCard:  this.entityCard
		})
		.subscribe((res: RESPONSE) => {
			this.timePrice = res.data.timePrice.prices;
			this.time = res.data.time;
			this.userInfo.typeInfo = res.data.typeInfo;
			this.userInfo.vipInfo = res.data.vipInfo;
			this.calcMoney(res.data.outrightPrice);
		});
	}
	
	private calcWithAdvance(): void {
		this.service.timePrice({
			shopId: this.selectItem.shopId,
			typeId: this.selectItem.typeId,
			startTime: DateUtils.format(this.selectItem.startTime, 'hi'),
			endTime: DateUtils.format(this.selectItem.endTime, 'hi'),
			type: 'advance',
			vipId: this.vipId
		})
		.subscribe((res: RESPONSE) => {
			this.timePrice = res.data.prices;
			this.time = res.data.time;
			this.userInfo.typeInfo = res.data.typeInfo;
			this.userInfo.vipInfo = res.data.vipInfo;
			this.calcMoney();
		});
	}
	
	private calcWithTime(): void {
		this.service.timePrice({
			shopId: this.selectItem.shopId,
			typeId: this.selectItem.typeId,
			startTime: DateUtils.format(this.selectItem.orderInfo.joinTime, 'hi'),
			type: 'time',
			vipId: this.vipId ,
		})
		.subscribe((res: RESPONSE) => {
			this.timePrice = res.data.prices;
			this.time = res.data.time;
			this.userInfo.typeInfo = res.data.typeInfo;
			this.userInfo.vipInfo = res.data.vipInfo;
			this.calcMoney();
		});
	}
	
	private calcMoney(priceInfo?: any): void {
		this.money.allMoney = 0;
		this.money.shouldMoney = 0;
		
		if (this.type === 1) {
			this.money.allMoney = priceInfo.money;
			this.money.shouldMoney = !!this.vipId ? priceInfo.vipMoney : priceInfo.money;
			this.selectItem.price.vipPrice =  priceInfo.vipMoney ;
		}
		
		if (this.withTimePrice) {
			this.timePrice.forEach(item => {
				this.money.allMoney += item.timePrice;
				this.money.shouldMoney += !!this.vipId ? item.vipTimePrice : item.timePrice;
			});
		}
	}
	private methods: ENUM[] = [];
	private getPaymentMethod(): void {
		this.paymentSer.getMethod({isCheckout: 1})
		.subscribe((res: RESPONSE) => {
			if (res.success) {
				this.methods = AdaptorUtils.reflect(res.data, {id: 'value', name: 'key'});
			}
		});
	}
	
	public getMethodPayment(): any {
		return {
			methods: this.paymentMethodComponent.getMoneyMethod(),
			remark: this.remark,
			money: this.money,
			selectItem: this.selectItem,
			vipId: this.vipId,
			time: this.time,
			timePrice: this.timePrice
		};
	}
	public cancel(): void {
		this.vipId = null ;
		this.WsSocket.unsubscribe() ;
	}
}
