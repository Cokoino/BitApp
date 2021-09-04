/*********************************************************************
uni api使用方法：
1、开启手机蓝牙设备
2、开启搜索蓝牙
3、监听蓝牙新设备事件，找到要链接的蓝牙device id
4、使用device id获取蓝牙service id,蓝牙可能有很多个service id，具体功能请查阅蓝牙规格书
5、使用service id获取蓝牙特征id（广播id、读id、写id等），具体特征id功能请查阅蓝牙规格书
6、依据特性id的作用进行编写特定功能的程序

兼容蓝牙设备：
1、micro:bit v1蓝牙串口服务，参考链接https://lancaster-university.github.io/microbit-docs/ble/uart-service/
   服务-serviceid : 6E400001-B5A3-F393-E0A9-E50E24DCCA9E  //必须要micro:bit蓝牙编程开启串口服务才搜索的得到
   特征-nitifyId  : false
   特征-readId   : 6E400002-B5A3-F393-E0A9-E50E24DCCA9E
   特征-writeId   : 6E400003-B5A3-F393-E0A9-E50E24DCCA9E
2、micro:bit v2蓝牙串口服务
   服务-serviceid : 0000ffe0-0000-1000-8000-00805f9b34fb  //必须要micro:bit蓝牙编程开启串口服务才搜索的得到
   特征-nitifyId  : false
   特征-readId   : 
   特征-writeId   : 0000ffe1-0000-1000-8000-00805f9b34fb
3、济南华茂HM-10C-A与JDY-23串口服务，华茂参考链接http://www.huamaosoft.com/bluetooth.asp?id=0
   服务-serviceid : 0000FFE0-0000-1000-8000-00805F9B34FB
   特征-nitifyId  : ture
   特征-writeId   : 0000FFE1-0000-1000-8000-00805F9B34FB
   通信波特率：9600

功能说明：
1、无需配对，直接搜索蓝牙，然后选择需要配对的蓝牙即可
2、将手机靠近需要链接的蓝牙，即可自动识别链接蓝牙

UUID说明：
1、服务（ServiceId）：
		可以理解为组长，一个组里面至少有一个或多个特性（Characteristic），特性（Characteristic）
        可以理解为组员，不同的服务（Service）应该有不同的编号(UUID)，用以区分不同的服务(Service)。					 
2、特性（CharacteristicId）：
		是依附于某个服务（Service）的，可以理解为组员，每个组员至少要有一个编号（UUID）
		以及一个或多个属性（Property）。
						 
蓝牙发送数据格式：
	起始码 + 数据码 + 结束码 = 0xf0 + 二进制数据 + 0x0f
	起始码与数据码固定，数据码为要发送的数据，数据码必须为二进制数。
*********************************************************************/
class Bluetooth {

	constructor() {
		this.isOpenBle   = false;  //打开蓝牙设备标志
		this.connectFlag = false;  //蓝牙链接成功标志位
		this.deviceList  = [];     //搜索得到的所有设备
		this.deviceId    = "";     //当前成功建立链接蓝牙的设备Id
		this.serviceId   = "";     //当前成功建立链接蓝牙的服务Id
		this.notifyId    = "";     //当前蓝牙广播Id（特征id），保留
		this.writeId     = "";     //当前蓝牙写Id(特征id)
		
		//定义需要链接蓝牙设备的串口服务参数
		this.BtServiceId = {
			HMsoftServiceId : "0000FFE0-0000-1000-8000-00805F9B34FB",
			MicrobitV1ServiceId : "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
			MicrobitV2ServiceId : "0000ffe0-0000-1000-8000-00805f9b34fb"
		};
	}
	//弹窗口显示信息
	showToast(title, Time) {
		uni.showToast({
			title: title,
			icon: 'none',
			'duration': Time
		});
	}
	//开启手机蓝牙模块:
	//主要目的就是检测一下手机蓝牙是否打开
	openBluetoothAdapter() {
		return new Promise((resolve, reject) => {  //异步函数，初始化成功返回res，初始化失败返回err
			uni.openBluetoothAdapter({             //初始化蓝牙模块，其他蓝牙API需在其之后调用
				success: res => {
					this.isOpenBle = true;
					resolve(res);  
				},
				fail: err => {
					this.showToast("Please turn on your phone's Bluetooth", 2000);
					reject(err);  
				},
			});
		});

	}
	//启动蓝牙搜索:用于搜索附近蓝牙设备
	//当连接成功的时候，一定要停止搜索外围设备，因为搜索蓝牙很耗费资源
	startBluetoothDevicesDiscovery() {
		if (!this.isOpenBle) {
			this.showToast("Please turn on your phone's Bluetooth", 2000)
			return;
		}

		let self = this;
		self.deviceList = [];
		setTimeout(() => {
			uni.startBluetoothDevicesDiscovery({
				success: res => {
					console.log("开始监听设备...");
					//监听寻找到新设备的事件
					self.onBluetoothDeviceFound();
					self.showToast("Searching...", 2500);
				},
				fail: res => {
					self.showToast("Search failure" + JSON.stringify(err), 2000);
				},
			})
		}, 300);
	}
	//停止蓝牙搜索：
	stopBluetoothDevicesDiscovery() {
		let self = this;
		return new Promise((resolve, reject) => {
			uni.stopBluetoothDevicesDiscovery({
				success: e => {
					//uni.hideLoading();
					console.log("停止蓝牙设备搜索成功");
				},
				fail: e => {
					//uni.hideLoading();
					self.showToast("Failed to stop searching for the Bluetooth device:" + JSON.stringify(err), 2000);
					//console.log("停止搜索蓝牙设备失败");
				}
			})
		});
	}
	//手机蓝牙监听寻找到新设备事件：请在开启搜索蓝牙后调用此函数
	//API会搜索到设备,这个地方重点就是获取deviceId，是连接蓝牙的重要ID，下一步createBLEConnection用到
	onBluetoothDeviceFound(){
		let self = this;
		uni.onBluetoothDeviceFound(devices => {                  //开启 监听寻找到新设备的事件
			//console.log("发现设备: " + JSON.stringify(devices));  //JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串
			if (!self.deviceList.some(item => {                  //不重复,就添加到devicesList中,
					return item.deviceId === devices.devices[0].deviceId
				})) {
				if (devices.devices[0].name != "") {             //保存蓝牙名称不为空的蓝牙设备参数
					self.deviceList.push   ({ 
						name    : devices.devices[0].name, 
						deviceId: devices.devices[0].deviceId,
						RSSI    : devices.devices[0].RSSI,
					})
					//蓝牙自动链接，当手机靠近蓝牙设备达到一定距离时，依据蓝牙名称和RSSI的强度来判断链接蓝牙设备
					if(devices.devices[0].name === "HMSoft" || devices.devices[0].name === "BBC micro:bit [gavop]" || 
					   devices.devices[0].name === "JDY-23"){
						if(devices.devices[0].RSSI > -48){
							self.createBLEConnection(devices.devices[0].deviceId);
						}
					}
				}
			}
		});
	}
	//连接蓝牙设备：
	//把onBluetoothDeviceFound得到的deviceId传进来，通过此deviceId链接蓝牙，
	//链接成功后，保存此deviceId，下一步onBLEConnectionStateChange还需要用到此deviceId
	createBLEConnection(Id) {
		let deviceId = Id;         //设备deviceId
		let self = this;

		uni.showLoading({
			mask: true,
			title: "Connecting..."
		})
		//console.log(deviceId);
		uni.createBLEConnection({
			deviceId : deviceId,   //这里的deviceId为onBluetoothDeviceFound得到的deviceId
			success: (res) => {
				uni.hideLoading();
				//self.stopBluetoothDevicesDiscovery();  //停止蓝牙搜索
				self.deviceId = deviceId;                //保存成功建立链接的deviceId
				self.connectFlag = true;                 //蓝牙链接成功标志位
				self.showToast("Success", 1000);
				console.log("连接成功:" + self.deviceId);
				setTimeout(() => {                       //必要等待1.5秒以上，否则getBLEDeviceServices为空数据
					self.onBLEConnectionStateChange()    //监听蓝牙连接状态
					self.getBLEDeviceServices();         //获取蓝牙设备所有服务
				}, 1500);
			},
			fail: err => {
				uni.hideLoading();
				self.showToast("Failure", 1000);
				console.log("连接失败:" + JSON.stringify(err));
				self.stopBluetoothDevicesDiscovery();    //停止蓝牙搜索
			}
		})
	}
	
	//监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
	onBLEConnectionStateChange(){
		let self = this;
		uni.onBLEConnectionStateChange(function (res) {
			if(!res.connected){
				 console.log("检测到蓝牙断开")
				 self.showToast("Disconnect", 1000);
				 //当蓝牙断开时清空标记存储
				 self.deviceList  = [];     //搜索得到的所有设备
				 self.deviceId    = "";     //当前成功建立链接蓝牙的设备Id
				 self.serviceId   = "";     //当前成功建立链接蓝牙的服务Id
				 self.writeId     = "";     //当前蓝牙写Id(特征id)
				 self.connectFlag = false;  //蓝牙链接成功标志位
			}
		})
	}

	//获取蓝牙设备所有服务(service)：
	//getBLEDeviceServices里面填的deviceId需要通过createBLEConnection成功与对应设备建立链接的deviceId。这里会获取到多个
	//services uuid，只存储我们需要用到的就行，这个uuid的功能一般硬件厂家会给我们提供，下一步getBLEDeviceCharacteristics用到。
	//注意：使用串口接收数据时要16进制显示才能正确显示数据。
	getBLEDeviceServices() {
		let _serviceList = [];
		let deviceId = this.deviceId;   //变量赋值成功建立链接的deviceId
		let self = this;
				
		uni.getBLEDeviceServices({
			deviceId : deviceId,        //这里的deviceId需要通过createBLEConnection成功与对应设备建立链接的deviceId
			success: res => {
				//uni.hideLoading();
				for (var s = 0; s < res.services.length; s++) {
					//判断是否为我们定义需要的serviceId
					if(self.BtServiceId.HMsoftServiceId === res.services[s].uuid ||
					   self.BtServiceId.MicrobitV1ServiceId === res.services[s].uuid ||
					   self.BtServiceId.MicrobitV2ServiceId === res.services[s].uuid){
						self.serviceId = res.services[s].uuid;   //保存ServiceId
						console.log("获取设备ServiceId成功:" + self.serviceId);
						self.getBLEDeviceCharacteristics();      //获取蓝牙特征
					}
				}
				//console.log("获取设备ServiceId成功:" + JSON.stringify(res));
			},
			fail: err => {
				//uni.hideLoading();
				console.log("获取设备Services失败:" + JSON.stringify(err));
			},
		})
	}

	//获取蓝牙设备某个服务中所有特征值(characteristic)：
	//需要传2个参数，为传给getBLEDeviceServices的deviceId，和getBLEDeviceServices成功获取的serviceId,
	//获取的特征值的uuid才是我们真正需要操作的uuid，这里只获取串口serviceId的writeId
	//如果不需要接收来自蓝牙设备的数据，搜索链接蓝牙初始化到此完成，如要接收来自蓝牙设备的数据，需要启用notifyBLECharacteristicValueChange
	getBLEDeviceCharacteristics() {
		let deviceId = this.deviceId;
		let serviceId = this.serviceId;

		let self = this;
		return new Promise((resolve, reject) => {
			uni.getBLEDeviceCharacteristics({
				deviceId : deviceId,
				serviceId : serviceId,
				success: res => {
					for (let _obj of res.characteristics) {
						if (_obj.properties.write) {    //获取writeId
							self.writeId = _obj.uuid;   //保存串口writeId
							//uni.setStorageSync('writeId', self.writeId);
							console.log("获取串口服务中的写特征值成功：" + self.writeId);
						}
					}
					//console.log("获取服务中所有特征值成功" + JSON.stringify(res));
				},
				fail: err => {
					console.log("获取串口服务中的写特征值失败" + JSON.stringify(err));
					reject(err);
				}
			})
		});
	}

	//启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用， 
	//另外，必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 characteristicValueChange 事件。
	//接收BLE设备发送过来的数据，此函数保留，暂时没用到。
	notifyBLECharacteristicValueChange() {
		let deviceId = this.deviceId;
		let serviceId = this.serviceId;
		let characteristicId = this.notifyId;

		uni.notifyBLECharacteristicValueChange({
			state: true,       // 启用 notify 功能
			deviceId,          //这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			serviceId,         //这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			characteristicId,  //这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取，为readId
			success(res) {
				uni.onBLECharacteristicValueChange(function(res) {

				});
			},
			fail(res) {
				console.log('notifyBLECharacteristicValueChange failed:' + res.errMsg);
			}
		});
	}
	
	//向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用。
	//并行调用多次会存在写失败的可能性。
	//APP不会对写入数据包大小做限制，但系统与蓝牙设备会限制蓝牙4.0单次传输的数据大小，超过最大字节数后会发生写入错误，建议每次写入不超过20字节。
	//若单次写入数据过长，iOS 上存在系统不会有任何回调的情况（包括错误回调）。
	//安卓平台上，在调用 notifyBLECharacteristicValueChange 成功后立即调用 writeBLECharacteristicValue 接口，在部分机型上会发生 10008 系统错误。
	writeBLECharacteristicValueArray(arrayBuffer) {  
		let deviceId = this.deviceId;
		let serviceId = this.serviceId;
		let characteristicId = this.writeId;
		let self = this;
		const buffer = new ArrayBuffer(arrayBuffer.length)      //ArrayBuffer是字节数组
		const dataView = new DataView(buffer)                   //通过DataView对象来操作字节数组
		for (let i=0;i<arrayBuffer.length;i++){
		        dataView.setUint8(i, arrayBuffer[i]);
			}
		uni.writeBLECharacteristicValue({
			deviceId,
			serviceId,
			characteristicId,
			value: buffer,
			success(res) {
				console.log('message发送成功:' + arrayBuffer);
			},
			fail(err) {
				console.log('message发送失败', JSON.stringify(err));
				//self.showToast("Sending failure", 800);
			}
		});
	}
	
	//断开与低功耗蓝牙设备的连接。
	closeBLEConnection() {
		let self = this;
		let deviceId = this.deviceId;
		uni.closeBLEConnection({
			deviceId,
			success: res => {
				console.log('断开低功耗蓝牙成功:' + res.errMsg);
				self.showToast("Disconnect", 1000);
			},
			fail: e => {
				console.log('断开低功耗蓝牙成功，错误码：' + e.errCode);
			}
		})
	}
	
	//关闭手机蓝牙模块
	closeBluetoothAdapter() {
		uni.closeBluetoothAdapter({
			success: res => {
				console.log("关闭蓝牙模块", JSON.stringify(res))
			}
		});
	}
}

export default Bluetooth;
