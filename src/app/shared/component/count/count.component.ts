import { Component , Input } from '@angular/core';

@Component({
	selector: 'common-count',
	template: `
		<div class="statusWrapper c-flex-row-start">
			<div class="light-font" style="margin-right: 10px">
				全部: <span class="font-bold"> {{ count.all }}</span>
			</div>
			<div class="status_0">
				空房:
				<span class="font-bold">
						{{ count['0'] ? count['0'] : 0 }}
					</span>
			</div>
			<div class="status_1">
				预定:
				<span class="font-bold">
						{{ count['1'] ? count['1'] : 0 }}
					</span>
			</div>
			<div class="status_2">
				待客:
				<span class="font-bold">
						{{ count['2'] ? count['2'] : 0 }}
					</span>
			</div>
			<div class="status_3">
				清洁:
				<span class="font-bold">
						{{ count['3'] ? count['3'] : 0 }}
					</span>
			</div>
			<div class="status_4">
				故障:
				<span class="font-bold">
						{{ count['4'] ? count['4'] : 0 }}
					</span>
			</div>
			<div class="status_5">
				线上:
				<span class="font-bold">
						{{ count['5'] ? count['5'] : 0 }}
					</span>
			</div>
			<div class="status_9">
				消费:
				<span class="font-bold">
						{{ count['6'] ? count['6'] : 0 }}
					</span>
			</div>
			<div class="status_6">
				计时:
				<span class="font-bold">
						{{ count['7'] ? count['7'] : 0 }}
					</span>
			</div>
			<div class="status_7">
				预买:
				<span class="font-bold">
						{{ count['8'] ? count['8'] : 0 }}
					</span>
			</div>
			<div class="status_8">
				买断:
				<span class="font-bold">
						{{ count['9'] ? count['9'] : 0 }}
					</span>
			</div>
		</div>
	`,
	styles: [`
        .statusWrapper>div{
            padding: 0 5px;
        }
	`],
})
export class CountComponent {
	@Input() count: any = {} ;
}
