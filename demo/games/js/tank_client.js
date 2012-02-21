
/***************TankClient**************/
Tank.decorate= function(ca){
    tank = new Tank.TankClient();
    tank.decorate(ca);
}
Tank.TankClient = function(){
    Tank.Panel.init(goog.dom.getElement("panel"));
    Tank.canvas_ = null;
    Tank.size_ = new Tank.Point(800, 600);
    Tank.refresh_ = 50;
    Tank.window_ = document;
    Tank.listenBody_ = document;
    Tank.timer_ = new goog.Timer(Tank.refresh_);
    Tank.status_ = "stop"; //stop,run, pause
    Tank.globalMessage_ = null;
}
goog.inherits(Tank.TankClient, goog.ui.Component);
Tank.TankClient.prototype.decorateInternal = function(element){
    this.element_ = element;
    this.canvas_ = Tank.canvas_ = this.element_.getContext("2d");
    element.style.width = Tank.size_.x;
    element.style.height = Tank.size_.y;
    this.init();
}

Tank.TankClient.prototype.init = function(){
    //test
    Tank.globalMessage_ = new Tank.Message("PAUSE", null, null, "rgb(255, 0, 0)", -1)
    this.sceneManager_ = Tank.SceneManager;
    this.sceneManager_.push(Tank.globalMessage_);
    this.mapManager_ = Tank.MapManager;

    var lastStyle = this.canvas_.fillStyle;
    this.canvas_.fillStyle = "rgb(0, 0, 0)";
    this.canvas_.fillText("HTML5 GAME v0.1。", 300, 200);
    this.canvas_.fillStyle = "rgb(255, 0, 0)";
    this.canvas_.fillText("" +
            "按键说明： 方向键移动，A 发攻击，s使用魔法，P暂停游戏，" +
            "未完，待续>>" +
            "", 100, 250);
	this.canvas_.fillText("" +
		"声明：所有图片均来自网络。" +
		"", 100, 500);
    this.canvas_.fillStyle = lastStyle;
	this.loadImg();
}
Tank.TankClient.imgsLoadedCount_ = 0;
Tank.TankClient.imgsPreload_ = new goog.structs.Map();	//需要预加载的图片
//预加载图片，加载完成后才能开始游戏
Tank.TankClient.prototype.loadImg = function(){
	var imgLoader = new goog.net.ImageLoader();
	var imgs = Tank.TankClient.imgsPreload_;
	imgs.set("firing.png", "img/firing.png");
	imgs.set("firing2.png", "img/firing2.png");
	imgs.set("standing.png", "img/standing.png");
	imgs.set("sword.png", "img/sword.png");
	imgs.set("sword2.png", "img/sword2.png");
	imgs.set("walking.png", "img/walking.png");
	imgs.set("zombie-attack.png", "img/zombie-attack.png");
	imgs.set("zombie-stand.png", "img/zombie-stand.png");
	imgs.set("zombie-walking.png", "img/zombie-walking.png");
	imgs.set("zombie2-attack.png", "img/zombie2-attack.png");
	imgs.set("zombie2-stand.png", "img/zombie2-stand.png");
	imgs.set("zombie2-walking.png", "img/zombie2-walking.png");
	imgs.set("treea1.png", "img/walls/treea1.png");
	imgs.set("treea2.png", "img/walls/treea2.png");
	imgs.set("treeb1.png", "img/walls/treeb1.png");
	imgs.set("treeb2.png", "img/walls/treeb2.png");
	imgs.set("rocka1.png", "img/walls/rocka1.png");
	imgs.set("rocka2.png", "img/walls/rocka2.png");
	imgs.set("rockb1.png", "img/walls/rockb1.png");
	imgs.set("rockb2.png", "img/walls/rockb2.png");
	imgs.set("bullet.png", "img/bullets/bullet.png");
	imgs.set("bullets.png", "img/bullets/bullets.png");
	imgs.set("equip0.png", "img/equips/equip_0.gif");
	imgs.set("equip1.png", "img/equips/equip_1.jpg");
	imgs.set("equip2.png", "img/equips/equip_2.jpg");
	imgs.set("equip3.png", "img/equips/equip_3.jpg");
	imgs.set("10.gif", "img/bullets/10.gif");
	
	var keys = imgs.getKeys();
    for (var i = 0; i < keys.length; i++) {
      imgLoader.addImage(keys[i], imgs.get(keys[i]));
    }
	
	var TEST_EVENT_TYPES = [
		goog.events.EventType.LOAD,
		goog.net.EventType.COMPLETE,
		goog.net.EventType.ERROR
	];
	this.getHandler().listen(imgLoader, TEST_EVENT_TYPES,
        this.handleImageLoaderEvent);
	
	imgLoader.start();
}

Tank.TankClient.prototype.handleImageLoaderEvent = function(e){
	var count = ++ Tank.TankClient.imgsLoadedCount_;
	this.canvas_.fillStyle = "rgb(255, 255, 0)";
    this.canvas_.fillRect(100, 260, 600, 100);
	this.canvas_.fillStyle = "rgb(255, 0, 0)";
	this.canvas_.fillText("正在加载图片，网速较慢请稍后…… ", 100, 300)
    this.canvas_.fillStyle = "rgb(0, 255, 0)";
    this.canvas_.fillRect(100, 310, 300, 20);
    this.canvas_.fillStyle = "rgb(0, 0, 255)";
    this.canvas_.fillRect(100, 310, parseInt(300 * count / Tank.TankClient.imgsPreload_.getKeys().length), 20);
    this.canvas_.fillStyle = "rgb(0, 0, 0)";
    this.canvas_.fillText(parseInt(count / Tank.TankClient.imgsPreload_.getKeys().length * 100) + "%", 250, 325);

	if(count >= Tank.TankClient.imgsPreload_.getKeys().length) {

        this.canvas_.fillStyle = "rgb(255, 0, 0)";
		this.canvas_.fillText("ok！按空格键开始游戏！", 100, 350);
		this.afterImgLoaded();
	}
}
Tank.TankClient.prototype.afterImgLoaded = function(){
    if(!this.alreadyBind_){
        this.getHandler().listen(Tank.timer_, goog.Timer.TICK, this.act);
        this.getHandler().listen(Tank.listenBody_, goog.events.EventType.KEYDOWN, this.onKeyDown);
        this.getHandler().listen(Tank.listenBody_, goog.events.EventType.KEYUP, this.onKeyUp);
        this.alreadyBind_ = true;
    }
}
Tank.TankClient.prototype.act = function(){
	this.canvas_.fillStyle = "rgb(200, 200, 200)";
    this.canvas_.fillRect(0, 0, Tank.size_.x, Tank.size_.y);
    this.sceneManager_.act();
}

Tank.TankClient.prototype.onKeyDown = function(e){
    switch(e.keyCode){
        case(goog.events.KeyCodes.P): //game pause 
           this.pause(); 
           break;
        case(goog.events.KeyCodes.SPACE): //game pause 
           this.start(); 
           break;
    }
}
Tank.TankClient.prototype.onKeyUp = function(e){
}
Tank.TankClient.prototype.start = function(){
    if(Tank.status_ == "stop") {
        this.mapManager_.start();
        Tank.status_ = "run";
        Tank.timer_.start();
    }
}
//pause/unpause the game
Tank.TankClient.prototype.pause = function(){ 
    if(Tank.status_ == "run"){
        Tank.timer_.stop();
        Tank.status_ = "pause";
        var lastStyle = this.canvas_.fillStyle;
        this.canvas_.fillStyle = "rgb(255, 0, 0)";
        this.canvas_.font = "30pt";
        this.canvas_.fillText("PAUSE", 100, 90);
        this.canvas_.fillStyle = lastStyle;
        this.canvas_.font = "12pt";
    }else if(Tank.status_ == "pause"){
        Tank.timer_.start();
        Tank.status_ = "run";
    }
}
Tank.TankClient.prototype.stop = function(){
}


/****************SceneManager**************/
//管理所有的物体，负责通知每个物体执行刷新操作，负责剔除死亡物体。
//负责一切查找物体的操作
Tank.SceneManager = {}
Tank.SceneManager.all_ = [];
Tank.SceneManager.barrier_ = [];
Tank.SceneManager.barrierMap_ = [];
Tank.SceneManager.refreshCount_ = 0;    //用来记录是不是过了一秒钟
Tank.SceneManager.seconds_ = 0;    //用来记录是不是过了一秒钟
Tank.SceneManager.setAll = function(all){
    Tank.SceneManager.all_ = all;
}
Tank.SceneManager.push = function(obj){
    Tank.SceneManager.all_.push(obj);
	if(obj.isBarrier_){
		Tank.SceneManager.barrier_.push(obj);
		this.refreshBarrierMap();
	}
}
Tank.SceneManager.act = function(){
    var all = Tank.SceneManager.all_;
    var barrier = Tank.SceneManager.barrier_;
    for(var i = 0; i < all.length; i++){
        if(all[i].alive_ == false) {
            all[i].die();
            all.splice(i, 1);

            i--;//注意此处，不然后面的一个物体会少显示一次导致画面闪一下
            continue;
        }
        //碰撞检测
        for(var j = 0; j < all.length; j++){
            if(i == j) continue;
            if((all[i].isBarrier4Walk_ || all[i].isBarrier4Bullet_) && (all[j].isBarrier4Walk_ ||all[j].isBarrier4Bullet_))
            if(Tank.collide(all[i], all[j])){
                if(all[i].hit) all[i].hit(all[j]);
                if(all[j].beHit) all[j].beHit(all[i]);
            }
        }
        Tank.SceneManager.all_[i].act();
        if(Tank.SceneManager.refreshCount_ <= 0){
            Tank.SceneManager.all_[i].tick();
            if(Tank.SceneManager.mainTank.alive_ == false){
                tank.pause(),Tank.MapManager.reload(),tank.pause();
            }else{
                if(!Tank.SceneManager.hasEnimy() && Tank.SceneManager.seconds_>5) {
                    tank.pause();
                    Tank.MapManager.next();
                    tank.pause();
                }
            }
            Tank.SceneManager.seconds_ ++;
        }
    }
	for(var i in barrier){
		if(barrier[i].alive_ == false){
			barrier.splice(i, 1);
			Tank.SceneManager.refreshBarrierMap();
		}
	}
    if( Tank.SceneManager.refreshCount_ <= 0) {
        Tank.SceneManager.refreshCount_ = 1000/Tank.refresh_
    }
    Tank.SceneManager.refreshCount_ --;    //用来记录是不是过了一秒钟
}

//私有函数
Tank.SceneManager.refreshBarrierMap = function(){
	Tank.SceneManager.barrierMap_ = [];
	var bm  = Tank.SceneManager.barrierMap_;
	for(var i = 0; i < Tank.size_.x/50; i++){
		bm[i] = [];
		for(var j = 0; j < Tank.size_.y/50; j++){
			bm[i][j] = 0;
		}
	}
	var ba = Tank.SceneManager.barrier_;
	for(var i in ba){
		bm[ba[i].gridLoc_.x][ba[i].gridLoc_.y] = 1;
	}
}
Tank.SceneManager.removeAll = function(){
    Tank.SceneManager.all_ = [];
    Tank.SceneManager.barrier_ = [];
	
}
Tank.SceneManager.hasEnimy = function(){
    var all = Tank.SceneManager.all_;
    for(var i in all){
        if(all[i].camp_ == 2) return true;
    }
    return false;
}
//获得指定圆形范围内的所有物体
//在没有特殊说明的情况下，此类中所有的get方法取得的物体都不包括 camp_ == -1的无阵营物体
Tank.SceneManager.getObjsInScope = function(loc, radius){
    var all = Tank.SceneManager.all_;
    var result = [];
    var loc2;
    for(i in all){
        if(all[i].camp_ == -1) continue;
        loc2 = all[i].loc_;
        if( Math.sqrt(Math.pow((loc.x - loc2.x), 2) + Math.pow((loc.y - loc2.y), 2)) < radius){
            result.push(all[i]);
        }
    }
    return result;
}

Tank.SceneManager.getObjsByScopeAndCamp = function(loc, radius, camp){
    var all = Tank.SceneManager.all_;
    var result = [];
    var loc2;
    for(i in all){
        if(all[i].camp_ == -1 || all[i].camp_ != camp || all[i].alive_ == false) continue;
        loc2 = all[i].loc_;
        if( Math.sqrt(Math.pow((loc.x - loc2.x), 2) + Math.pow((loc.y - loc2.y), 2)) < radius){
            result.push(all[i]);
        }
    }
    return result;
}
/*****************MapManager*****************/
//负责加载地图
Tank.MapManager = {};
Tank.MapManager.canvas_ = Tank.canvas_;
Tank.MapManager.sceneManager_ = Tank.SceneManager;
Tank.MapManager.index_ = 0;
Tank.MapManager.currentMap_ = null;

Tank.MapManager.init = function(){
}

Tank.MapManager.start = function(){
    Tank.MapManager.index_ = 0;
    this.load(Tank.MapManager.index_);
}
Tank.MapManager.next = function(){
    Tank.MapManager.index_++;
    if(Tank.MapManager.index_ + 1 > Tank.maps.length)
        Tank.MapManager.index_ = 0;
    this.load( Tank.MapManager.index_ );
}
//重新加载地图
Tank.MapManager.reload = function(){
    this.load(Tank.MapManager.index_ );
}
//加载指定关卡
Tank.MapManager.load = function(index){
    Tank.MapManager.index_ = index;
    Tank.MapManager.currentMap_ = Tank.maps[index];
    this.parseMap(Tank.MapManager.currentMap_);
}
//解析地图
Tank.MapManager.parseMap = function(map){
    Tank.SceneManager.removeAll();
    var objs = map.objs;
    for(var i in objs){
        this.createObj(objs[i]);
    }

/*
    this.sceneManager_.push(new Tank.MainTank());
    this.sceneManager_.push(new Tank.Emplacement(new Tank.Point(400, 100)));
	this.sceneManager_.push(new Tank.Emplacement(new Tank.Point(450, 100)));
	
	for(var i = 0; i < 10; i ++){
		this.sceneManager_.push(new Tank.Rock(new Tank.Point(i, 3)));
		this.sceneManager_.push(new Tank.Tree(new Tank.Point(i + 6, 5)));
		this.sceneManager_.push(new Tank.SteelRock(new Tank.Point(i, 7)));
		this.sceneManager_.push(new Tank.Tree2(new Tank.Point(i + 6, 10)));
    }


    this.sceneManager_.push(new Tank.Plaster(new Tank.Point(200, 300)));
    this.sceneManager_.push(new Tank.Equip0(new Tank.Point(300, 300)));
    this.sceneManager_.push(new Tank.Equip1(new Tank.Point(350, 50)));
    this.sceneManager_.push(new Tank.Equip2(new Tank.Point(400, 50)));
    this.sceneManager_.push(new Tank.Equip3(new Tank.Point(450, 50)));
    this.sceneManager_.push(new Tank.Equip4(new Tank.Point(500, 50)));
*/	
}
Tank.MapManager.createObj = function(obj){
	var c = this.createObj_;
	if(!(obj.type)) return;
    if(!(obj.loc)) obj.loc = {x:0,y:0};
    if(!(obj.amount)) obj.amount=1;
    if(!(obj.distance)) obj.distance={x:0,y:0};
	switch(obj.type){
        case("MainTank"):
            var t= new Tank.MainTank(new Tank.Point(obj.loc))
            Tank.SceneManager.push(t);
            Tank.SceneManager.mainTank = t;
            break;
		case("Zombie"):
			c(Tank.Zombie, obj);
            break;
		case("Zombie2"):
			c(Tank.Zombie2, obj);
            break;
		case("RandomTank"):
			c(Tank.RandomTank, obj);
            break;
        case("Emplacement"):
			c(Tank.Emplacement, obj);
            break;

        case("Rock"):
			c(Tank.Rock, obj);
            break;
        case("Rock2"):
			c(Tank.Rock2, obj);
            break;
        case("Tree"):
			c(Tank.Tree, obj);
            break;
        case("Tree2"):
			c(Tank.Tree2, obj);
            break;

        case("Plaster"):
			c(Tank.Plaster, obj);
            break;
        case("Equip0"):
			c(Tank.Equip0, obj);
            break;
        
	}
}
Tank.MapManager.createObj_ = function(Con, obj){
    for(var i = 0; i < obj.amount; i++) {
        Tank.SceneManager.push(new Con(new Tank.Point(obj.loc.x + obj.distance.x*i, obj.loc.y + obj.distance.y*i)));
    }
}
/**************控制面板**********/
Tank.Panel = {};
Tank.Panel.panel_ = null;
Tank.Panel.init = function(panel){
    Tank.Panel.panel_ = panel;
}
Tank.Panel.act = function(){
    Tank.Panel.draw();
}
Tank.Panel.draw = function(){
    var canvas = Tank.Panel.panel_.getContext("2d");
    if(!canvas) return;
}


