import {Component, EventEmitter , Output} from '@angular/core' ;
import {MsgService, RoomService} from "../../../service";
import {RESPONSE} from "../../../models";

@Component({
	selector: 'one-key-reset' ,
	template: `
		<div class = 'wrapper'>
			<i nz-icon nzType="reload" nzTheme="outline"></i>
			<span  nz-popconfirm nzTitle="确定将所有清洁房置空?"  (nzOnConfirm)="confirm()">一键置空</span>
		</div>
	` ,
	styles: [`
		.wrapper{
			margin-right: 30px;
			color:#fff;
			font-size: 14px;
			cursor: pointer;
			transition: all .2s ease-in ;
		}
		.wrapper:hover{
			color:#40a9ff
		}
		.wrapper>i{
			margin-right: 5px;
		}
	`] ,
})
export class ResetComponent {
	constructor(
		private readonly service:RoomService ,
		private readonly msg: MsgService ,
	){}
	
	@Output() notify: EventEmitter< any > = new EventEmitter() ;
	
	confirm(): void{
		this.service.resetAll()
			.subscribe( ( res: RESPONSE ) => {
				this.msg.success("置空成功") ;
				this.notify.emit() ;
			})
	}
}
