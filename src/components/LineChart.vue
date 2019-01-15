<template>
  <div>

   <svg :style="{width: SvgWidth, height: SvgHeight, backgroundColor: 'white',  fontSize: FontSize+'px'}" @click="click($event)">
      <line :x1="c.x" :y1="c.y"  :x2="c.x" :y2="SvgMargin.y" :stroke="color" :stroke-width="LineW"/>
      <line :x1="c.x" :y1="c.y"  :x2="c.x+r.x" :y2="c.y" :stroke="color" :stroke-width="LineW"/>

      <text v-if="TimeMode==='m/d'" v-for="(ma, index) in TimeMarks" :x="c.x+ma-FontSize*1" :y="c.y+FontSize"  :fill="color">{{ TimeMarkTexts[index]}}</text>        
      <text v-if="TimeMode==='d/h'" v-for="(ma, index) in TimeMarks" :x="c.x+ma-FontSize*1" :y="c.y+FontSize"  :fill="color">{{ daysTexts[Math.floor(index/timeMarkCountPerDay)]}}/{{((index%timeMarkCountPerDay)*(24/timeMarkCountPerDay))}}</text>  
      <text :x="c.x+r.x-FontSize" :y="c.y+2.3*FontSize" :fill="color">({{TimeMode}})</text>   
      <line v-for="mr in TimeMarks" :x1="c.x+mr" :y1="c.y"  :x2="c.x+mr" :y2="c.y-MarkLineLength" :stroke="color" :stroke-width="LineW"/>

      

      <text v-for="(mr, index) in Marks" :x="c.x-MarkTextMax*FontSize*0.6+FontSize*0.3*MarkTextLeft[index]" :y="c.y-mr+FontSize/3" :fill="color">{{MarkTexts[index]}}</text>
      <line v-for="(mr, index) in Marks" :x1="c.x" :y1="c.y-mr"  :x2="c.x+r.x" :y2="c.y-mr"  :stroke="color" :stroke-width="LineW"></line>

       
      <circle v-for="p in chartData" :cx="p.x" :cy="p.y" :r="LineW"  :fill="color" :stroke="color" :stroke-width="LineW"/>
      <line v-for="(p, pi) in chartData" v-if="pi>0" :x1="p.x" :y1="p.y" :x2="chartData[pi-1].x" :y2="chartData[pi-1].y"  :stroke="color" :stroke-width="LineW"/>
      <circle v-if="p===show" v-for="p in chartData" :cx="p.x" :cy="p.y" :fill="selectColor" :r="pointR"/>             
      <text v-if="show"  :y="SvgMargin.y-FontSize*1.5" :x="SvgWidth/2-FontSize*8" :fill="selectColor">{{show.time2}} 压力：{{show.value}}</text>        

   </svg>
   
  </div>
</template>

<script>

let Pi2 = Math.PI * 2, selectColor = "red", color = 'black', //2pai
  SvgWidth = 340, SvgHeight = 340, //画布整体尺寸
  FontSize = 16, //字体大小
  LineW = 1, //线条粗细
  MarkLineLength = 5,
  MarksCount = 5, //垂直刻度个数
  TimeMarkCount = 6, //时间刻度个数
  Factor = 60, //曲线平滑度，越大越平滑
  daysCount = 1;//默认天数，实际天数从数据计算

function initData() {
  return { chartData: [], color, selectColor, SvgWidth, SvgHeight, MarksCount, Factor, LineW, MarkLineLength, FontSize, TimeMarkCount0: TimeMarkCount, TimeMarkCount, daysCount, timeMarkCountPerDay: TimeMarkCount / daysCount, min: 0, max: 0, sep: 1, emp: 1, Marks: [], MarkTexts: [], MarkTextMax: 3, MarkTextLeft: [], TimeMarks: [], TimeMode: 'd/h', TimeMarkTexts: [], daysTexts: [], MarkLines: [], show: null };
}


import { ChartDataProcessor } from '@/ChartDataProcessor.js'; let processor = new ChartDataProcessor();

export default {
  name: 'ClockChart',
  props: ['d', 'minV', 'maxV', 'startTime', 'endTime', 'fixedTime'],
  data() {
    return initData();
  },
  computed: {
    SvgMargin() { //画布与坐标的间距
      return { x: this.FontSize * 3, y: this.FontSize * 3 };
    },
    r() { //坐标尺寸
      return { x: this.SvgWidth - 2 * this.SvgMargin.x, y: this.SvgHeight - 2 * this.SvgMargin.y };
    },
    c() {//坐标原点
      return { x: this.SvgMargin.x, y: this.SvgHeight - this.SvgMargin.y };
    },
    TimeTextR() {//时间刻度y
      return this.c.y + this.FontSize;
    },
    pointR() {//选中显示点的半径
      return this.LineW * 4;
    },
  },
  created() {
    processor.setup({ vm: this, type: 'line' })
  },
  methods: {
    click(ev) { processor.click({ mx: ev.offsetX, my: ev.offsetY, vm: this }) }//点击显示标签
  }
}
</script>

<style scoped>
</style>
