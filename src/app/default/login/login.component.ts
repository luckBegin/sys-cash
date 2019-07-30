import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MsgService, SesssionStorageService, StaffService} from '../../service';
import {RESPONSE} from '../../models' ;
import {Service} from '../../../decorators' ;
import {Router} from '@angular/router' ;
import {WeChatService} from '../../service/weChat/weChat.service';
import {interval, Observable} from 'rxjs';
import {CONFIG} from '../../CONFIG';
import * as md5 from 'md5' ;
import {ngIfAnimation} from '../../router/router-animation';
@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less'] ,
	animations: [ngIfAnimation]
})
export class LoginComponent implements OnInit {
	constructor(
		private readonly fb: FormBuilder,
		private readonly msg: MsgService,
		private readonly service: StaffService,
		private readonly sgo: SesssionStorageService,
		private readonly router: Router,
		private readonly wxSer: WeChatService
	) {
	}
	
	form: FormGroup = this.fb.group({
		username: [null, [Validators.required]],
		password: [null, [Validators.required]]
	});
	
	qrStr: string = '';
	private loginKey: string = '';
	private wxLoginEvent$;
	private CONFIG = CONFIG ;
	ngOnInit(): void {
		this.getQrCode();
	}
	
	@Service('service.login', true, function() {
		const THIS = this as LoginComponent;
		if (!THIS.form.valid) {
			THIS.msg.warn('请输入账号和密码');
			return false;
		} else {
			return  {
				username: THIS.form.value.username ,
				password: md5(THIS.form.value.password)
			};
		}
	})
	login($event: MouseEvent, res?: RESPONSE): void {
		this.wxLoginEvent$.unsubscribe();
		const menu = res.data.menuInfo[1].children as any[];
		if (menu.length <= 0) {
			this.msg.warn('该账号不具备任何权限,请联系管理人员');
			return;
		}
		this.sgo.set('loginInfo', res.data);
		
		this.router.navigate(['/prelogin']);
	}
	
	getQrCode(): void {
		this.wxSer.getQrCode()
		.subscribe((res: RESPONSE) => {
			this.qrStr = res.data.qrUrl;
			this.loginKey = res.data.key;
			if (!this.wxLoginEvent$) {
				this.wxLoginEvent$ = interval(2000)
				.subscribe(sec => {
					this.onWxLogin();
				});
			}
		});
	}
	
	onWxLogin(): void {
		this.service.qrLogin({code: this.loginKey})
		.subscribe((res: RESPONSE) => {
			if (res.success === true) {
				this.wxLoginEvent$.unsubscribe();
				const menu = res.data.menuInfo[1].children as any[];
				if (menu.length <= 0) {
					this.msg.warn('该账号不具备任何权限,请联系管理人员');
					return;
				}
				this.sgo.set('loginInfo', res.data);
				this.router.navigate(['/prelogin']);
			}
		});
	}
}
