import {Component, OnInit} from '@angular/core';
import {SesssionStorageService} from '../../service/storage' ;
import {ENUM} from '../../models' ;
import {Router} from '@angular/router' ;

@Component({
	selector: 'prelogin',
	templateUrl: './prelogin.component.html',
	styleUrls: ['./prelogin.component.less']
})
export class PreloginComponent implements OnInit {
	constructor(
		private readonly sgo: SesssionStorageService,
		private readonly router: Router
	) {
	}

	ngOnInit(): void {
		this.getENUM();
	}

	ENUM_Shop: ENUM[] = [];
	ENUM_Sys: ENUM[] = [];
	selectShop: number = 0;
	selectSys: number = 0;

	getENUM(): void {
		const loginInfo = this.sgo.get('loginInfo');

		const menu = loginInfo.menuInfo[1].children as any[];
		const shopInfo = loginInfo.shopInfo as any[];
		menu.forEach((item: any) => {
			this.ENUM_Sys.push({
				key: item.name,
				value: item.path,
			});
		});

		shopInfo.forEach((item: any) => {
			this.ENUM_Shop.push({
				key: item.name,
				value: item.id
			});
		});
	}

	select(idx: number, type: string): void {
		this[type] = idx;
	}

	fire(): void {
		const selectShop = this.ENUM_Shop[this.selectShop];
		const selectSys = this.ENUM_Sys[this.selectSys];
		this.sgo.set('selectShop', selectShop);
		this.router.navigate([ selectSys.value ]) ;
	}
}
