import {Component} from '@angular/core' ;
import {CONFIG} from '../../CONFIG' ;

@Component({
	selector: 'layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.less']
})
export class LayoutComponent {
	constructor() {}

	src: string = CONFIG.logo;
	title: string = CONFIG.name;
}
