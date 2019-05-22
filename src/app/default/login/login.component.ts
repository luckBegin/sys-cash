
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MsgService, SesssionStorageService, StaffService} from '../../service';
import {RESPONSE} from '../../models' ;
import {Service} from '../../../decorators' ;
import {Router} from '@angular/router' ;

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less']
})
export class LoginComponent {
	constructor(
		private fb: FormBuilder,
		private msg: MsgService,
		private service: StaffService ,
		private sgo: SesssionStorageService ,
		private router: Router
	) {}

	form: FormGroup = this.fb.group({
		username: [null, [Validators.required]],
		password: [null, [Validators.required]]
	});
	
	qrStr: string = 'http://www.baidu.com' ;

	@Service('service.login', true, function() {
		const THIS = this as LoginComponent ;
		if ( !THIS.form.valid ) {
			THIS.msg.warn('请输入账号和密码');
			return false;
		} else {
			return THIS.form.value;
		}
	})
	login($event: MouseEvent , res?: RESPONSE ): void {
		const menu = res.data.menuInfo[1].children as any[] ;
		if ( menu.length <= 0 ) {
			this.msg.warn('该账号不具备任何权限,请联系管理人员') ;
			return ;
		}
		this.sgo.set('loginInfo' , res.data) ;

		this.router.navigate(['/prelogin']) ;
	}
}
