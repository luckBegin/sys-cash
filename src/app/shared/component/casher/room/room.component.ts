import {Component, Input, OnInit, ViewChild} from '@angular/core' ;
import {ENUM, RESPONSE} from "../../../../models";
import {CalcService, MsgService, PaymentService} from "../../../../service";
import {AdaptorUtils, DateUtils} from "../../../utils";
import {PaymentMethodComponent} from "../../paymentMethod/paymentMethod.component";
import {Strategy} from "../../../../../decorators";

@Component({
	selector: 'checkout-room' ,
	styleUrls: ['./room.component.less'] ,
	templateUrl: './room.component.html'
})
export class CheckoutRoomComponent implements OnInit{
	constructor(
		private readonly msg: MsgService ,
		private readonly service: CalcService ,
		private readonly paymentSer: PaymentService
	){} ;
	
	type: number ;
	time: any ;
	withTimePrice: boolean ;
	selectItem: any ;
	remark: string ;
	vipId: number = 5 ;
	
	@ViewChild('paymentMethodComponent')
	paymentMethodComponent: PaymentMethodComponent;
	
	private money: { allMoney: number  , shouldMoney:number } = {
		allMoney: 0 ,
		shouldMoney: 0
	};
	
	ngOnInit(): void {
		this.getPaymentMethod() ;
	};
	
	private timePrice: any[] = [] ;
	
	makeCalc( type ?: number , withTimePrice?:boolean, selectItem?: any  ): void{
		this.type = type ;
		this.withTimePrice = withTimePrice ;
		this.selectItem = selectItem ;
		this.calc() ;
	}
	
	
	@Strategy({
		0: function(){ (this as CheckoutRoomComponent).calcWithTime() } ,
		1: function(){ (this as CheckoutRoomComponent).calcWithOutright() } ,
		2: function(){ (this as CheckoutRoomComponent).calcWithAdvance() } ,
	})
	private calc(): number{ return this.type ; }
	
	init(): void{
		this.type = null ;
		this. time = null ;
		this.withTimePrice = null ;
		this.selectItem = null ;
		this.money = {
			allMoney: 0 ,
			shouldMoney: 0
		};
		this.remark = '' ;
	}
	
	initPaymentMethod(): void{
		this.paymentMethodComponent.init() ;
	}
	
	private calcWithOutright(): void{
		this.service.outrightPrice( {
			endTime: this.selectItem.startTime ,
			priceId: this.selectItem.price.id ,
			vipId: this.vipId ,
			withTimePrice: this.withTimePrice ,
			typeId: this.selectItem.price.roomTypeId
		})
			.subscribe( ( res: RESPONSE ) =>{
					this.timePrice = res.data.timePrice.prices ;
					this.time = res.data.time ;
					this.calcMoney( res.data.outrightPrice ) ;
			}) ;
	}
	
	private calcWithAdvance(): void{
		this.service.timePrice({
			shopId: this.selectItem.shopId ,
			typeId: this.selectItem.typeId ,
			startTime: DateUtils.format(this.selectItem.startTime , 'hi') ,
			endTime: DateUtils.format(this.selectItem.endTime , 'hi') ,
			type: 'advance',
			vipId: this.vipId
		})
			.subscribe( (res: RESPONSE ) => {
				this.timePrice = res.data.prices ;
				this.time = res.data.time ;
				this.calcMoney() ;
			})
	}
	
	private calcWithTime(): void{
		this.service.timePrice({
			shopId: this.selectItem.shopId ,
			typeId: this.selectItem.typeId ,
			startTime: DateUtils.format(this.selectItem.orderInfo.joinTime , 'hi') ,
			type: 'time',
			vipId: this.vipId
		})
			.subscribe( (res: RESPONSE ) => {
				this.timePrice = res.data.prices ;
				this.time = res.data.time ;
				this.calcMoney() ;
			})
	}
	// private getTimePrice(): void{
	// 	this.timePrice = [] ;
	// 	if( this.withTimePrice ) {
	// 		this.service.timePrice( { endTime: this.selectItem.startTime , typeId: this.selectItem.id , type: 'time' } )
	// 			.subscribe( ( res: RESPONSE ) => {
	// 				if( res.success ) {
	// 					this.timePrice = res.data.prices ;
	// 					this.time = res.data.time ;
	// 					this.calcMoney() ;
	// 				} else {
	// 					this.msg.error("获取数据失败 , " + res.message ) ;
	// 				}
	// 			} , err => {
	// 				this.msg.error("计算金额失败 ,"  +  err ) ;
	// 			});
	// 	} else {
	// 		this.calcMoney() ;
	// 	}
	// }
	
	private calcMoney( priceInfo?: any ): void{
		this.money.allMoney = 0 ;
		this.money.shouldMoney = 0 ;
		
		if( this.type === 1 ) {
			this.money.allMoney = priceInfo.money ;
			this.money.shouldMoney =  !!this.vipId ? priceInfo.vipMoney :  priceInfo.money ;
		}
		
		this.timePrice.forEach( item => {
			this.money.allMoney += item.timePrice ;
			this.money.shouldMoney += !!this.vipId  ? item.vipTimePrice : item.item.vipTimePrice ;
		});
	}
	
	private methods: ENUM[] = [] ;
	
	private getPaymentMethod():void{
		this.paymentSer.getMethod( { isCheckout: 1 })
			.subscribe( (res: RESPONSE ) => {
				if( res.success ) {
					this.methods = AdaptorUtils.reflect( res.data , { id: 'value' , name: 'key'}) ;
				}
			})
	}
	
	getMethodPayment(): any{
		return {
			methods: this.paymentMethodComponent.getMoneyMethod() ,
			remark: this.remark ,
			money: this.money ,
			selectItem: this.selectItem ,
			vipId: this.vipId ,
			time: this.time,
			timePrice: this.timePrice
		}
	}
}
