import {Component, OnDestroy, OnInit} from '@angular/core';
import {MsgService, RoomService, SesssionStorageService} from '../../../service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {VipService} from '../../../service/vip/vip.service';
import {ENUM, RESPONSE} from '../../../models';
import {filter, map} from 'rxjs/operators';
import {AdaptorUtils, DateUtils} from '../../utils';
import {Observable, Subscription} from 'rxjs';
import {Strategy} from '../../../../decorators';
import {WebsocketService , WsEvent} from '../../../service/websocket/websocket.service';

@Component({
	selector: 'common-vip-info',
	templateUrl: './vipInfo.component.html',
	styleUrls: ['./vipInfo.component.less'] ,
})
export class VipInfoComponent {
	constructor(
		private readonly msg: MsgService,
		private readonly ss: SesssionStorageService,
		private readonly fb: FormBuilder,
		private readonly service: VipService ,
		private readonly roomSer: RoomService ,
		private readonly WsSocketSer: WebsocketService
	) {
	}
	
	public form: FormGroup = this.fb.group({
		vipTypeId: [null, [Validators.required]],
		integral: [0],
		balance: [0],
		balanceForRoom: [0],
		balanceForMarket: [0],
		password: [null],
		joinTime: [null],
		birthDay: [null , birthDayValidation ],
		cardNumber: [null],
		entityCardNumber: [null],
		status: [ null ],
		tel: [ null , [ Validators.required ]],
		sex: [ null , [ Validators.required ]],
		name: [ null , [Validators.required ]],
		id: [ null ],
		remark: [ null ] ,
		reason: [ null ]
	});
	
	public tabIndex: number = 0 ;
	
	public selectUserModal: boolean = false ;
	
	public selectUsers: any[] = []  ;
	
	private WSEvent$!: Subscription ;
	
	public init(): void {
		if ( !this.ENUM_VipTypes ) {
			this.getType() ;
		}
		this.form.reset() ;
		this.userInfo = {} ;
		this.form.patchValue({ status: 0 }) ;
		this.recordData = { consume: [] , deposit: [] , integral: [] } ;
		this.orderSelect = {} ;
		this.orderDetailList =  [] ;
		
		this.WSEvent$ = this.WsSocketSer.WSEvent$
			.pipe(
				filter( ( event: WsEvent) => event.event === 'vip' || event.event === 'entityCard') ,
			)
			.subscribe( (res: WsEvent) => {
				const data = res.data ;
				if ( res.event === 'vip' && this.form.value.id !== data.vipId ) {
					this.form.patchValue({ id: data.vipId }) ;
					this.query('id') ;
				}
				
				if ( res.event === 'entityCard' && this.bindCardForm.value.entityCardNumber !== data.entityCardNumber.toString() ) {
					if ( this.bindCardModal === true ) {
						this.bindCardForm.patchValue(({entityCardNumber: data.entityCardNumber })) ;
						this.entityCardQuery();
					}  else {
						this.form.patchValue({ entityCardNumber: data.entityCardNumber }) ;
						this.query('entityCardNumber') ;
					}
					
				}
			});
	}
	
	public vipQueryList!: any[] ;
	
	public userInfo: any = {} ;
	
	private query(type: string): void {
		
		this.recordData = { consume: [] , deposit: [] , integral: [] } ;
		
		this.orderSelect = {} ;
		
		this.orderDetailList =  [] ;
		
		this.userInfo = {} ;
		
		const para = {};
		
		if ( !this.form.value[type] ) {
			this.msg.warn('请输入需要查询的内容') ;
			return ;
		}
		
		para[type] = this.form.value[type];
		
		this.service.vipInfo(para)
			.pipe(map((res: RESPONSE) => res.data))
			.subscribe((data: any[]) => {
				if (data.length === 0) {
					this.msg.warn('所查询的用户不存在');
					this.form.reset() ;
					this.form.patchValue({ status: 0 }) ;
					return ;
				}
				
				if ( data.length === 1 ) {
					this.msg.success('查询成功') ;
					// data[0].sex = data[0].sex.toString() ;
					// data[0].vipTypeId = data[0].vipTypeId.toString() ;
					this.setUserInfo( data[0] ) ;
					return ;
				}
				
				if ( data.length > 1 ) {
					this.selectUserModal = true ;
					this.selectUsers = data ;
				}
			});
	}
	public ENUM_VipTypes!: ENUM[] ;
	
	private getType(): void {
		this.service.vipType()
			.pipe( map( (res: RESPONSE ) => res.data))
			.subscribe( ( data: any[] ) => {
				this.ENUM_VipTypes = AdaptorUtils.reflect( data , { id: 'value' , name: 'key'}) ;
			});
	}
	
	private reset(): void {
		this.form.reset() ;
		this.form.patchValue({
			status: 0 ,
		}) ;
		this.userInfo = {} ;
		this.recordData = { consume: [] , deposit: [] , integral: [] } ;
		this.orderSelect = {} ;
		this.orderDetailList =  [] ;
	}
	
	private create($event: MouseEvent): void {
		if ( !this.form.valid ) {
			this.msg.warn('请填写必填信息') ;
			return ;
		}
		const el = $event.currentTarget as HTMLButtonElement ;
		el.disabled = true ;
		this.form.patchValue({
			integral: 0 ,
			balance : 0 ,
			balanceForRoom: 0 ,
			balanceForMarket : 0 ,
			joinTime: DateUtils.getNow( false , 'y-m-d h:i:s')
		});
		const value = this.form.value ;
		this.service.create( value )
			.subscribe( ( res: RESPONSE ) => {
				if ( res.success ) {
					this.msg.success('新建成功') ;
					this.form.patchValue( res.data ) ;
					this.userInfo = this.form.value ;
				} else {
					this.msg.error('新建失败,原因:' + res.message ) ;
				}
				el.disabled = false ;
			});
	}
	
	public update($event: MouseEvent): void {
		if ( !this.form.valid ) {
			this.msg.warn('请填写必填信息') ;
			return ;
		}
		
		const el = $event.currentTarget as HTMLButtonElement ;
		
		el.disabled = true ;
		
		const value = this.form.value ;
		
		value.joinTime = DateUtils.format(value.joinTime , 'y-m-d h:i:s') ;
		
		this.service.update( value )
		.subscribe( ( res: RESPONSE ) => {
			if ( res.success ) {
				this.msg.success('更新成功') ;
			} else {
				this.msg.error('新建失败,原因:' + res.message ) ;
			}
			el.disabled = false ;
		});
	}
	
	public freezeOrRecover($event: MouseEvent , type: string): void {
		let serviceEvent$!: ( pata?: any) => Observable< RESPONSE >;
		const value  = this.form.value ;
		if ( !value.reason ) {
			this.msg.warn('请输入状态原因') ;
			return ;
		}
		
		if ( type  === 'recover') {
			serviceEvent$ = this.service.recover ;
		}
		
		if ( type === 'freeze' ) {
			serviceEvent$ = this.service.freeze ;
		}
		
		serviceEvent$.call( this.service, { id: value.id  , reason: value.reason } )
			.subscribe( ( res: RESPONSE ) => {
				if ( res.success ) {
					this.msg.success('操作成功') ;
					this.query('id') ;
				} else {
					this.msg.error('操作失败,原因:' + res.message ) ;
				}
			});
	}
	public selectUser(item: any): void {
		this.setUserInfo( item ) ;
		this.selectUserModal = false ;
	}
	
	private setUserInfo( item: any ): void {
		this.form.patchValue( item ) ;
		this.userInfo = item ;
		this.tabChange() ;
	}
	
	recordData = { consume: [] , deposit: [] , integral: [] } ;
	
	@Strategy({
		0($event: MouseEvent) {
			const _this = (this as VipInfoComponent) ;
			const vipId = _this.form.value.id ;
			_this.roomSer.getAllVipOrders({vipId})
				.subscribe( ( res: RESPONSE ) => {
					if ( res.data.length > 0 ) {
						_this.recordData.consume = res.data ;
						_this.orderSelect = res.data[0] ;
						_this.orderDetail() ;
					}
				});
		},
	})
	public tabChange( ): number {
		return this.tabIndex ;
	}
	
	 public orderSelect: any = {} ;
	
	 public orderDetailList: any[] = [] ;
	
	 public orderDetail(): void {
		const orderId = this.orderSelect.id ;
		this.roomSer.roomOrderItemList( { orderId })
			.subscribe( ( res: RESPONSE ) => {
				this.orderDetailList = [].concat( res.data.room , res.data.market ) ;
			});
	}
	
	public selectOrder($event: any ): void {
	 	this.orderSelect = $event ;
	 	this.orderDetailList = [] ;
	 	this.orderDetail() ;
	}
	
	public modalCancel(): void {
	 	this.WSEvent$.unsubscribe();
	}
	
	bindCardModal: boolean = false ;
	public bindCardForm: FormGroup = this.fb.group({
		rawId: [ null ] ,
		id: [ null , [Validators.required ]] ,
		name: [ null ] ,
		tel: [ null ] ,
		entityCardNumber: [ null ] ,
		cardNumber: [ null ]
	});
	public entityCardQuery(): void {
		this.service.vipInfo({entityCardNumber: this.bindCardForm.value.entityCardNumber})
		.subscribe( ( res: RESPONSE ) => {
			if ( res.data && res.data.length > 0) {
				this.bindCardForm.patchValue(res.data[0]) ;
			} else {
				this.msg.error('未查询到任何会员信息') ;
				this.bindCardForm.reset( ) ;
			}
		});
	}
	
	public bindCard($event: HTMLButtonElement): void {
		if ( !this.form.valid ) {
			this.msg.warn('请选读取原卡') ;
			return ;
		}
		
		if ( !this.bindCardForm.valid ) {
			this.msg.warn('请先读取需要绑定到的卡') ;
			return ;
		}
		
		if ( this.form.value.cardNumber === this.bindCardForm.value.cardNumber ) {
			this.msg.warn('相同卡号的卡不可进行绑定') ;
			return ;
		}
		// $event.disabled = true ;
		this.service.bindCard({
			oldVipId: this.form.value.id ,
			newVipId: this.bindCardForm.value.id
		})
			.pipe(
				filter( (res: RESPONSE ) => {
					if ( !res.success ) {
						this.msg.warn('绑定失败,原因' + res.message ) ;
					}
					$event.disabled = false ;
					return res.success ;
				}),
				map( ( res: RESPONSE ) => res.data )
			)
			.subscribe( data => {
				this.msg.success('绑定成功') ;
				this.query('id') ;
				this.bindCardModal = false ;
			});
	}
}

const birthDayValidation = ( control: FormControl ): any => {
	const val = control.value;
	if ( !val ) {
		return null ;
	} else {
		const valid = /\d{1,2}-\d{1,2}/g.test(val);
		return valid ? null : {invalid: true};
	}
};
