<script>
	export default {
		globalData: {  //定义全局变量
		    ble: 0
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
			height: 100%;
			width: 100%;
	}
	.content{
		display: flex;
		flex-direction: row;       /*row\row-reverse\column\column-reverse*/
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		height: 100%;
		width: 100%;
	}
	.return{
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 7.5%;
		bottom: 82.5%;
		left: 0.1%;
		right: 91%;
		border-radius: 10rpx;	
	}
	.LCR{
		display: flex;
		width: 100%;
		height: 28%;
		flex-direction: row;       /*row/row-reverse/column/column-reverse*/
		justify-content: center;
		align-items: center;
		background-color: #FFF0F0;
		border-radius: 20rpx;
	}
	.Image{
		width: 98%;
		height: 98%;
	}
</style>
