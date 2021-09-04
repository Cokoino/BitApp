<template>
	<view class="content">
		<!-- hover-start-time: 10;   按住后多久出现点击态，单位毫秒
		     hover-stay-time=100;    手指松开后点击态保留时间，单位毫秒-->
		<view class="return" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="returnClick">
			<image class="Image" src="/static/button/return.png"> </image>
		</view>
		<view class="leftBlock">
			<view class="LCR">
				<view class="arrowsButton" style="background-color: #FFF0F0"></view>
				<view class="arrowsButton"  hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/Button_Up.png" @click="BLEsend(1)"> </image>
				</view>
				<view class="arrowsButton" style="background-color: #FFF0F0">
					<view v-if="displayXYZ" class="displayXYZ">
						<text>x:{{x}}</text>
						<text>y:{{y}}</text>
						<text>z:{{z}}</text>
					</view>
				</view>
			</view>
			<view class="LCR">
				<view class="arrowsButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/Button_Left.png" @click="BLEsend(2)"> </image>
				</view>
				<view class="arrowsButton" style="border-radius: 50rpx;" hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/button_yellow.png" @click="BLEsend(3)"> </image>
				</view>
				<view class="arrowsButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/Button_Right.png" @click="BLEsend(4)"> </image>
				</view>
			</view>
			<view class="LCR">
				<view class="arrowsButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
					<image class="Image" src="/static/button/Button_Download.png" @click="BLEsend(5)"> </image>
				</view>
			</view>
		</view>
		<view class="centerBlock">
			<view class="HornLightButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
				<image style="width:92%; height:92%;" src="/static/button/add.png" @click="BLEsend(6)"> </image>
			</view>
			<view class="HornLightButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
				<image style="width:92%; height:92%;" src="/static/button/sub.png" @click="BLEsend(7)"> </image>
			</view>
			<view class="HornLightButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
				<image style="width:100%; height:100%;" src="/static/button/car_light.png" @click="BLEsend(8)"> </image>
			</view>
			<view class="HornLightButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
				<image style="width:92%; height:92%;" src="/static/button/horn.png" @click="BLEsend(9)"> </image>
			</view>
		</view>
		<view class="rightBlock">
			<view class="right-nav">
				<view class="right-nav-pad" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="controlSelect(1)">
					<image class="Image" src="/static/button/Control_Panel.png"> </image>
				</view>
				<view class="right-nav-pad" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="controlSelect(2)">
					<image class="Image" src="/static/button/Color_Meter.png"> </image>
				</view>
				<view class="right-nav-pad" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="controlSelect(3)">
					<image class="Image" src="/static/button/music.png"> </image>
				</view>
			</view>
			<view class="right-pad">
				<view v-if="changeBlock == 1" class="Block">
					<view class="controlRow">
						<!-- 三目运算：目标=“条件？数据1：数据2 条件如果为真，目标等于数据1；如果条件为假，目标等于数据2
						<view class="controlButton" :style="activeSonar?'background-color:#c7c7c7;':''" @click="BLEsend(10)"> -->
						<view class="controlButton" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="BLEsend(10)">
							<image class="Image" src="/static/button/sonar.png"></image>
						</view>
						<view class="controlButton" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="BLEsend(11)">
							<image class="Image" src="/static/button/button_on.png"></image>
						</view>
						<view class="controlButton" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="BLEsend(12)">
							<image class="Image" src="/static/button/Way.png"></image>
						</view>
					</view>
					<view class="controlRow">
						<view class="controlButton" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="BLEsend(13)">
							<image class="Image" src="/static/button/follow.png"></image>
						</view>
						<view class="controlButton" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="BLEsend(14)">
							<image class="Image" src="/static/button/button_on.png"></image>
						</view>
						<view class="controlButton" hover-class="hover" hover-start-time=5 hover-stay-time=100 @click="accelerometer">
							<image class="Image" src="/static/button/xyz.png"></image>
						</view>
					</view>
					<view class="controlRow">
						<slider style="width: 98%;" value="90" max="180" @change="sliderChange" show-value />
					</view>
				</view>
				<view v-if="changeBlock == 2" class="Block">
					<view class="colorRow">
						<view class="colorButton1" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/button_red.png" @click="BLEsend(15)"></image>
						</view>
						<view class="colorButton1" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/button_green.png" @click="BLEsend(16)"></image>
						</view>
						<view class="colorButton1" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/button_blue.png" @click="BLEsend(17)"></image>
						</view>
					</view>
					<view class="colorRow">
						<view class="colorButton1" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/button_purple.png" @click="BLEsend(18)"></image>
						</view>
						<view class="colorButton1" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/exchange.png" @click="BLEsend(19)"></image>
						</view>
						<view class="colorButton1" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/button_seagreen.png" @click="BLEsend(20)"></image>
						</view>
					</view>
					<view class="colorRow">
						<view class="colorButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/circle_yellow.png" @click="BLEsend(21)"></image>
						</view>
						<view class="colorButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/circle_grey.png" @click="BLEsend(22)"></image>
						</view>
						<view class="colorButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/circle_purple.png" @click="BLEsend(23)"></image>
						</view>
					</view>
				</view>
				<view v-if="changeBlock == 3" class="Block">
					<view class="pianoNav">
						<view class="pianoNavButton">1</view>
						<view class="pianoNavButton">2</view>
						<view class="pianoNavButton">3</view>
						<view class="pianoNavButton">4</view>
						<view class="pianoNavButton">5</view>
						<view class="pianoNavButton">6</view>
						<view class="pianoNavButton">7</view>
					</view>
					<view class="pianoPad">
						<view class="pianoButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/Orange_button.png" @click="BLEsend(24)"></image>
						</view>
						<view class="pianoButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/Dark_blue_button.png" @click="BLEsend(25)"></image>
						</view>
						<view class="pianoButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/Orange_button.png" @click="BLEsend(26)"></image>
						</view>
						<view class="pianoButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/Dark_blue_button.png" @click="BLEsend(27)"></image>
						</view>
						<view class="pianoButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/Orange_button.png" @click="BLEsend(28)"></image>
						</view>
						<view class="pianoButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/Dark_blue_button.png" @click="BLEsend(29)"></image>
						</view>
						<view class="pianoButton" hover-class="hover" hover-start-time=5 hover-stay-time=100>
							<image class="Image" src="/static/button/Orange_button.png" @click="BLEsend(30)"></image>
						</view>
					</view>
				</view>
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
	let x, y, z;
	
	export default {
		data() {
			return {
				changeBlock: 1,
				displayXYZ : false,
				x : 0,
				y : 0,
				z : 0,
			}
		},
		//页面加载时
		onLoad() {
			let self = this;
			uni.startAccelerometer();                   //开始监听加速度数据
			uni.onAccelerometerChange(function (res) {  //监听加速度数据,重复调用会生成多个监听对象
				//限制数据在-10与+10之间,保留小数点后1位数据
			    self.x = res.x > 10 ? 10 : res.x < -10 ? -10 : (Math.round(res.x*10)/10);  
				self.y = res.y > 10 ? 10 : res.y < -10 ? -10 : (Math.round(res.y*10)/10);  
				self.z = res.z > 10 ? 10 : res.z < -10 ? -10 : (Math.round(res.z*10)/10);  
			    if(bluetooth.connectFlag){
					//丢掉重复的数据
					//if((self.x != BleArrayBuffer[1]) || (self.y != BleArrayBuffer[2]) || (self.z != BleArrayBuffer[3])){
						// 向蓝牙设备发送数据: 0xff, x, y, z, 0x14, 0xff
						BleArrayBuffer = [];
						BleArrayBuffer[0] = 0xff;
						BleArrayBuffer[1] = 0x14;
						//数据如果为负数就取模乘以10加上100，当设备接收端获得大于100的数据就减100再除以10，然后再转为负值得到原始数据
						//当数据为正数就直接乘以10，当设备端接收到的数据小于100，就直接除以10即可得到原始数据
						BleArrayBuffer[2] = self.x < 0 ? (100-(self.x*10)) : self.x*10;
						BleArrayBuffer[3] = self.y < 0 ? (100-(self.y*10)) : self.y*10;
						BleArrayBuffer[4] = self.z < 0 ? (100-(self.z*10)) : self.z*10; 
						BleArrayBuffer[5] = 0xff;
						bluetooth.writeBLECharacteristicValueArray(BleArrayBuffer);	
					//}
			    }
			});
			uni.stopAccelerometer();  //停止监听加速度数据
		},
		//页面卸载时
		onUnload: function() {
			//uni.stopAccelerometer();     //停止监听加速度数据
			uni.offAccelerometerChange();  //取消监听加速度数据
		},
		methods: {
			returnClick() {
				//关闭当前页面，返回上一层或者多层页面
				uni.navigateBack({
				    delta: 1
				});
			},
			controlSelect(mode){
				switch(mode){
					case 1: this.changeBlock = mode; break;
					case 2: this.changeBlock = mode; break;
					case 3: this.changeBlock = mode; break;
					default: break;
				}
			},
			//发送普通按键数据
			// 向蓝牙设备发送数据: 0xff, command, 0x00, 0xff
			BLEsend(command) {
				if(bluetooth.connectFlag){
					BleArrayBuffer = [];
					BleArrayBuffer[0] = 0xff;
					BleArrayBuffer[1] = 0x00;
					BleArrayBuffer[2] = command;
					BleArrayBuffer[3] = 0xff;
					bluetooth.writeBLECharacteristicValueArray(BleArrayBuffer);
				}
			},
			//发送加速度数据
			accelerometer(){
				let self = this;
				self.displayXYZ = !self.displayXYZ;
				if(self.displayXYZ){
					uni.startAccelerometer(); //开始监听加速度数据
				}else{
					uni.stopAccelerometer();  //停止监听加速度数据
				}
			},
			//发送滑竿数据
			// 向蓝牙设备发送数据: 0xff, command, 0x01, 0xff
			sliderChange(e){
				if(bluetooth.connectFlag){
					BleArrayBuffer = [];
					BleArrayBuffer[0] = 0xff;
					BleArrayBuffer[1] = 0x0a;
					BleArrayBuffer[2] = e.detail.value;
					BleArrayBuffer[3] = 0xff;
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
		width: 41%;
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
		width: 47%;
		height: 85%;
		justify-content: center;
		align-items: center;
		background-color: #FFF0F0;
	}
	
	.arrowsButton{
		display: flex;
		width: 33%;
		height: 100%;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		border-radius: 20rpx;
	}
	
	.displayXYZ{
		display: flex;
		width: 80%;
		height: 80%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size:18rpx;
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
	
	.right-nav{
		display: flex;
		width: 100%;
		height: 25%;
		flex-direction: row;                /*row/row-reverse/column/column-reverse*/
		justify-content: space-around;      /*flex-start|flex-end|center|space-between|space-around*/
		align-items: center;
	}
	
	.right-nav-pad{
		display: flex;
		width: 19%;
		height: 78%;
		justify-content: center;
		align-items: center;
		border-radius: 25rpx;
	}
	
	.right-pad{
		display: flex;
		width: 98.5%;
		height: 75%;
		flex-direction: row;       /*row/row-reverse/column/column-reverse*/
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
	}
	
	.hover{
		background-color: #c7c7c7;
	}
	
	.Block{
		display: flex;
		flex-direction: column;       /*row/row-reverse/column/column-reverse*/
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.pianoNav{
		display: flex;
		flex-direction: row;       /*row/row-reverse/column/column-reverse*/
		justify-content: center;
		align-items: center;
		height:20%;
		width:100%;
	}
	.pianoNavButton{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 12.8%;
		height: 100%;
		font-size:33rpx;
		color:#2e77e3;
		font-weight:bold;
	}
	
	.pianoPad{
		display: flex;
		flex-direction: row;       /*row/row-reverse/column/column-reverse*/
		justify-content: center;
		align-items: center;
		height:80%;
		width:95%;
	}
	.pianoButton{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 13.5%;
		height: 90%;
	}
	
	.colorRow{
		display: flex;
		flex-direction: row;                /*row/row-reverse/column/column-reverse*/
		justify-content: space-around;      /*flex-start|flex-end|center|space-between|space-around*/
		align-items: center;
		width: 100%;
		height: 33%;
	}
	
	.colorButton{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 21%;
		height: 80%;
		border-radius: 40rpx;
	}
	
	.colorButton1{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 19.5%;
		height: 78%;
		border-radius: 40rpx;
	}
	
	.controlRow{
		display: flex;
		flex-direction: row;                /*row/row-reverse/column/column-reverse*/
		justify-content: space-around;      /*flex-start|flex-end|center|space-between|space-around*/
		align-items: center;
		width: 100%;
		height: 33%;
	}
	
	.controlButton{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 22%;
		height: 85%;
		border-radius: 15rpx;
	}
</style>
