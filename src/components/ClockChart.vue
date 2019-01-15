<template>
  <div>

   <svg :style="{width: SvgSize, height: SvgSize, fontSize: FontSize+'px', backgroundColor: 'white'}" @click="click($event)">
      <circle v-for="mr in Marks" :cx="c" :cy="c" :r="mr" fill="transparent" :stroke="color" :stroke-width="LineW"/>
      <line v-for="ma in TimeMarks" :x1="c" :y1="c" :x2="c+Math.sin(ma)*r" :y2="c-Math.cos(ma)*r"  :fill="color" :stroke="color" :stroke-width="LineW"/>
      <text v-for="(mr, index) in Marks" :x="c+FontSize*0.3*MarkTextLeft[index]" :y="c-mr+FontSize/3" :fill="color">{{MarkTexts[index]}}</text>
      <text v-for="(ma, index) in TimeMarks" :x="c+Math.sin(ma)*TimeTextR-FontSize*0.9" :y="c-Math.cos(ma)*TimeTextR+FontSize/3"  :fill="color">{{timeMarkText(ma, index)}}</text>   
      
      <circle v-for="p in chartData" :cx="p.x" :cy="p.y" :r="LineW"  :fill="color" :stroke="color" :stroke-width="LineW"/> 
      <line v-for="(p, pi) in chartData" v-if="pi>0" :x1="p.x" :y1="p.y" :x2="chartData[pi-1].x" :y2="chartData[pi-1].y"  :stroke="color" :stroke-width="LineW"/>
      <circle v-if="p===show" v-for="p in chartData" :cx="p.x" :cy="p.y" :fill="selectColor" :r="pointR"/>             
      <text v-if="show"  :x="c-FontSize*8" :y="FontSize*1.5" :fill="selectColor">{{show.time2+" 压力："+show.value}}</text>                
   </svg>
   
  </div>
</template>

<script>
import { ChartDataProcessor } from '@/ChartDataProcessor.js'; let processor = new ChartDataProcessor();

let Pi2 = Math.PI * 2, selectColor = "red", color = 'black', //2pai
  SvgSize = 340, //画布整体尺寸
  FontSize = 16, //字体大小
  LineW = 1, //线条粗细
  MarksCount = 5, //垂直刻度个数
  TimeMarkCount = 24, //时间刻度个数
  Factor = 60, //曲线平滑度，越大越平滑
  daysCount = 1;//默认天数，实际天数从数据计算


function initData() {
  return { chartData: [], color, selectColor, SvgSize, MarksCount, Factor, LineW, FontSize, TimeMarkCount0: TimeMarkCount, TimeMarkCount, daysCount, timeMarkCountPerDay: TimeMarkCount / daysCount, min: 0, max: 0, sep: 1, emp: 1, Marks: [], MarkTexts: [], MarkTextMax: 3, MarkTextLeft: [], TimeMarks: [], TimeMarkTexts: [], MarkLines: [], show: null };
}

export default {
  name: 'ClockChart',
  props: ['d', 'minV', 'maxV', 'startTime', 'endTime', 'fixedTime'],
  data() {
    return initData();
  },
  computed: {
    c() {//画布中心
      return this.SvgSize / 2;
    },
    SvgMargin() { //画布与外圈的间距
      return this.FontSize * 4;
    },
    r() { //外圈半径
      return this.c - this.SvgMargin;
    },
    TimeTextR() {//时间刻度半径
      return this.r + this.FontSize;
    },
    pointR() {//选中显示点的半径
      return this.LineW * 4;
    },
  },
  created() {
    processor.setup({ vm: this, type: 'clock' })
  },
  methods: {
    timeMarkText(ma, index) {
      let per = this.timeMarkCountPerDay;
      return index % per === 0 ? (index / per + 1) + '天' : ((index % per) * (24 / per));
    },
    click(ev) { processor.click({ mx: ev.offsetX, my: ev.offsetY, vm: this }) }//点击显示标签
  }
}
</script>

<style scoped>
</style>
