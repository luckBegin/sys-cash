import {Component, OnDestroy, OnInit} from '@angular/core' ;
import {MsgService, RoomService} from '../../../service' ;
import {ngIfAnimation} from '../../../router/router-animation' ;
import {KeyboardService} from '../../../service/keyboard/keyboard.service' ;
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
		private readonly keyboardSer: KeyboardService,
		private readonly WsSocket: WebsocketService
	) {
	}

	ngOnInit(): void{
		console.log( 123 ) ;
	}

	ngOnDestroy(): void{
		console.log( 321 ) ;
	}
}

