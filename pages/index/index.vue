<template>
	<view class="content">
		<!-- 悬浮按钮 -->
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction" @trigger="trigger" @fabClick="fabClick"/>
		<!-- logo -->
			
		<!--顶部栏、轮播图、底部栏 -->
		<view class="navigationBar"></view>
		<view class="Content" hover-class="hoverClass">
			<view class="logo">
				<image style="width:75%; height:75%;" src="/static/icon/LOGO.png"></image>
			</view>
			<swiper class="Swiper" indicator-dots=ture indicator-active-color=#eee5e2>
				<swiper-item class="Swiper-item" v-for="(item,index) in displayGoods" :key="index" @click="Page(index)">
					<image style="height:100%; width:100%;" :src="item.path"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="taBar">
			<image class="URL" src="/static/icon/internet.png"></image>
			<text space="nbsp">www.cokoino.com  BitApp v1.0</text>
		</view>
		
		<!-- 遮罩 -->
		<view v-if="maskShow" class="uni-mask uni-flex uni-column" @click="maskclose">
			<scroll-view class="uni-scroll_box" scroll-y="ture" show-scrollbar="ture">
				<view class="uni-title"> {{deviceList.length}} devices have been found </view>
				<view class="uni-list-box" v-for="(item,index) in deviceList" :key="index">
					<button class="uni-list_name" @click="onConn(item)">{{item.name}}</button>
					<view class="uni-list_item">UUID : {{item.deviceId }}, RSSI : {{ item.RSSI }}dBm</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	//引用蓝牙文件
	import Bluetooth from '@/JS/bluetooth.js'
	let bluetooth = new Bluetooth();
	
	//引用悬浮按钮文件
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	
	//页面设定屏幕方向
	//plus.screen.lockOrientation("landscape-primary");     //仅支持横屏，Home键在右侧 
	//plus.screen.lockOrientation('landscape-secondary'); //仅支持横屏（反向），Home键在左侧
	//plus.screen.lockOrientation("portrait-primary");    //仅支持竖屏
	//plus.screen.lockOrientation("portrait-secondary");  //仅支持竖屏（反向），上下颠倒 
		
	export default {
		//定义悬浮按钮组件
		components: {
					uniFab
		},
		data() {
			return {
				//显示参数
				displayGoods:[
					{
						path: '/static/goods/bear-car.jpg',
					},
					{
						path: '/static/goods/robot.jpg',
					},
					{
						path: '/static/goods/arm.jpg',
					}
				],
				//悬浮按钮参数设定
				horizontal: 'left',            //left or right
				vertical  : 'top',             //top or bottom
				direction : 'vertical',      //vertical or horizontal
				pattern: {
					color          : '#7A7E83',  //字体颜色
					backgroundColor: '#fff',     //背景颜色
					selectedColor  : '#007AFF',  //选中时字体颜色
					buttonColor    : '#007AFF'   //悬浮按钮颜色
				},
				content: [
					{
						iconPath: '/static/icon/bluetooth_off.png',
						selectedIconPath: '/static/icon/bluetooth_on.png',
						text: 'BLE',
						active: false
					},
					{
						iconPath: '/static/icon/Document_write.png',
						selectedIconPath: '/static/icon/Document_write.png',
						text: 'ME',
						active: false
					}
				],
				//用于蓝牙
				currDev   : false, //蓝牙链接状态
				deviceList: [],    //List of devices
				maskShow  : false,
			}
		},
		//页面加载时
		onLoad() {
			let self = this;		
			bluetooth.openBluetoothAdapter();
			//设定一个定时器。按照指定的周期（1000毫秒）来执行注册的回调函数
			self.intervalID = setInterval(() => {
				self.currDev = bluetooth.connectFlag;  //获取蓝牙链接状态
				if(self.currDev == true){
					self.content[0].active = true;
				}else{
					self.content[0].active = false;
				}
			}, 1000)
		},
		//页面卸载时
		onUnload: function() {
			bluetooth.closeBLEConnection();
			bluetooth.closeBluetoothAdapter();
		},
		//自定义的函数
		methods: {
			//悬浮按钮点击触发函数
			fabClick() {
				//this.currDev = bluetooth.connectFlag;  //获取蓝牙链接状态
			},
			//悬浮按钮选项点击触发函数
			trigger(e) {
				let self = this
				//this.content[e.index].active = !e.item.active
				if(e.index == 0){
					if(!self.currDev){
						self.searchBle();
					}else{
						self.closeBLEConnection();
					}
				}
				if(e.index == 1){
					//跳转到readme页面
					uni.navigateTo({
					    url: '/pages/readme/readme'
					});
				}
			},
			
			//关闭遮罩		
			maskclose(){
				this.maskShow = false;
				this.deviceList = [];
				//停止蓝牙设备搜索
				bluetooth.stopBluetoothDevicesDiscovery();  
			},
			//搜索蓝牙设备
			searchBle() {
				let self = this
				self.deviceList = [];
				self.maskShow = true;
				//开始搜寻附近的蓝牙外围设备
				bluetooth.startBluetoothDevicesDiscovery();
				self.deviceList = bluetooth.deviceList;
			},
			//链接蓝牙：点击列出来的蓝牙名称，执行此函数
			onConn(item) {
				bluetooth.createBLEConnection(item.deviceId);
			},
			//断开与低功耗蓝牙设备的连接
			closeBLEConnection() {
				bluetooth.closeBLEConnection();
			},
			
			//跳转页面函数
			Page(index) {
				getApp().globalData.ble = bluetooth;  //赋值给全局变量，定义在App.vue文件
				switch(index){
					case 0:
						uni.navigateTo({
							url: '/pages/Car/Car'
						}); break;
					case 1:
						uni.navigateTo({
							url: '/pages/Car/Car'
						}); break;
					case 2:
						uni.navigateTo({
							url: '/pages/Car_Claw/Car_Claw'
						}); break;
					default : break;
				}
			},
		},
	}
</script>

<style>
	.content{
		display: flex;
		flex-direction: column;       /*row\row-reverse\column\column-reverse*/
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		height: 100%;
		width: 100%;
	}
	
	.navigationBar{
		background-color: #fff;
		width: 100%;
		height: 7.5%;
	}
	
	.Content{
		/*background-color: #ffebe4;*/
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;       /*row\row-reverse\column\column-reverse*/
		justify-content: center;
		width: 50%;
		height: 85%;
	}
	
	.controls-title{
		width: 100rpx;
		height: 50rpx;
	}
	
	.Swiper{
		display: flex;
		flex-direction: column;       /*row\row-reverse\column\column-reverse*/
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	
	.Swiper-item{
		display:flex; 
		justify-content: center;
	}
	
	.Image{
		width: 100%;
		height: 100%;
	}
	
	.URL{
		width: 25rpx;
		height: 25rpx;
	}
	.taBar{
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ffffff;
		color:#646464;
		font-size: 13px;
		width: 100%;
		height: 7.5%;
	}
	
	/*遮罩*/
	.uni-title {
		/* width: 100%; */
		/* height: 80rpx; */
		font-size: 20rpx;
		text-align: center;
	}
	.uni-mask {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		background: rgba(0, 0, 0, 0.6);
		padding: 0 30rpx;
		box-sizing: border-box;
	}
	.uni-scroll_box {
		width: 70%;
		height: 75%;
		background: #fff;
		border-radius: 20rpx;
	}
	.uni-list-box {
		margin: 0 20rpx;
		padding: 15rpx 0;
		border-bottom: 10px #f5f5f5 solid;
		border: 10px #f5f5f5 solid;
		box-sizing: border-box;    /*box-sizing属性允许您以特定的方式定义匹配某个区域的特定元素。*/
	}
	.uni-list_name {
		font-size: 20rpx;
		color: #333;
	}
	.uni-list_item {
		font-size: 16rpx;
		color: #555;
		line-height: 1.5;
		text-align: center;
	}
	
	.logo{
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 7.5%;
		bottom: 70%;
		left: 85%;
		right: 1%;	
	}
</style>
