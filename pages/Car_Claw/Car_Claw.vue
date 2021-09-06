<template>
	<view class="content">
		<!-- hover-start-time: 10;   按住后多久出现点击态，单位毫秒
		     hover-stay-time=100;    手指松开后点击态保留时间，单位毫秒-->
		<view class="return" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="returnClick">
			<image class="Image" src="/static/button/return.png"> </image>
		</view>
		<view class="leftBlock">
			<view class="LCR">
				<view class="arrowsButton"  hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/Button_Up.png" @click="BLEsend(31)"> </image>
				</view>
			</view>
			<view class="LCR">
				<view class="arrowsButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/Button_Left.png" @click="BLEsend(32)"> </image>
				</view>
				<view class="arrowsButton" style="border-radius: 50rpx;" hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/add.png" @click="BLEsend(33)"> </image>
				</view>
				<view class="arrowsButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/Button_Right.png" @click="BLEsend(34)"> </image>
				</view>
			</view>
			<view class="LCR">
				<view class="arrowsButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/Button_Download.png" @click="BLEsend(35)"> </image>
				</view>
			</view>
		</view>
		<view class="centerBlock">
			<view class="HornLightButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
				<image style="width:100%; height:100%;" src="/static/button/exchange.png" @click="controlSelect"> </image>
			</view>
			<view class="HornLightButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
				<image style="width:94%; height:94%;" src="/static/button/Color_Meter.png" @click="BLEsend(36)"> </image>
			</view>
			<view class="HornLightButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
				<image style="width:100%; height:100%;" src="/static/button/car_light.png" @click="BLEsend(37)"> </image>
			</view>
			<view class="HornLightButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
				<image style="width:92%; height:92%;" src="/static/button/horn.png" @click="BLEsend(38)"> </image>
			</view>
		</view>
		<view class="rightBlock">
			<view v-if="!changeBlock" class="rightPad">
				<view class="LCR">
					<view class="arrowsButton"  hover-class="hover" hover-start-time=5 hover-stay-time=100>
						<image class="Image" src="/static/button/Button_Up.png" @click="BLEsend(39)"> </image>
					</view>
				</view>
				<view class="LCR">
					<view class="arrowsButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
						<image class="Image" src="/static/button/Button_Left.png" @click="BLEsend(40)"> </image>
					</view>
					<view class="arrowsButton" style="border-radius: 50rpx;" hover-class="hover" hover-start-time=5 hover-stay-time=100>
						<image class="Image" src="/static/button/sub.png" @click="BLEsend(41)"> </image>
					</view>
					<view class="arrowsButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
						<image class="Image" src="/static/button/Button_Right.png" @click="BLEsend(42)"> </image>
					</view>
				</view>
				<view class="LCR">
					<view class="arrowsButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
						<image class="Image" src="/static/button/Button_Download.png" @click="BLEsend(43)"> </image>
					</view>
				</view>
			</view>
			<view v-if="changeBlock" class="rightPad">
				<slider class="slider" value="90" max="180" @change="sliderChange1" show-value />
				<slider class="slider" value="90" max="180" @change="sliderChange2" show-value />
				<slider class="slider" value="90" max="180" @change="sliderChange3" show-value />
				<slider class="slider" value="90" max="180" @change="sliderChange4" show-value />
			</view>
		</view>
	</view>
</template>

<script>
	//引用蓝牙文件
	import Bluetooth from '@/JS/bluetooth.js'
	let bluetooth = new Bluetooth();
	bluetooth = getApp().globalData.ble;  //将全局变量赋值给局部变量，定义与App.vue文件
	let BleArrayBuffer = new Array();
	
	export default {
		data() {
			return {
				changeBlock: false,
			}
		},
		methods: {
			returnClick() {
				//关闭当前页面，返回上一层或者多层页面
				uni.navigateBack({
				    delta: 1
				});
			},
			controlSelect() {
				this.changeBlock = !this.changeBlock;
			},
			//发送普通按键数据
			BLEsend(command) {
				if(bluetooth.connectFlag){
					BleArrayBuffer = [];
					BleArrayBuffer[0] = 83;    //ascii表对应'S'
					BleArrayBuffer[1] = 48;    //BleArrayBuffer[1-3] = "000" --> 0x00 = button
					BleArrayBuffer[2] = 48;    //48应对ascii值为0
					BleArrayBuffer[3] = 48;
					BleArrayBuffer[4] = parseInt(command/100)+48;    //BleArrayBuffer[4-6] = data --> sensor data
					BleArrayBuffer[5] = parseInt(command%100/10)+48;
					BleArrayBuffer[6] = command%10+48;
					BleArrayBuffer[7] = 80;   //ascii表对应'P'
					bluetooth.writeBLECharacteristicValueArray(BleArrayBuffer);
				}
			},
			//发送滑竿数据
			sliderChange1(e){
				if(bluetooth.connectFlag){
					BleArrayBuffer = [];
					BleArrayBuffer[0] = 83;    //ascii表对应'S'
					BleArrayBuffer[1] = 48;    //BleArrayBuffer[1-3] = "011" --> 0xb = slider data
					BleArrayBuffer[2] = 1+48;  //48应对ascii值为0
					BleArrayBuffer[3] = 1+48;
					BleArrayBuffer[4] = parseInt(e.detail.value/100)+48;    //BleArrayBuffer[4-6] = data --> sensor data
					BleArrayBuffer[5] = parseInt(e.detail.value%100/10)+48;
					BleArrayBuffer[6] = e.detail.value%10+48;
					BleArrayBuffer[7] = 80;   //ascii表对应'P'
					bluetooth.writeBLECharacteristicValueArray(BleArrayBuffer);
				}
			},
			sliderChange2(e){
				if(bluetooth.connectFlag){
					BleArrayBuffer = [];
					BleArrayBuffer[0] = 83;    //ascii表对应'S'
					BleArrayBuffer[1] = 48;    //BleArrayBuffer[1-3] = "012" --> 0x0c = slider data
					BleArrayBuffer[2] = 1+48;  //48应对ascii值为0
					BleArrayBuffer[3] = 2+48;
					BleArrayBuffer[4] = parseInt(e.detail.value/100)+48;    //BleArrayBuffer[4-6] = data --> sensor data
					BleArrayBuffer[5] = parseInt(e.detail.value%100/10)+48;
					BleArrayBuffer[6] = e.detail.value%10+48;
					BleArrayBuffer[7] = 80;   //ascii表对应'P'
					bluetooth.writeBLECharacteristicValueArray(BleArrayBuffer);
				}
			},
			sliderChange3(e){
				if(bluetooth.connectFlag){
					BleArrayBuffer = [];
					BleArrayBuffer[0] = 83;    //ascii表对应'S'
					BleArrayBuffer[1] = 48;    //BleArrayBuffer[1-3] = "013" --> 0x0d = slider data
					BleArrayBuffer[2] = 1+48;  //48应对ascii值为0
					BleArrayBuffer[3] = 3+48;
					BleArrayBuffer[4] = parseInt(e.detail.value/100)+48;    //BleArrayBuffer[4-6] = data --> sensor data
					BleArrayBuffer[5] = parseInt(e.detail.value%100/10)+48;
					BleArrayBuffer[6] = e.detail.value%10+48;
					BleArrayBuffer[7] = 80;   //ascii表对应'P'
					bluetooth.writeBLECharacteristicValueArray(BleArrayBuffer);
				}
			},
			sliderChange4(e){
				if(bluetooth.connectFlag){
					BleArrayBuffer = [];
					BleArrayBuffer[0] = 83;    //ascii表对应'S'
					BleArrayBuffer[1] = 48;    //BleArrayBuffer[1-3] = "014" --> 0x0e = slider data
					BleArrayBuffer[2] = 1+48;  //48应对ascii值为0
					BleArrayBuffer[3] = 4+48;
					BleArrayBuffer[4] = parseInt(e.detail.value/100)+48;    //BleArrayBuffer[4-6] = data --> sensor data
					BleArrayBuffer[5] = parseInt(e.detail.value%100/10)+48;
					BleArrayBuffer[6] = e.detail.value%10+48;
					BleArrayBuffer[7] = 80;   //ascii表对应'P'
					bluetooth.writeBLECharacteristicValueArray(BleArrayBuffer);
				}
			}
		}
	}
</script>

<style>
	.leftBlock{
		display: flex;
		flex-direction: column;       /*row\row-reverse\column\column-reverse*/
		width: 44%;
		height: 85%;
		justify-content: center;
		align-items: center;
		background-color: #FFF0F0;
	}
	
	.centerBlock{
		display: flex;
		flex-direction: column;       /*row/row-reverse/column/column-reverse*/
		width: 12%;
		height: 85%;
		justify-content: space-around;      /*flex-start|flex-end|center|space-between|space-around*/
		align-items: center;
		background-color: #FFF0F0;
	}
	
	.rightBlock{
		display: flex;
		flex-direction: column;       /*row/row-reverse/column/column-reverse*/
		width: 44%;
		height: 85%;
		justify-content: center;
		align-items: center;
		background-color: #FFF0F0;
	}
	
	.rightPad{
		display: flex;
		flex-direction: column;       /*row/row-reverse/column/column-reverse*/
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
	}
	
	.slider{
		display: flex;
		flex-direction: column;       /*row/row-reverse/column/column-reverse*/
		width: 80%;
		height: 25%;
		justify-content: center;
	}
	
	.arrowsButton{
		display: flex;
		width: 30.5%;
		height: 100%;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		border-radius: 20rpx;
	}
	
	.HornLightButton{
		display: flex;
		width: 80%;
		height: 20%;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		border-radius: 40rpx;
	}
	
	.hover{
		background-color: #c7c7c7;
	}
	
</style>
