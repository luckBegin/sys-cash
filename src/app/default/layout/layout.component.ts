import {Component, OnInit, ViewChild} from '@angular/core' ;
import {CONFIG} from '../../CONFIG' ;
import {SesssionStorageService} from '../../service/storage';
import {Router} from '@angular/router';
import {MsgService, StaffService} from '../../service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as md5 from 'md5' ;
import {RESPONSE} from '../../models';
import {VipInfoComponent} from '../../shared/component/vipInfo/vipInfo.component';

@Component({
	selector: 'layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {
	constructor(
		private readonly sgo: SesssionStorageService,
		private readonly router: Router,
		private readonly msg: MsgService,
		private readonly fb: FormBuilder,
		private readonly staffSer: StaffService
	) {
	}
	
	ngOnInit(): void {
		const info = this.sgo.get('loginInfo');
		this.headImage = info['wxUserInfo']['headimgurl'];
		this.name = info['userInfo']['name'];
	}
	
	src: string = CONFIG.logo;
	title: string = CONFIG.name;
	name: string = '';
	headImage: string = '';
	
	form: FormGroup = this.fb.group({
		new: [null, [Validators.required]],
		newRepeat: [null, [Validators.required]]
	});
	
	changePassShow: boolean = false;
	
	changePass(): void {
		this.form.reset();
		this.changePassShow = true;
	}
	
	logout(): void {
		this.msg.success('退出成功');
		this.sgo.clear();
		this.router.navigate(['/login']);
	}
	
	sure(): void {
		if (!this.form.valid) {
			this.msg.warn('请输入每一项信息');
			return;
		}
		
		const val = this.form.value;
		
		if (val.new !== val.newRepeat) {
			this.msg.warn('两次输入的密码不一致');
			return;
		}
		
		this.staffSer.changePass({
			new: md5(val.new)
		})
		.subscribe((res: RESPONSE) => {
			this.msg.success('修改成功');
			this.changePassShow = false;
			this.logout();
		});
	}
	
	vipInfoModal: boolean = false;
	@ViewChild('vipInfoComponent') vipInfoComponent: VipInfoComponent ;
	vipInfo(): void {
		this.vipInfoComponent.init() ;
		this.vipInfoModal = true;
	}
	
}
