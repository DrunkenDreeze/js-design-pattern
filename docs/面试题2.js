/*
	1.某停车场，分3层，每层100车位
	2.每个车位都能监控到车辆的驶入和离开
	3.车辆进入前，显示每层的空域车位数量
	4.车辆进入时，摄像头可识别车牌号和时间
	5.车辆出来时，出口显示器显示车牌号和停车时长
*/


/*
	分析：
	类 ： 停车场  层  车位
	类 ： 车 
	车位
	车：方法-进入  方法离开
	停车场： 方法-每层空余的数量
	类：摄像头
	类：显示器
*/



// 代码
// 车 类
class Car {
	constructor(number) {
		this.number = number
	}
}

// 摄像头 类
class Camera{
	shot(car) {
		return {
			num: car.number,
			inTime: Date.now()
		}
	}
}

// 出口显示屏 类
class Screen {
	show(car, inTime) {
		console.log(`车牌号 ${car.number}`);
		console.log(`停车时间 ${Date.now() - inTime}`)
	}
}

// 停车场 类
class Park {
	constructor(floors) {
		this.floors = floors || [];
		
		this.camera = new Camera();
		this.screen = new Screen();
		this.carList = {} // 存储摄像头拍摄返回的车辆信息
	}
	
	in(car) {
		// 通过摄像头获取信息
		const info = this.camera.shot(car);
		// 停到某个停车位
		const i = parseInt(Math.random() * 100 % 100);
		const place = this.floors[0].places[i];
		place.in();
		info.place = place
		// 记录信息
		this.carList[car.number] = info
	}
	
	out(car) {
		// 获取信息
		const info = this.carList[car.number];
		// 将停车位清空
		const place = info.place;
		place.out()
		// 显示时间
		this.screen.show(car, info.inTime)
		// 清空记录，避免内存泄漏
		delete this.carList[car.number]
	}
		
	emptyNum() {
		return this.floors.map(floor => {
			return `${floor.index} 层还有 ${floor.emptyPlaceNum()} 个空余车位`
		}).join('\n')
	}
}

// 层 类
class Floor {
	constructor(index, places) {
		this.index = index;
		this.places = places || []
	}
	emptyPlaceNum() {
		let num = 0;
		this.places.forEach(p => {
			if(p.empty) {
				num = num + 1
			}
		})
		return num
	}
}

// 车位 类
class Place {
	constructor() {
		this.empty = true
	}
	
	in() {
		this.empty = false
	}
	out() {
		this.empty = true;
	}
}



// 测试
const floors = [];
for ( let i = 0; i < 3; i++ ) {
	const places = [];
	for ( let j = 0; j < 100; j ++) {
		places[j] = new Place()
	}
	floors[i] = new Floor(i+1, places);
}
const park = new Park(floors);

// 初始化车辆
const car1 = new Car(12345);
const car2 = new Car(23456);
const car3 = new Car(34567);

console.log('第一辆车进入');
console.log(park.emptyNum())
park.in(car1);
console.log('第二辆车进入');
console.log(park.emptyNum())
park.in(car2);
console.log('第一辆车离开');
park.out(car1);
console.log('第二辆车离开');
park.out(car2);

console.log('第三辆车进入');
console.log(park.emptyNum())
park.in(car3);
console.log('第三辆车离开');
park.out(car3);


