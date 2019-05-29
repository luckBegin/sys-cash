import {Component, OnInit} from '@angular/core' ;
import {CONFIG} from '../../CONFIG' ;
import {SesssionStorageService} from "../../service/storage";
import {Router} from "@angular/router";
import {MsgService} from "../../service";

@Component({
	selector: 'layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit{
	constructor(
		private readonly sgo: SesssionStorageService ,
		private readonly router: Router ,
		private readonly msg: MsgService
	) {
	}
	
	ngOnInit(): void {
		const info = this.sgo.get("loginInfo") ;
		
		this.headImage = info['wxUserInfo']['headimgurl'] ;
		this.name = info['userInfo']['name'] ;
	}
	
	src: string = CONFIG.logo;
	title: string = CONFIG.name;
	name: string = '' ;
	headImage: string = '' ;
	
	logout(): void{
		this.msg.success('退出成功') ;
		this.sgo.clear() ;
		this.router.navigate(['/login']) ;
	}
}
