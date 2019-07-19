import {Component} from '@angular/core';
import {MsgService, SesssionStorageService} from '../../../service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {VipService} from '../../../service/vip/vip.service';
import {ENUM, RESPONSE} from '../../../models';
import {map} from 'rxjs/operators';
import {AdaptorUtils, DateUtils} from '../../utils';
import {ngIfAnimation} from '../../../router/router-animation';

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
		private readonly service: VipService
	) {
	}
	
	private currentVipId: number;
	
	form: FormGroup = this.fb.group({
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
		remark: [ null ]
	});
	
	public init(): void {
		if ( !this.ENUM_VipTypes ) {
			this.getType() ;
		}
		this.form.reset() ;
		this.form.patchValue({ status: 0 }) ;
	}
	
	vipQueryList!: any[] ;
	private query(type: string): void {
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
				this.form.patchValue( data[0] ) ;
				return ;
			}
			
		});
	}
	
	ENUM_VipTypes!: ENUM[] ;
	private getType(): void {
		this.service.vipType({ default: 0})
			.pipe( map( (res: RESPONSE ) => res.data))
			.subscribe( ( data: any[] ) => {
				this.ENUM_VipTypes = AdaptorUtils.reflect( data , { id: 'value' , name: 'key'}) ;
				console.log( this.ENUM_VipTypes ) ;
			});
	}
	
	private reset(): void {
		this.form.reset() ;
		this.form.patchValue({
			status: 0 ,
		}) ;
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
				} else {
					this.msg.error('新建失败,原因:' + res.message ) ;
				}
				el.disabled = false ;
			});
	}
	
	update($event: MouseEvent): void {
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
				this.msg.success('更新') ;
			} else {
				this.msg.error('新建失败,原因:' + res.message ) ;
			}
			el.disabled = false ;
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
