<template>
	<div class="viewCr" id="pdfDom">
		<div class="flex" style="margin-bottom:2em;">
			<input v-model="startTime" type="text" style="margin-right:1em;width:7em;" />
			<input v-model="endTime" type="text" style="margin-right:1em;width:7em;" />
			<button @click="getData">重画</button>
			<button @click="print" style="margin-left:1em;">打印</button>
			<button @click="getPdf()">点击生成pdf</button>
			<button @click="savecanvas">生成图片</button>
		</div>
		<img src="./assets/logo.png"/>
		<!--<LineChart v-if="showChart" :d="chartData" :minV="0" :maxV="500" :fixedTime="true" :startTime="startTime" :endTime="endTime" style="margin:0 1em 1em 0;" />-->
		<!--<ClockChart v-if="showChart" :d="chartData" :minV="0" :maxV="500" :fixedTime="true" :startTime="startTime" :endTime="endTime" style="margin:0 1em 1em 0;" />-->
		<LineChart v-if="showChart" :d="chartData" :startTime="startTime" :endTime="endTime" style="margin:0 1em 1em 0;" />
		<ClockChart v-if="showChart" :d="chartData" :startTime="startTime" :endTime="endTime" style="margin:0 1em 1em 0;" />
	</div>
</template>
	
<script>
	import axios from 'axios'
	import ClockChart from '@/components/ClockChart.vue'
	import LineChart from '@/components/LineChart.vue'
	import html2canvas from 'html2canvas'
	import JSPDF from 'jspdf'
	export default {
		name: 'charts',
		data() {
			return {
				allData: {
					msgs: []
				},
				startTime: new Date().AddDays(-4).DateToString(),
				endTime: new Date().AddDays(-1).DateToString(),
				showChart: false,
				text: 'abcdddrrdddrdd'
			};
		},
		components: {
			ClockChart,
			LineChart
		},
		computed: {
			dataUrl() {
								return `https://cloud.yunpuhuaxing.com/xgjSquareFigure.gatherdata.do?&gatherSn=70013&isTemp=0&beginTime=${this.startTime}&endTime=${this.endTime}`
//				return `/xgjSquareFigure.gatherdata.do?&gatherSn=388&beginTime=${this.startTime}&endTime=${this.endTime}&dataType=4`;
//				return `https://cloud.yunpuhuaxing.com/xgjSquareFigure.gatherdata.do?&gatherSn=70013&beginTime=2018-12-04&endTime=2018-12-09`
			},
			chartData() {
				return this.allData.msgs;
			}
		},
		methods: {
			getData() {
				this.showChart = false;
				axios.get(this.dataUrl).then(res => {
					console.log('get all data', res.data); //res.data.msgs = [];
					this.allData = res.data;
					this.showChart = true;
				})
			},
			print() {
				window.print();
			},
			savecanvas() {
				let canvas = document.querySelector('.viewCr');
				let that = this;
				html2canvas(canvas, {
					scale: 1,
					logging: false,
					useCORS: true
				}).then(function(canvas) {
					let type = 'png';
					let imgData = canvas.toDataURL(type);
					// 照片格式处理
					let _fixType = function(type) {
						type = type.toLowerCase().replace(/jpg/i, 'jpeg');
						let r = type.match(/png|jpeg|bmp|gif/)[0];
						return 'image/' + r;
					};
					imgData = imgData.replace(_fixType(type), 'image/octet-stream');
					let filename = "UUSound" + '.' + type;
					that.saveFile(imgData, filename);
				});
			},
			saveFile(data, filename) {
				let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
				save_link.href = data;
				save_link.download = filename;
				let event = document.createEvent('MouseEvents');
				event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				save_link.dispatchEvent(event);
			},
		},
		mounted() {
			this.getData();
		}

	}
</script>