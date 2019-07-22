import {Component} from '@angular/core';
import {MsgService, RoomService, SesssionStorageService} from '../../../service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {VipService} from '../../../service/vip/vip.service';
import {ENUM, RESPONSE} from '../../../models';
import {map} from 'rxjs/operators';
import {AdaptorUtils, DateUtils} from '../../utils';
import {ngIfAnimation} from '../../../router/router-animation';
import {Observable} from 'rxjs';
import {$RBRACE} from 'codelyzer/angular/styles/chars';
import {Strategy} from '../../../../decorators';

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
		private readonly roomSer: RoomService
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
	}
	
	public vipQueryList!: any[] ;
	public userInfo: any = {} ;
	private query(type: string): void {
		this.recordData = { consume: [] , deposit: [] , integral: [] } ;
		this.orderSelect = {} ;
		this.orderDetailList =  [] ;
		
		const para = {};
		para[type] = this.form.value[type];
		
		this.service.vipInfo(para)
			.pipe(map((res: RESPONSE) => res.data))
			.subscribe((data: any[]) => {
				if (data.length === 0) {
					this.msg.warn('所查询的用户不存在');
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
				this.orderDetailList = this.orderDetailList.concat( res.data.room , res.data.market ) ;
			});
	}
	
	public selectOrder($event: any ): void {
	 	this.orderSelect = $event ;
	 	this.orderDetailList = [] ;
	 	this.orderDetail() ;
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
