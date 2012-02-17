/*
在base中已经定义了很多基类，比如Movable，Equip等，继承这些基类可以实现一个特定的物体，比如继承Movable可以实现一个自己的可移动的物体，继承Equip可以实现一个自己的装备

   */
/********food*********/
//一个回复满血的大膏药
Tank.Plaster = function(loc){
    Tank.Plaster.superClass_.constructor.call(this, loc); 
    this.name_ = "plaster";
    this.imgs_ = [Tank.createImg("img/food/food_0.gif")];
}
goog.inherits(Tank.Plaster, Tank.Food);
Tank.Plaster.prototype.feed = function(obj){
    if(obj.hp_ != undefined){
        obj.hp_ = obj.hpLimit_;
        this.popMessage("恢复满血");
        this.alive_ = false;
    }
}


/******* 装备类********/
//先锋盾,可以自动恢复生命 ，有一定概率闪避攻击, 增加声明上线
Tank.Equip0 = function(loc){
    Tank.Equip0.superClass_.constructor.call(this, loc); 
    this.name_ = "先锋盾";
    this.imgs_ = [Tank.createImg("img/equips/equip_0.gif")];
    this.missProbility_ = 30; //有30%的概率躲避攻击
}

goog.inherits(Tank.Equip0, Tank.Equip);
//穿上装备的时候触发此方法一次
Tank.Equip0.prototype.equip= function(){
    this.obj_.hpLimit_ += 50; //生命上限 + 50
    this.obj_.setMissProb(this.missProbility_ ); //
    this.obj_.hpRecover_ += 10;  //生命回复 +10
}
Tank.Equip0.prototype.go = function(){
    
}
Tank.Equip0.prototype.tick = function(){
    if(this.obj_){
    }
}
Tank.Equip0.prototype.beHit = function(obj){
    if(this.obj_){
        if(obj.power_ && obj.camp_ != this.obj_.camp_){

        }
    }
}

//大炮
//增加暴击概率和倍数,攻击 + 5
Tank.Equip1 = function(loc){
    Tank.Equip1.superClass_.constructor.call(this, loc);
    this.name_ = "大炮";
    this.imgs_ = [Tank.createImg("img/equips/equip_1.jpg")];

}
goog.inherits(Tank.Equip1, Tank.Equip);
Tank.Equip1.prototype.equip = function(){
    this.obj_.bulletPower_ += 5;
    this.obj_.critProb_ += 20;//暴击概率 + 20
    this.obj_.crit_ += 50;  //暴击伤害+50%
}

/*** 飞鞋 ****/
//增加1点移动速度
Tank.Equip2 = function(loc){
    Tank.Equip2.superClass_.constructor.call(this, loc);
    this.name_ = "飞鞋";
    var img = new Image();
    img.src = "img/equips/equip_2.jpg";
    this.imgs_ = [img];

}
goog.inherits(Tank.Equip2, Tank.Equip);
Tank.Equip2.prototype.equip = function(){
    this.obj_.moveSpeed_ += 1;
}


//辉耀
//增加5点攻击，每秒对100半径类的敌人造成5点伤害
Tank.Equip3 = function(loc){
    Tank.Equip3.superClass_.constructor.call(this, loc);
    this.name_ = "辉耀";
    var img = new Image();
    img.src = "img/equips/equip_3.jpg";
    this.imgs_ = [img];
	this.power_ = 10;
}
goog.inherits(Tank.Equip3, Tank.Equip);
Tank.Equip3.prototype.equip = function(){
    this.obj_.bulletPower_ += 5;
}
//每秒对周围敌人造成伤害,不会对中立单位造成伤害
Tank.Equip3.prototype.tick = function(){
    if(this.obj_){
        var objs = Tank.SceneManager.getObjsInScope( this.obj_.loc_, 100);
        for(i in objs){
            if(objs[i].camp_ != 0 && objs[i].camp_ != this.obj_.camp_){
                objs[i].beHarmed(this, true);
            }
        }
    }
}

/** 死亡面罩****/
//对敌人造成伤害的 15% 恢复自己的生命
Tank.Equip4 = function(loc){
    Tank.Equip4.superClass_.constructor.call(this, loc);
    this.name_ = "死亡面罩";
    var img = new Image();
    img.src = "img/equips/equip_4.jpg";
    this.imgs_ = [img];

}
goog.inherits(Tank.Equip4, Tank.Equip);

Tank.Equip4.prototype.harm = function(num, obj){
    if(this.obj_){
        if(!obj.isFood_ && obj.camp_ != 0 ){
            this.obj_.cure(parseInt(num/100*15), true);
        }
    }
}

/**自定义形状的子弹****/
//火焰子弹
Tank.FireBullet = function(camp, power, direc, loc, speed, range){
	Tank.FireBullet.superClass_.constructor.call(this, camp, power, direc, loc, speed, range);
	var imgsU = [Tank.createImg("img/2.gif"),Tank.createImg("img/3.gif")];
    var imgsRU = [Tank.createImg("img/2.gif"),Tank.createImg("img/3.gif")];
    var imgsR = [Tank.createImg("img/2.gif"),Tank.createImg("img/3.gif")];
    var imgsRD = [Tank.createImg("img/2.gif"),Tank.createImg("img/3.gif")];
    var imgsD = [Tank.createImg("img/2.gif"),Tank.createImg("img/3.gif")];
    var imgsLD = [Tank.createImg("img/2.gif"),Tank.createImg("img/3.gif")];
    var imgsL = [Tank.createImg("img/2.gif"),Tank.createImg("img/3.gif")];
    var imgsLU = [Tank.createImg("img/2.gif"),Tank.createImg("img/3.gif")];
    this.imgsWalking_ = [];
    this.imgsWalking_.push(imgsU,imgsRU, imgsR, imgsRD, imgsD, imgsLD, imgsL, imgsLU);
	this.imgsAll_ = this.imgsWalking_;
	this.size_ = new Tank.Point(15,15);
	this.moveSpeed_ = 8;
}
goog.inherits(Tank.FireBullet, Tank.Bullet);

/****************8自定义tree形状*******************/
Tank.Tree2 = function(loc){
       Tank.Tree2.superClass_.constructor.call(this, loc); 
       this.imgs_ = [Tank.createImg("img/walls/treeb1.png"),Tank.createImg("img/walls/treeb2.png")];
}
goog.inherits(Tank.Tree2, Tank.Tree);
/********emplacement**********/
//无法移动的炮台，会自动攻击附近在射程内的敌人
//此时的移动方向只是发射子弹的方向
Tank.Emplacement = function(loc){
    Tank.Emplacement.superClass_.constructor.call(this);
    this.enableMove_ = false;
    this.loc_ = new Tank.Point(loc);
    this.canEatFood_ = false;
    this.moveDirec_ = 2;
    this.moving_ = true;
    this.camp_ = 2;
    this.showBloodBar_ = true;
    this.isBarrier4Bullet_ = true;
    this.hp_ = this.hpLimit_ = 300;
	this.fireRange_ = 300;
	this.bulletPower_ = 30;
    this.ais_.push(new Tank.AutoFireAI(this));
}
goog.inherits(Tank.Emplacement, Tank.FireMovable);

/*******RandomTank*****/
//会随机走动和发射子弹的坦克
Tank.RandomTank = function(loc){
    Tank.RandomTank.superClass_.constructor.call(this);
    this.loc_ = new Tank.Point(loc);
    this.canEatFood_ = false;
    this.moveDirec_ = 2;
    this.moving_ = true;
    this.camp_ = 2;
    this.showBloodBar_ = true;
    this.isBarrier4Bullet_ = true;
    this.hp_ = this.hpLimit_ = 100;
	this.bulletPower_ = 20;
    this.ais_.push(new Tank.RandomMoveAI(this));
    this.ais_.push(new Tank.RandomFireAI(this));
	this.ais_.push(new Tank.AutoFireAI(this));	//默认是会自动攻击的
}
goog.inherits(Tank.RandomTank, Tank.FireMovable);
Tank.RandomTank.prototype.die = function(){
    Tank.RandomTank.superClass_.die.call(this);
    Tank.SceneManager.push(new Tank.Plaster(new Tank.Point(this.loc_.x + 50, this.loc_.y)));//临死前，掉个大膏药
}

/**********Zombie*************/
//
Tank.Zombie = function(loc){
	Tank.Zombie.superClass_.constructor.call(this);
    this.loc_ = new Tank.Point(loc);
    this.canEatFood_ = false;
    this.moveDirec_ = 2;
    this.moving_ = true;
    this.camp_ = 2;
    this.showBloodBar_ = true;
    this.isBarrier4Bullet_ = true;
    this.hp_ = this.hpLimit_ = 100;

	this.fireRange_ = 200;	
	this.Bullet_ = Tank.FireBullet;
	this.bulletPower_ = 20;
	{
		var imgsU = Tank.createImgs("img/Zombie-walking.png", 20, 20, 60, 60, 8, 96);
		var imgsRU = Tank.createImgs("img/Zombie-walking.png", 20, 116, 60, 60, 8, 96);
		var imgsR = Tank.createImgs("img/Zombie-walking.png", 20, 212, 60, 60, 8, 96);
		var imgsRD = Tank.createImgs("img/Zombie-walking.png", 20, 308, 60, 60, 8, 96);
		var imgsD = Tank.createImgs("img/Zombie-walking.png", 20, 404, 60, 60, 8, 96);
		var imgsLD = Tank.createImgs("img/Zombie-walking.png", 20, 500, 60, 60, 8, 96);
		var imgsL = Tank.createImgs("img/Zombie-walking.png", 20, 596, 60, 60, 8, 96);
		var imgsLU = Tank.createImgs("img/Zombie-walking.png", 20, 692, 60, 60, 8, 96);
		this.imgsWalking_ = [];	//移动时的动画
		this.imgsWalking_.push(imgsU,imgsRU, imgsR, imgsRD, imgsD, imgsLD, imgsL, imgsLU);
	}
	{
		var imgsD = [Tank.createImg("img/Zombie-stand.png", 20, 20, 60, 60)];
		var imgsLD = [Tank.createImg("img/Zombie-stand.png",20, 116, 60, 60)];
		var imgsL = [Tank.createImg("img/Zombie-stand.png", 20, 212, 60, 60)];
		var imgsLU = [Tank.createImg("img/Zombie-stand.png", 20, 308, 60, 60)];
		var imgsU = [Tank.createImg("img/Zombie-stand.png", 20, 404, 60, 60)];
		var imgsRU = [Tank.createImg("img/Zombie-stand.png", 20, 500, 60, 60)];
		var imgsR = [Tank.createImg("img/Zombie-stand.png", 20, 596, 60, 60)];
		var imgsRD = [Tank.createImg("img/Zombie-stand.png", 20, 692, 60, 60)];
		this.imgsStand_ = [];	//停止不动时的动画
		this.imgsStand_.push(imgsU,imgsRU, imgsR, imgsRD, imgsD, imgsLD, imgsL, imgsLU);
	}
	this.imgsAll_ = this.imgsStand_;
		
	var imgsU = Tank.createImgs("img/Zombie-attack.png", 20, 20, 60, 60, 10, 96);
	var imgsRU = Tank.createImgs("img/Zombie-attack.png", 20, 116, 60, 60, 10, 96);
	var imgsR = Tank.createImgs("img/Zombie-attack.png", 20, 212, 60, 60, 10, 96);
	var imgsRD = Tank.createImgs("img/Zombie-attack.png", 20, 308, 60, 60, 10, 96);
	var imgsD = Tank.createImgs("img/Zombie-attack.png", 20, 404, 60, 60, 10, 96);
	var imgsLD = Tank.createImgs("img/Zombie-attack.png", 20, 500, 60, 60, 10, 96);
	var imgsL = Tank.createImgs("img/Zombie-attack.png", 20, 596, 60, 60, 10, 96);
	var imgsLU = Tank.createImgs("img/Zombie-attack.png", 20, 692, 60, 60, 10, 96);
	this.imgsMoveFiring_ = [];
	this.imgsMoveFiring_.push(imgsU,imgsRU, imgsR, imgsRD, imgsD, imgsLD, imgsL, imgsLU);

	this.imgsStandFiring_ = this.imgsMoveFiring_;
	
	this.ais_.push(new Tank.RandomMoveAI(this));
    this.ais_.push(new Tank.RandomFireAI(this));
	this.ais_.push(new Tank.AutoFireAI(this));	//默认是会自动攻击的
}
goog.inherits(Tank.Zombie, Tank.FireMovable);

//近战的单位
Tank.Zombie2 = function(loc){
	Tank.Zombie2.superClass_.constructor.call(this);
    this.loc_ = new Tank.Point(loc);
    this.canEatFood_ = false;
    this.moveDirec_ = 2;
    this.moving_ = true;
    this.camp_ = 2;
    this.showBloodBar_ = true;
    this.isBarrier4Bullet_ = true;
    this.hp_ = this.hpLimit_ = 100;
	this.fireRange_ = 80;	//近战单位


	{
		var imgsU = Tank.createImgs("img/Zombie2-walking.png", 20, 20, 60, 60, 8, 96);
		var imgsRU = Tank.createImgs("img/Zombie2-walking.png", 20, 116, 60, 60, 8, 96);
		var imgsR = Tank.createImgs("img/Zombie2-walking.png", 20, 212, 60, 60, 8, 96);
		var imgsRD = Tank.createImgs("img/Zombie2-walking.png", 20, 308, 60, 60, 8, 96);
		var imgsD = Tank.createImgs("img/Zombie2-walking.png", 20, 404, 60, 60, 8, 96);
		var imgsLD = Tank.createImgs("img/Zombie2-walking.png", 20, 500, 60, 60, 8, 96);
		var imgsL = Tank.createImgs("img/Zombie2-walking.png", 20, 596, 60, 60, 8, 96);
		var imgsLU = Tank.createImgs("img/Zombie2-walking.png", 20, 692, 60, 60, 8, 96);
		this.imgsWalking_ = [];	//移动时的动画
		this.imgsWalking_.push(imgsU,imgsRU, imgsR, imgsRD, imgsD, imgsLD, imgsL, imgsLU);
	}
	{
		var imgsD = [Tank.createImg("img/Zombie2-stand.png", 20, 20, 60, 60)];
		var imgsLD = [Tank.createImg("img/Zombie2-stand.png",20, 116, 60, 60)];
		var imgsL = [Tank.createImg("img/Zombie2-stand.png", 20, 212, 60, 60)];
		var imgsLU = [Tank.createImg("img/Zombie2-stand.png", 20, 308, 60, 60)];
		var imgsU = [Tank.createImg("img/Zombie2-stand.png", 20, 404, 60, 60)];
		var imgsRU = [Tank.createImg("img/Zombie2-stand.png", 20, 500, 60, 60)];
		var imgsR = [Tank.createImg("img/Zombie2-stand.png", 20, 596, 60, 60)];
		var imgsRD = [Tank.createImg("img/Zombie2-stand.png", 20, 692, 60, 60)];
		this.imgsStand_ = [];	//停止不动时的动画
		this.imgsStand_.push(imgsU,imgsRU, imgsR, imgsRD, imgsD, imgsLD, imgsL, imgsLU);
	}
	this.imgsAll_ = this.imgsStand_;
		
	var imgsU = Tank.createImgs("img/Zombie2-attack.png", 20, 20, 60, 60, 10, 96);
	var imgsRU = Tank.createImgs("img/Zombie2-attack.png", 20, 116, 60, 60, 10, 96);
	var imgsR = Tank.createImgs("img/Zombie2-attack.png", 20, 212, 60, 60, 10, 96);
	var imgsRD = Tank.createImgs("img/Zombie2-attack.png", 20, 308, 60, 60, 10, 96);
	var imgsD = Tank.createImgs("img/Zombie2-attack.png", 20, 404, 60, 60, 10, 96);
	var imgsLD = Tank.createImgs("img/Zombie2-attack.png", 20, 500, 60, 60, 10, 96);
	var imgsL = Tank.createImgs("img/Zombie2-attack.png", 20, 596, 60, 60, 10, 96);
	var imgsLU = Tank.createImgs("img/Zombie2-attack.png", 20, 692, 60, 60, 10, 96);
	this.imgsMoveFiring_ = [];
	this.imgsMoveFiring_.push(imgsU,imgsRU, imgsR, imgsRD, imgsD, imgsLD, imgsL, imgsLU);

	this.imgsStandFiring_ = this.imgsMoveFiring_;
	
	this.ais_.push(new Tank.RandomMoveAI(this));
    this.ais_.push(new Tank.RandomFireAI(this));
	this.ais_.push(new Tank.AutoFireAI(this));	//默认是会自动攻击的
}
goog.inherits(Tank.Zombie2, Tank.FireMovable);
/******maintank******/
Tank.MainTank = function(){
    Tank.MainTank.superClass_.constructor.call(this);
    this.showBloodBar_ = true;
    this.hp_ = this.hpLimit_ = 300;

    this.camp_ = 1;
    this.canEatFood_ = true;
    this.protect_ = 1;
    this.loc_ = new Tank.Point(200, 550);
    this.ais_.push(new Tank.KeyAI(this));
    this.bulletPower_  = 200;
	
	var imgsD = Tank.createImgs("img/firing.png", 52, 52, 90, 90, 8, 133);
	var imgsLD = Tank.createImgs("img/firing.png", 52, 164, 90, 90, 8, 133);
	var imgsL = Tank.createImgs("img/firing.png", 52, 276, 90, 90, 8, 133);
	var imgsLU = Tank.createImgs("img/firing.png", 52, 388, 90, 90, 8, 133);
	var imgsU = Tank.createImgs("img/firing.png", 52, 500, 90, 90, 8, 133);
	var imgsRU = Tank.createImgs("img/firing.png", 52, 612, 90, 90, 8, 133);
	var imgsR = Tank.createImgs("img/firing.png", 52, 724, 90, 90, 8, 133);
	var imgsRD = Tank.createImgs("img/firing.png", 52, 836, 90, 90, 8, 133);
	this.imgsMoveFiring_ = [];
	this.imgsMoveFiring_.push(imgsU,imgsRU, imgsR, imgsRD, imgsD, imgsLD, imgsL, imgsLU);
	
	var imgsD = Tank.createImgs("img/firing2.png", 52, 52, 90, 90, 2, 133);
	var imgsLD = Tank.createImgs("img/firing2.png", 318, 52,90, 90, 2, 133);
	var imgsL = Tank.createImgs("img/firing2.png", 584, 52, 90, 90, 2, 133);
	var imgsLU = Tank.createImgs("img/firing2.png", 850, 52, 90, 90, 2, 133);
	var imgsU = Tank.createImgs("img/firing2.png", 52, 164, 90, 90, 2, 133);
	var imgsRU = Tank.createImgs("img/firing2.png", 318, 164, 90, 90, 2, 133);
	var imgsR = Tank.createImgs("img/firing2.png", 584, 164, 90, 90, 2, 133);
	var imgsRD = Tank.createImgs("img/firing2.png", 850, 164, 90, 90, 2, 133);
	this.imgsStandFiring_ = [];
	this.imgsStandFiring_.push(imgsU,imgsRU, imgsR, imgsRD, imgsD, imgsLD, imgsL, imgsLU);
}
goog.inherits(Tank.MainTank, Tank.FireMovable);
Tank.MainTank.prototype.die = function(){
    Tank.MainTank.superClass_.die.call(this);
}
Tank.MainTank.prototype.tick = function(){
	Tank.MainTank.superClass_.tick.call(this);

}