<template>
	<view class="font">
		<text>
			team: Jalen
			http://cokoino.com
			https://github.com/cokoino
			button format: S-0x00-data-P
			slider format: S-0x(0a-0e)-data-P
			accelerometer format: S-0x14-dataX-dataY-dataZ-P
			----data > 100 : real data = -(data-100)/10
			----data < 100 : real data = data/10
			compatibility: Micro:bit V1-2\HM-10\JDY-23
			
			revision record:
			-----------------------------
			button command: 43
			slider command: 5
			version: v1.0
			date: 2021-9-1
		</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.font{
		color:#646464;
		font-size: 13px;
		text-align:left;
		position: absolute;
		left: 2%;
	}
</style>
