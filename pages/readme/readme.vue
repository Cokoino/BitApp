<template>
	<view class="font">
		<text>
			team: cokoino
			http://cokoino.com
			https://github.com/cokoino
			button format: 0xff-data-0x00-0xff
			slider format: 0xff-data-0x(0a-0e)-0xff
			compass format: 0xff-dataX-dataY-dataZ-0x14-0xff
				data > 100 : real data = -(data-100)/10
				data < 100 : real data = data/10
			compatibility: Micro:bit V1\HM-10
			
			revision record:
			-----------------------------
			first issue
			button command: 43
			slider command: 5
			version: v1.0
			date: 2020-9-1
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
