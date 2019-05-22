import {Component, Input, OnInit} from '@angular/core' ;
import {ngIfAnimation} from "../../../../router/router-animation";
import {RoomService} from "../../../../service";
import {RESPONSE} from "../../../../models";

@Component({
	selector: 'room-order' ,
	templateUrl: './roomOrder.component.html' ,
	styleUrls: ['./roomOrder.component.less'] ,
	animations: [ngIfAnimation]
})
export class RoomOrderComponent implements OnInit {
	constructor(
		private orderSer: RoomService
	){} ;
	
	ngOnInit(): void {};
	
	private _roomInfo: any ;
	
	get roomInfo(): any{
		return this._roomInfo ;
	}
	
	@Input()
	set roomInfo( val: any ) {
		this._roomInfo = val ;
		this.getOrderInfo() ;
	}
	
	private orderList: any[];
	private orderItemList: any = {} ;
	private selectOrderId: number = null ;
	
	private getOrderInfo(): void{
		if( this._roomInfo ) {
			this.orderSer.roomTodayOrderList( { roomId: this.roomInfo.id })
				.subscribe( ( res: RESPONSE ) => {
					this.orderList = res.data ;
					if( res.data.length > 0 )
						this.orderItem( res.data[0].id);
					else
						this.orderItemList = [] ;
				});
		}
	}
	
	orderItem( orderId: number ): void{
		this.selectOrderId = orderId ;
		this.orderSer.roomOrderItemList( { orderId })
			.subscribe( ( res: RESPONSE ) => {
				this.orderItemList = res.data ;
			});
	}
}
