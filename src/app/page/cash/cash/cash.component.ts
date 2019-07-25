import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core' ;
import {ENUM, RESPONSE} from '../../../models' ;
import {combineLatest, interval, Subscription} from 'rxjs' ;
import {MsgService, RoomService} from '../../../service' ;
import {AdaptorUtils, DateUtils} from '../../../shared/utils' ;
import {ngIfAnimation} from '../../../router/router-animation' ;
import {KeyboardService} from '../../../service/keyboard/keyboard.service' ;
import {CONFIG} from '../../../CONFIG' ;
import {OutrightComponent} from '../../../shared/component/cash/outright/outright.component';
import {Service, Strategy} from '../../../../decorators';
import {AdvanceComponent} from '../../../shared/component/cash/advanve/advance.component';
import {CheckoutRoomComponent} from '../../../shared/component/casher/room/room.component';
import {NzTabChangeEvent} from 'ng-zorro-antd';
import {WebsocketService} from '../../../service/websocket/websocket.service';

@Component({
	selector: 'cash',
	templateUrl: './cash.component.html',
	styleUrls: ['./cash.component.less'],
	animations: [ngIfAnimation]
})
export class CashComponent implements OnInit, OnDestroy {
	constructor(
		private readonly service: RoomService,
		private readonly msg: MsgService,
		private readonly keyboardSer: KeyboardService ,
		private readonly WsSocket: WebsocketService
	) {
	}
	
	ngOnInit(): void {
		this.getENUMs();
		this.getList();
		this.keyEvent$ = this.listenKeyEvent();
		this.timer = interval(CONFIG.timer).subscribe(res => {
			this.getList();
		});
	}
	
	ngOnDestroy(): void {
		this.timer.unsubscribe();
		this.keyEvent$.unsubscribe();
	}
	
	keyEvent$: Subscription;
	
	set keyEventEnabled(val: boolean) {
		if (val === true) {
			this.keyEvent$ = this.listenKeyEvent();
		} else {
			this.keyEvent$.unsubscribe();
		}
		this._keyEventEnabled = val;
	}
	
	get keyEventEnabled(): boolean {
		return this._keyEventEnabled;
	}
	
	_keyEventEnabled: boolean = true;
	timer: any;
	
	ENUM_Type: ENUM[] = [];
	ENUM_Area: ENUM[] = [];
	
	selectType: any = 'type';
	selectItem: any = 'all';
	selectTabIndex: number = 1; // 0 计时  1 买断 2 预买
	private serveTimeStamp: number;
	roomTime: any = {
		time: [], // 计时
		outright: [], // 买断
		advance: [], // 预买
	};
	
	private rawData: any = {
		type: [],
		area: [],
		count: {}
	};
	
	dataList: any[] = [];
	
	getENUMs(): void {
		combineLatest(
			this.service.getArea(),
			this.service.getType()
		)
		.subscribe((res: any[]) => {
			this.ENUM_Area = AdaptorUtils.reflect(res[0].data, {id: 'value', name: 'key'});
			this.ENUM_Type = AdaptorUtils.reflect(res[1].data, {id: 'value', name: 'key'});
		});
	}
	
	getList(): void {
		this.service.getList()
		.subscribe((res: RESPONSE) => {
			const rawData = {
				type: [],
				area: [],
				count: {}
			};
			const data = res.data.data;
			data.forEach(item => {
				if (!rawData['type'][item.typeId]) {
					rawData['type'][item.typeId] = [];
				}
				
				if (!rawData['area'][item.areaId]) {
					rawData['area'][item.areaId] = [];
				}
				
				rawData['type'][item.typeId].push(item);
				rawData['area'][item.areaId].push(item);
				
			});
			
			rawData.count = res.data.count;
			this.rawData = rawData;
			this.serveTimeStamp = res.timeStamp;
			this.selectList();
		}, err => {
		});
	}
	
	selectList(): void {
		const arr = [];
		if (this.selectItem === 'all') {
			const item = this.rawData[this.selectType];
			Object.keys(item).forEach(keys => {
				const count = {all: 0};
				const data = item[keys];
				
				data.forEach((itm: any) => {
					if (!count[itm.status]) {
						count[itm.status] = 0;
					}
					count[itm.status]++;
					count.all++;
				});
				
				arr.push({count, data});
			});
		} else {
			const data = this.rawData[this.selectType][this.selectItem] as any[];
			const count = {all: 0};
			data.forEach(itm => {
				if (!count[itm.status]) {
					count[itm.status] = 0;
				}
				count[itm.status]++;
				count.all++;
			});
			arr.push({count, data});
		}
		
		this.dataList = arr;
	}
	
	switchType($event: NzTabChangeEvent): void {
		const type = $event.index === 0 ? 'type' : 'area';
		this.selectType = type;
		this.dataList = this.rawData[type];
		this.selectItem = 'all';
		this.selectList();
	}
	
	switchItem(item: any): void {
		this.selectItem = item;
		this.selectList();
	}
	
	selectRoomId: number = null;
	modalShow: boolean = false;
	selectRoomItem: any = null;
	
	@ViewChild('outrightComponent')
	outrightComponent: OutrightComponent;
	
	@ViewChild('advanceComponent')
	advanceComponent: AdvanceComponent;
	
	@ViewChild('checkoutRoomComponent')
	checkoutRoomComponent: CheckoutRoomComponent;
	
	roomSelect(item: any): void {
		if (this.selectRoomId === item.id) {
			this.keyEventEnabled = false;
			
			if (item.status === 0) {
				this.getPriceByType(item.typeId);
			} else {
				this.modalShow = true;
			}
			
		} else {
			this.selectRoomId = item.id;
		}
		
		this.selectRoomItem = item;
	}
	
	listenKeyEvent(): Subscription {
		return this.keyboardSer.keyboardEvent$
		.subscribe(key => {
			
		});
	}
	
	getPriceByType(typeId: number): void {
		this.service.getPriceByType({typeId})
		.subscribe((res: RESPONSE) => {
			const time = [];
			const outright = [];
			const advance = [];
			// 判断是否每个分类可用
			res.data.forEach(item => {
				if (item.isTime === '1') {
					time.push(item);
				}
				
				if (item.isOutright === '1') {
					outright.push(item);
				}
				
				if (item.isAdvance === '1') {
					advance.push(item);
				}
			});
			this.roomTime = {time, outright, advance};
			
			if (this.outrightComponent) {
				this.outrightComponent.init( this.roomTime.outright , this.selectRoomItem.typeId );
			}
			
			if (this.advanceComponent) {
				this.advanceComponent.init( this.selectRoomItem.typeId );
			}
			
			if (this.checkoutRoomComponent) {
				this.checkoutRoomComponent.init();
			}
			
			this.modalShow = true;
		}, e => {
			this.msg.error('查询房间价格异常' + e);
		});
	}
	
	@Strategy({
		0($event: MouseEvent) {
			(this as CashComponent).openByTime($event);
		}
	})
	open($event: Event): number {
		return this.selectTabIndex;
	}
	
	@Service('service.openByTime', true, function() {
		return {id: (this as CashComponent).selectRoomItem.id};
	})
	openByTime($event: MouseEvent): void {
		this.msg.success('开房成功');
		this.modalShow = false;
		this.getList();
	}
	
	checkoutShow: boolean = false;
	
	checkout($event: any): void {
		if (this.selectTabIndex === 1) {
			const withTimePrice = this.outrightComponent.getWithTimePrice();
			const selectOutright = this.outrightComponent.getSelectOutright();
			this.checkoutRoomComponent.makeCalc(this.selectTabIndex, withTimePrice, selectOutright);
			this.checkoutRoomComponent.initPaymentMethod();
		} else {
			const time = this.advanceComponent.getTime();
			this.checkoutRoomComponent.makeCalc(2, true, {
				shopId: this.selectRoomItem.shopId,
				typeId: this.selectRoomItem.typeId,
				startTime: time.joinTime,
				endTime: time.leaveTime
			});
			this.checkoutRoomComponent.initPaymentMethod();
		}
		this.checkoutShow = true;
	}
	
	checkoutByTime($event: any): void {
		this.checkoutRoomComponent.makeCalc(0, true, this.selectRoomItem);
		this.checkoutShow = true;
		this.checkoutRoomComponent.initPaymentMethod();
	}
	
	@Service('service.openByOutright', true, function() {
		const methodPayment = (this as CashComponent).checkoutRoomComponent.getMethodPayment();
		methodPayment['id'] = (this as CashComponent).selectRoomId;
		return methodPayment;
	})
	openByOutright($event: MouseEvent): void {
		this.checkoutShow = false;
		this.modalShow = false;
		this.msg.success('操作成功');
		this.getList();
	}
	
	@Service('service.openByAdvance', true, function() {
		const methodPayment = (this as CashComponent).checkoutRoomComponent.getMethodPayment();
		methodPayment['id'] = (this as CashComponent).selectRoomId;
		return methodPayment;
	})
	openByAdvance($event: MouseEvent): void {
		this.checkoutShow = false;
		this.modalShow = false;
		this.msg.success('操作成功');
		this.getList();
	}
	
	@Service('service.checkoutWithTime', true, function() {
		const methodPayment = (this as CashComponent).checkoutRoomComponent.getMethodPayment();
		methodPayment['id'] = (this as CashComponent).selectRoomId;
		methodPayment['orderId'] = (this as CashComponent).selectRoomItem.orderId;
		return methodPayment;
	})
	checkOutWithTime($event: MouseEvent): void {
		this.checkoutShow = false;
		this.modalShow = false;
		this.msg.success('操作成功');
		this.getList();
	}
	
	@Service('service.reset', true, function() {
		return {
			id: (this as CashComponent).selectRoomItem.id
		};
	})
	reset($event: MouseEvent): void {
		this.msg.success('操作成功');
		this.getList();
		this.modalShow = false;
	}
	
	@Service('service.clean', true, function() {
		return {
			id: (this as CashComponent).selectRoomItem.id
		};
	})
	clean($event: MouseEvent): void {
		this.msg.success('操作成功');
		this.getList();
		this.modalShow = false;
	}
}
