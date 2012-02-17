/**************util*************/
//基本的工具
Tank.Point = function(x, y){
    if(x instanceof Tank.Point) {
        this.x = x.x;
        this.y = x.y;
    }else{
        this.x = x;
        this.y = y;
    }
}
Tank.collide = function(a, b){
    if((a.loc_.x + a.size_.x > b.loc_.x )&&( a.loc_.x < b.loc_.x + b.size_.x)
            && (a.loc_.y + a.size_.y > b.loc_.y) && (a.loc_.y < b.loc_.y + b.size_.y)){ 
        return true;

    }
    else return false;
}
// a% 的概率返回true
Tank.rand = function(a){
    if(Math.random()*100 < a) return true;
    return false;
}
/*put b in the center of a*/
Tank.center = function(a, b ){
    b.loc_.x = a.loc_.x + a.size_.x/2 - b.size_.x/2;
    b.loc_.y = a.loc_.y + a.size_.y/2 - b.size_.y/2;
}
Tank.createImg = function(src, x, y, w, h){
    var img = new Image();
    img.src = src;
	if(x){
		img.sprite_ = {};
		img.sprite_.x = x;
		img.sprite_.y = y;
		img.sprite_.w = w;
		img.sprite_.h = h;
	}
    return img;
}
Tank.createImgs = function(src, x, y, w, h, mount, length){
	var result = [];
	for(var i = 0; i < mount; i++){
		result.push(Tank.createImg(src, x + i*length, y, w, h));
	}
	return result;
}
//ab之间的直线距离
Tank.getDistance = function(a, b){
    return parseInt(Math.sqrt( Math.pow((a.loc_.x - b.loc_.x), 2) + Math.pow((a.loc_.y - b.loc_.y), 2)));
}


//b相对于a的方向
//原理：计算正切值
Tank.getDirect = function(a, b){
	var p = new Tank.Point(b.x - a.x, a.y - b.y);
	if(p.x >= 0 && p.y > 0){
		var t = Math.atan(p.x/p.y);
		if(t < Math.atan(Math.PI/8)) return 0;
		if(t > Math.atan(Math.PI/8 * 3)) return 2;
		else return 1;
	}else if(p.x > 0 && p.y <= 0){
		p.y = -1 * p.y;
		var t = Math.atan(p.y/p.x);
		if(t < Math.atan(Math.PI/8)) return 2;
		if(t > Math.atan(Math.PI/8 * 3)) return 4;
		else return 3;
	}else if(p.x < 0 && p.y < 0){
		p.y = -1 * p.y;
		p.x = -1 * p.x;
		var t = Math.atan(p.x/p.y);
		if(t < Math.atan(Math.PI/8)) return 4;
		if(t > Math.atan(Math.PI/8 * 3)) return 6;
		else return 5;
	}else if(p.x < 0 && p.y > 0){
		p.x = -1 * p.x;
		var t = Math.atan(p.y/p.x);
		if(t < Math.atan(Math.PI/8)) return 6;
		if(t > Math.atan(Math.PI/8 * 3)) return 0;
		else return 7;
	}
	
	return 0;
}

//a是否在数组b中
Tank.inArray = function (elm, arr){
	for(var i in arr) if(arr[i] == elm) return true;
	return false;
}

//基于网格的A*寻路算法, f=g+h
Tank.path = function (start, end, map){
	var open = [];
	var close = [];
	open.push(start);
	
	//寻找open中最小值
	var min = Tank.path.min(open);
	close.push(open[min]);
	open.splice(min, 1);
	
}
//A*算法的私有函数
Tank.path.min = function(arr){
	if(!arr[0]) return null;
	var min = 0;
	for(var i in arr)
		if(arr[i].f <= arr[min].f) min = i;
	return min;
}
Tank.path.cal = function(start, end, map){
	var result = [];
	if(start.y - 1 >=0 && map[start.x][start.y-1] == 0){
		var p = new Tank.Point(start.x, start.y -1);
		p.f = Tank.path.f(p, start, end);
	}
}
Tank.path.f = function(p, start, end){
	return Tank.path.g(p, start) + Tank.path.h(p, end);
}
Tank.path.g = function(p, start){
	return Math.abs(p.x - start.x) + Math.abs(p.y - start.y);
}
Tank.path.h = function(p ,end){
	return Math.abs(p.x - end.x) + Math.abs(p.y - end.y);
}