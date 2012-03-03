var Tank = Tank || {};
/*************static values************/
// 一些全局变量，在TankClient中初始化
Tank.canvas_ = null;
Tank.size_ = null;
Tank.refresh_ = 50;
Tank.window_ = document;
Tank.listenBody_ = document;
Tank.timer_ = null;
Tank.status_ = "stop"; //当前游戏的三种状态:stop,run, pause
Tank.globalMessage_ = null;


/**
  *所有类的父类
  *
  */
Tank.BaseObject = function(name, imgs, opt_loc, opt_size){
    this.name_ = name || "no name"
    this.canvas_ = Tank.canvas_;
    this.imgs_ = imgs || [];
    this.changeImageTime_ = 1;
    this.changeImageCount_ = 0;
    this.imgIndex_ = -1;
    this.zindex_ = 1; //1 - 5

    this.size_ = opt_size || new Tank.Point(50, 50);
    this.loc_ = opt_loc || new Tank.Point(50, 50);
    this.visible_ = true;
    this.alive_ = true;
    this.isBarrier4Walk_ = false;
    this.isBarrier4Bullet_ = false;
    this.invincible_ = true; //无敌状态，受到
    this.camp_ = -1;//默认无阵营

    this.init();
}
goog.inherits(Tank.BaseObject, goog.ui.Component);
//每次页面刷新都会执行的操作
Tank.BaseObject.idCounter_ = 0;//用来产生唯一的id标志
Tank.BaseObject.prototype.init = function(){
    this.id_ = ++Tank.BaseObject.idCounter_;
}
Tank.BaseObject.prototype.act = function(){
    this.go();
    this.draw();
}
Tank.BaseObject.prototype.tick = function(){
}
//临死前执行的动作
Tank.BaseObject.prototype.die = function(){
}
Tank.BaseObject.prototype.go = function(){
}
Tank.BaseObject.prototype.draw = function(){
    this.changeImage();
    this.canvas_.save();
    if(this.currentImg_ && this.visible_){
        //this.canvas_.drawImage(this.currentImg_, this.loc_.x, this.loc_.y, this.size_.x, this.size_.y);
		if(this.currentImg_.sprite_){
			var sprite = this.currentImg_.sprite_;
			this.canvas_.drawImage(this.currentImg_, sprite.x, sprite.y, sprite.w, sprite.h, this.loc_.x, this.loc_.y, this.size_.x, this.size_.y);
		}else{
			this.canvas_.drawImage(this.currentImg_, this.loc_.x, this.loc_.y, this.size_.x, this.size_.y);
		}
    }
    this.canvas_.restore();
    
}


Tank.BaseObject.prototype.changeImage = function(){
    if(this.changeImageCount_ < 0){
        this.imgIndex_ ++;
        if(this.imgIndex_ >= this.imgs_.length)
            this.imgIndex_ = 0;
        this.changeImageCount_ = this.changeImageTime_;
    }else{
    }
    this.currentImg_ = this.imgs_[this.imgIndex_];
    this.changeImageCount_ --;
}
/****************Life**************/
/*
  有生命特征的物体 
   */
Tank.Life = function(name, size, loc, imgs, opt_isBarrier4Walk, opt_changeImageTime, opt_zindex){
    Tank.Life.superClass_.constructor.call(this, name, imgs, loc, size);
    this.camp_ = 0; //0: 中立，会挡住两方的子弹，1：友军，2：敌军
    this.hp_ = 200;  //当前的生命值 
    this.hpLimit_ = 200;    //
    this.hpRecover_ = 2; //每秒钟自动回复生命
    this.protect_ = 0; //护甲
    this.isBarrier4Walk_ = opt_isBarrier4Walk || false;
    this.isBarrier4Bullet_ = true;

    this.invincible_ = false; //无敌状态，受到
    this.visible_ = true;
    this.showBloodBar_ = false;
    this.missProb_ = 0;   //闪避攻击的概率
    this.ais_ = []; //一个物体可以有多个ai
	this.words_ = null;	//当前说的话
	this.wordsTime_ = 3;	//一句话的持续时间
	this.wordsTimeCount_ = 0;
    this.sceneManager_ = Tank.SceneManager; //保存一个引用
    this.zindex_ = 2;
}
goog.inherits(Tank.Life, Tank.BaseObject);


//每隔一秒执行一次
Tank.Life.prototype.tick = function(){
    for(i in this.ais_) this.ais_[i].tick();
    this.cure(this.hpRecover_, false);
	if(this.wordsTimeCount_ > 0) this.wordsTimeCount_ --;
}
Tank.Life.prototype.beHit = function(obj){
    for(i in this.ais_) this.ais_[i].beHit(obj);
    
}
Tank.Life.prototype.popMessage = function(m){
    Tank.SceneManager.push(new Tank.Message(m, null, new Tank.Point(this.loc_), "rgb(255, 0, 0)")); 
}
Tank.Life.prototype.say = function(m, opt_time){
    this.words_ = m;
	this.wordsTimeCount_ = opt_time || this.wordsTime_;
}
//恢复生命值
Tank.Life.prototype.cure = function(n, showMessage){
    if(this.hp_ < this.hpLimit_){
        var diff = this.hpLimit_ - this.hp_;
        var cn = diff < n ? diff : n;
        this.hp_ += cn;
        if(showMessage) this.popMessage("+" + cn);
    }

}
//受到伤害，损失生命 <=0 则死亡
//计算护甲，无敌状态不会损失生命
Tank.Life.prototype.beHarmed = function(obj, showMessage){
	if(this.invincible_) return;//无敌状态
	var computedPower = 0;
	if(obj.power_ && obj.camp_ != this.camp_){	//只要被带有power_的物体撞到，就会受到伤害
		if(Tank.rand(this.missProb_)){
			this.popMessage("闪避");
		}else{
			 computedPower = (obj.power_ > this.protect_ ? obj.power_ - this.protect_ : 1);
			 if(showMessage) this.popMessage("-" + computedPower);
		}
	}
   
    this.hp_ -= computedPower;
    if(this.hp_ <= 0) this.alive_ = false;

    if(obj.isBullet_ ) obj = obj.owner_; //子弹的伤害，来源是发射子弹的物体
    if(obj && obj.harm) obj.harm(computedPower, this); //伤害成功
	
	for(i in this.ais_) this.ais_[i].beHarmed(obj, showMessage);
}

//设置闪避概率，不可叠加，默认选中最大值
Tank.Life.prototype.setMissProb = function(n){
    if(n > this.missProb_ ) this.missProb_ = n;
}
//临死前执行的动作
Tank.Life.prototype.die = function(){
}
Tank.Life.prototype.go = function(){
    for(i in this.ais_) {
        this.ais_[i].go();
    }
}

Tank.Life.prototype.draw = function(){
    Tank.Life.superClass_.draw.call(this);
    //draw bloodbar
    if(!this.invincible_ && this.showBloodBar_){
        var lastStyle = this.canvas_.fillStyle;
        this.canvas_.fillStyle = "rgb(0, 0, 255)";
        this.canvas_.fillRect(this.loc_.x, this.loc_.y - 20, 50, 6);

        if(this.hp_ >= this.hpLimit_/3*2)
            this.canvas_.fillStyle = "rgb(0, 255, 0)";
        else if(this.hp_ >= this.hpLimit_/3*1)
            this.canvas_.fillStyle = "rgb(255, 255, 0)";
        else 
            this.canvas_.fillStyle = "rgb(255, 0, 0)";

        this.canvas_.fillRect(this.loc_.x, this.loc_.y - 20, 50 * (this.hp_ / this.hpLimit_), 6);
        this.canvas_.fillStyle = lastStyle;
    }
	//say
	if(this.wordsTimeCount_ > 0 &&this.words_){
		this.canvas_.fillStyle = "rgb(255, 255, 255)";
		this.canvas_.fillRect(this.loc_.x - 40, this.loc_.y - 30, 120, 20);
		this.canvas_.fillStyle = "rgb(255, 0, 0)";
		this.canvas_.fillText(this.words_, this.loc_.x - 35, this.loc_.y - 17 );
	}
}



/************Movable*************/

Tank.Movable = function(){
    this.imgsWalking_ = Tank.createImgsMatrix("img/walking.png", 52, 52, 90, 90, 8, 133, 8,  112, 4);
    this.imgsStand_= Tank.wrapArray(Tank.createImgs("img/standing.png", 52, 276, 90, 90, 8, 133, 4));
	this.imgsAll_ = this.imgsStand_;
    Tank.Movable.superClass_.constructor.call(this, "Tank", null, new Tank.Point(100, 100), this.imgsAll_[0], true, 0);
	
	this.size_ = new Tank.Point(40, 40);
    this.isBarrier4Walk_ = false;
    this.moveDirec_ = 0;//01234567 ,从上方开始，顺时针8个方向
    this.moveSpeed_ = 4;
    this.enableMove_ = true; //
    this.moving_ = false;
    this.canEatFood_ = false;
    this.lastLoc_ = new Tank.Point(this.loc_);
    this.equips_ = [];
}
goog.inherits(Tank.Movable, Tank.Life);

Tank.Movable.prototype.hit = function(obj){
    if(obj.isFood_){
        if(this.canEatFood_)
            obj.feed(this);
    }else if(this.camp_ != obj.camp_ && obj.isBarrier4Walk_ && !obj.isBullet_){
        this.loc_ = new Tank.Point(this.lastLoc_);
    }
    for(i in this.ais_) this.ais_[i].hit(obj);
}
Tank.Movable.prototype.go = function(){
    Tank.Movable.superClass_.go.call(this);
    this.lastLoc_ = new Tank.Point(this.loc_);
    this.imgs_ = this.imgsAll_[this.moveDirec_];
    if(this.moving_ && this.enableMove_){
        switch(this.moveDirec_){
            case(0):
                this.loc_.y -= this.moveSpeed_;
                break;
            case(1):
                this.loc_.y -= parseInt((1 / Math.sqrt(2)) * this.moveSpeed_);
                this.loc_.x += parseInt((1 / Math.sqrt(2)) * this.moveSpeed_);
                break;
            case(2):
                this.loc_.x += this.moveSpeed_;
                break;
            case(3):
                this.loc_.y += parseInt((1 / Math.sqrt(2)) * this.moveSpeed_);
                this.loc_.x += parseInt((1 / Math.sqrt(2)) * this.moveSpeed_);
                break;
            case(4):
                this.loc_.y += this.moveSpeed_;
                break;
            case(5):
                this.loc_.y += parseInt((1 / Math.sqrt(2)) * this.moveSpeed_);
                this.loc_.x -= parseInt((1 / Math.sqrt(2)) * this.moveSpeed_);
                break;
            case(6):
                this.loc_.x -= this.moveSpeed_;
                break;
            case(7):
                this.loc_.y -= parseInt((1 / Math.sqrt(2)) * this.moveSpeed_);
                this.loc_.x -= parseInt((1 / Math.sqrt(2)) * this.moveSpeed_);
                break;

        }
    }
    if(this.loc_.x < 0 || this.loc_.y < 0 || this.loc_.x + this.size_.x > Tank.size_.x ||
            this.loc_.y + this.size_.y > Tank.size_.y) {
       this.outOfRange(); 
    }

    for(i in this.equips_) this.equips_[i].go();
}
Tank.Movable.prototype.tick = function(){
    Tank.Movable.superClass_.tick.call(this);
    for(i in this.equips_) this.equips_[i].tick();
}
Tank.Movable.prototype.beHit = function(obj){
    for(i in this.equips_) this.equips_[i].beHit(obj);
    Tank.Movable.superClass_.beHit.call(this, obj);
}
Tank.Movable.prototype.move = function(direct){
    if(direct != undefined) this.moveDirec_ = direct;
    this.moving_ = true;
}
Tank.Movable.prototype.stop = function(direct){
    this.moving_ = false;
}
Tank.Movable.prototype.changeImage = function(){
	if(this.moving_ == true && this.enableMove_){
		
	}else{
		this.imgs_ = this.imgsStand_[this.moveDirec_];	//
	}
	Tank.Movable.superClass_.changeImage.call(this);
}
//走出界了
//默认行为是 死亡
Tank.Movable.prototype.outOfRange = function(direct){
    this.alive_ = false;
    for(var i in this.ais_) this.ais_[i].outOfRange();
}


/*****************FireMovable*************/
Tank.FireMovable = function(move_imgs, Bullet){
    Tank.FireMovable.superClass_.constructor.call(this, move_imgs);
	
    this.imgsMoveFiring_ = Tank.createImgsMatrix("img/firing.png", 52, 52, 90, 90, 8, 133, 8, 112, 4);
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
	
    this.enableFire_ = true;
    this.firing_ = false;
    this.firingType = 1; //1, 普通攻击，2 魔法攻击
    this.fireDirec_ = 0;
    this.fireSpeed_ = 10; //
    this.fireSpeedCount_ = 0;
	this.fireRange_ = 300;
    this.bulletSpeed_ = 7;
    this.Bullet_ = Bullet || Tank.Bullet;
    this.bullerPower_ = 10;
    this.crit_ = 200 ; //暴击伤害 默认是2倍暴击
    this.critProb_ = 0;//暴击概率，默认为0
    this.Magic_ = Tank.Magic;   //魔法攻击
    this.mp_ = this.mpLimit_ = 0; //魔法值	
    this.mpRecover_ = 5;   //魔法恢复速度
}
goog.inherits(Tank.FireMovable, Tank.Movable);

Tank.FireMovable.prototype.act = function(direc){
    Tank.FireMovable.superClass_.act.call(this);
    this.fireDirec_ = this.moveDirec_;
    if(this.fireSpeedCount_ <= 0){
        if(this.firing_ && this.enableFire_){
             this.fire();
             this.fireSpeedCount_ = this.fireSpeed_;
        }
    }else{
        this.fireSpeedCount_ --;
    }
}
Tank.FireMovable.prototype.tick = function(){
    Tank.FireMovable.superClass_.tick.call(this);
    this.cureMp(this.mpRecover_, false);
}
//成功对另一个单位造成伤害后的回调函数
//参数：伤害数值,被伤害的对象
Tank.FireMovable.prototype.harm = function(num, obj){
    for(i in this.ais_) {
        this.ais_[i].harm(num, obj);
    }
    for(i in this.equips_) this.equips_[i].harm(num, obj);
}
//恢魔法值复
Tank.Life.prototype.cureMp = function(n, showMessage){
    if(this.mp_ < this.mpLimit_){
        var diff = this.mpLimit_ - this.mp_;
        var cn = diff < n ? diff : n;
        this.mp_ += cn;
        if(showMessage) this.popMessage("+" + cn +" mp");
    }

}
//消耗mp
Tank.FireMovable.prototype.useMp = function(n, showMessage){
    if(this.mp_ >= n){
        this.mp_ -= n;
        return true;
    }else {
        if(showMessage) this.say("魔法不足!", 1);
        return false;
    }
}
Tank.FireMovable.prototype.fire  = function(){
    var computedBulletPower = this.bulletPower_;
    if(Tank.rand(this.critProb_)){
        computedBulletPower *= parseInt(computedBulletPower * this.crit_ / 100);
        this.popMessage("暴击 " + this.crit_ + "%");
    }
    for(i in this.equips_) this.equips_[i].fire();
    //普通攻击
    var bullet = null;
    if(this.fireType_ == 1){
        if(this.fireRange_ < 100) {// 使用一个特殊的不可见的魔法子弹来实现近战伤害
            bullet = new Tank.Magic(this, computedBulletPower,  this.fireDirec_, new Tank.Point(this.loc_), this.bulletSpeed_, this.fireRange_);
            bullet.range_ = this.fireRange_;
            bullet.size_ = new Tank.Point(this.size_);
            bullet.power_ = computedBulletPower;
            bullet.visible_ = false;
        }else{
            bullet = new this.Bullet_(this, computedBulletPower,  this.fireDirec_, new Tank.Point(this.loc_), this.bulletSpeed_, this.fireRange_)
            Tank.center(this, bullet);
        }
    }
    //魔法攻击
    if(this.fireType_ == 2 && this.useMp(this.Magic_.mp_, true)){
        bullet = new this.Magic_(this, computedBulletPower,  this.fireDirec_, new Tank.Point(this.loc_));
        this.say(this.Magic_.name_);
    }
    if(bullet) Tank.SceneManager.push(bullet);
}
Tank.FireMovable.prototype.startFire  = function(opt_type){
        this.fireType_ = opt_type || 1;
        this.firing_ = true;
}
Tank.FireMovable.prototype.stopFire  = function(){
    this.firing_ = false;
}
Tank.FireMovable.prototype.die = function(){
    Tank.FireMovable.superClass_.die.call(this);
    Tank.SceneManager.push(new Tank.Explode(new Tank.Point(this.loc_)));//临死前，发生爆炸
}
Tank.FireMovable.prototype.draw = function(){
    Tank.FireMovable.superClass_.draw.call(this);
    //draw mpbar 
    if(!this.invincible_ && this.showBloodBar_ && this.mpLimit_ > 0){
        var lastStyle = this.canvas_.fillStyle;
        this.canvas_.fillStyle = "rgb(190, 190, 190)";
        this.canvas_.fillRect(this.loc_.x, this.loc_.y - 10, 50, 6);
        this.canvas_.fillStyle = "rgb(0, 0, 255)";

        this.canvas_.fillRect(this.loc_.x, this.loc_.y - 10, 50 * (this.mp_ / this.mpLimit_), 6);
        this.canvas_.fillStyle = lastStyle;
    }
}
Tank.FireMovable.prototype.changeImage  = function(){
	if(this.firing_ == true && this.moving_ && this.enableMove_ && this.imgsMoveFiring_){
		this.imgsAll_ = this.imgsMoveFiring_;
	}
	else if(this.firing_ == true && this.imgsStandFiring_){
		this.imgsAll_ = this.imgsStandFiring_;
	}else if(this.moving_ == true && this.enableMove_){
		this.imgsAll_ = this.imgsWalking_;
	}else{
		this.imgs_ = this.imgsStand_[this.moveDirec_];	//
	}
	Tank.Movable.superClass_.changeImage.call(this);
}
/**************Bullet************/
//子弹在8个方向上都是同一组图片，只是旋转方向不同
Tank.Bullet = function(owner, power, direc, loc, speed, range, opt_size, opt_imgs, opt_rotate){
    Tank.Bullet.superClass_.constructor.call(this);
    var imgsU = opt_imgs || [Tank.createImg("img/bullets/bullet.png")];
    this.imgsWalking_ = [];
    for(var i = 0; i<8;i++)this.imgsWalking_.push(imgsU);
	this.imgsAll_ = this.imgsWalking_;
    this.imgsStand_ = this.imgsWalking_;
    this.loc_ = loc;
	this.startLoc_ = new Tank.Point(loc);
    this.moveDirec_ = direc;
    this.moving_ = true;
    this.moveSpeed_ = speed || 7;
	this.range_ = range;
    this.size_ = opt_size ? new Tank.Point(opt_size) : new Tank.Point(10,10);
    this.camp_ = owner.camp_;
    this.power_ = power || 10;
    this.type_ = "bullet";
    this.isBullet_ = true;
    this.isBarrier4Walk_ = true;
    this.isBarrier4Bullet_ = false;
    this.invincible_ = true;
    this.owner_ = owner; //子弹的发出者
    this.rotate_ = opt_rotate || 0; //如果图片初始不是向上的,则设置此参数表明初始的方向 
}
goog.inherits(Tank.Bullet, Tank.Movable);
Tank.Bullet.prototype.hit = function(obj){
    if(this.camp_ != obj.camp_ && obj.isBarrier4Bullet_){
		obj.beHarmed(this, true);
        this.alive_ = false;
    }
}
Tank.Bullet.prototype.go = function(){
	Tank.Bullet.superClass_.go.call(this);
	if(Tank.getDistance(this,{loc_:this.startLoc_}) > this.range_) this.alive_ = false;
}
Tank.Bullet.prototype.die = function(bullet){
}
Tank.Bullet.prototype.beHit = function(bullet){
    
}
Tank.Bullet.prototype.draw = function(){
        this.changeImage();
        this.canvas_.save();
        //调整为居中
        switch((this.moveDirec_ + parseInt(this.rotate_))%8){
            case(0):
                this.canvas_.translate( (this.loc_.x), (this.loc_.y));
                break;
            case(1):
                this.canvas_.translate( (this.loc_.x + this.size_.x/2), (this.loc_.y ));
                break;
            case(2):
                this.canvas_.translate( (this.loc_.x + this.size_.x), (this.loc_.y));
                break;
            case(3):
                this.canvas_.translate( (this.loc_.x + this.size_.x), (this.loc_.y+this.size_.y/2 ));
                break;
            case(4):
                this.canvas_.translate( (this.loc_.x + this.size_.x), (this.loc_.y+this.size_.y ));
                break;
            case(5):
                this.canvas_.translate( (this.loc_.x + this.size_.x/2), (this.loc_.y+this.size_.y ));
                break;
            case(6):
                this.canvas_.translate( (this.loc_.x ), (this.loc_.y+this.size_.y ));
                break;
            case(7):
                this.canvas_.translate( (this.loc_.x ), (this.loc_.y+this.size_.y/2 ));
                break;
        }
        this.canvas_.rotate(Math.PI/4*((this.moveDirec_ + this.rotate_)%8));

        if(this.currentImg_ && this.visible_){
            //this.canvas_.drawImage(this.currentImg_, this.loc_.x, this.loc_.y, this.size_.x, this.size_.y);
            if(this.currentImg_.sprite_){
                var sprite = this.currentImg_.sprite_;
                this.canvas_.drawImage(this.currentImg_, sprite.x, sprite.y, sprite.w, sprite.h, 0, 0, this.size_.x, this.size_.y);
            }else{
                this.canvas_.drawImage(this.currentImg_, 0, 0, this.size_.x, this.size_.y);
            }
        }

        this.canvas_.restore();
}
/**********魔法***************/
//魔法是一类特殊的子弹, 魔法攻击的伤害是按照物理伤害的倍数来算的。
//使用魔法会消耗mp
//自定义的魔法，从此类继承
Tank.Magic = function(owner, power, direc, loc){
	Tank.Magic.superClass_.constructor.call(this, owner, power, direc, loc);
	this.power_ = power * 5;	//造成5倍伤害
	
	var imgsU = [Tank.createImg("img/bullets/bullets.png",66, 192, 62, 62 )];
    this.imgsWalking_ = [];
    for(var i = 0; i<8;i++)this.imgsWalking_.push(imgsU);
	this.imgsAll_ = this.imgsWalking_;
    this.imgsStand_ = this.imgsWalking_;

	this.loc_ = loc;
	this.startLoc_ = new Tank.Point(loc);
    this.moveDirec_ = direc;
    this.moveSpeed_ = 10;
    this.size_ = new Tank.Point(40,40);
    this.camp_ = owner.camp_;
    this.type_ = "bullet";
    this.isBullet_ = true;
    this.isBarrier4Walk_ = true;
    this.isBarrier4Bullet_ = false;
    this.invincible_ = true;
    this.owner_ = owner; //子弹的发出者
	this.already_ = [];	//已经被攻击过的，每个敌人只攻击一次
	this.range_ = 300;
    this.rotate_ = 4;
}
goog.inherits(Tank.Magic, Tank.Bullet);
Tank.Magic.mp_ = 50; //此魔法需要消耗的mp
Tank.Magic.name_ = "火焰术"; //此魔法的名字
Tank.Magic.prototype.draw = function(){	//可以重写此方法来 实现特殊的视觉效果
	Tank.Magic.superClass_.draw.call(this);
}
Tank.Magic.prototype.hit = function(obj){
    if(this.camp_ != obj.camp_ && obj.isBarrier4Bullet_ && !Tank.inArray(obj, this.already_)){
		obj.beHarmed(this, true);
        this.already_.push(obj);
    }
    if(obj.camp_ != this.camp_ && obj.isBarrier_ &&obj.isBarrier4Bullet_ ) this.alive_ = false;
}

/*************各种障碍物**************/
/*包括三种障碍物
    Rock:会挡住子弹，可以被子弹摧毁（有一定生命值）
SteelRock:会挡住子弹，无法被子弹摧毁
Tree:不会挡住子弹，无法被子弹摧毁
障碍物的构造函数传递的位置不是像素点的位置，而是网格位置。
  */
Tank.Rock = function(gridLoc){
	this.gridLoc_ = gridLoc;
	loc = new Tank.Point(gridLoc.x * 50, gridLoc.y * 50);
   Tank.Rock.superClass_.constructor.call(this, "rock", undefined, loc); 
   this.imgs_ = [Tank.createImg("img/walls/rocka1.png"),Tank.createImg("img/walls/rocka2.png")];
   this.changeImageTime_ = 40;
   this.camp_ = 0;
   this.showBloodBar_ = true;
   this.isBarrier4Walk_ = true;
   this.isBarrier_ = true;
}
goog.inherits(Tank.Rock, Tank.Life);


Tank.SteelRock = function(gridLoc){
	this.gridLoc_ = gridLoc;
	loc = new Tank.Point(gridLoc.x * 50, gridLoc.y * 50);
       Tank.SteelRock.superClass_.constructor.call(this, "steel", undefined, loc); 
       this.imgs_ = [Tank.createImg("img/walls/rockc1.png"),Tank.createImg("img/walls/rockc2.png")];
       this.camp_ = 0;

       this.changeImageTime_ = 20;
       this.invincible_ = true;
       this.isBarrier4Walk_ = true;
	   this.isBarrier_ = true;
}
goog.inherits(Tank.SteelRock, Tank.Life);

Tank.Tree = function(gridLoc){
	this.gridLoc_ = gridLoc;
	loc = new Tank.Point(gridLoc.x * 50, gridLoc.y * 50);
       Tank.Tree.superClass_.constructor.call(this,  "tree", undefined, loc); 
       this.imgs_ = [Tank.createImg("img/walls/treea1.png"),Tank.createImg("img/walls/treea2.png")];
	   this.changeImageTime_ = 50;
       this.camp_ = 0;
	   
       this.isBarrier4Bullet_ = false;
       this.isBarrier4Walk_ = true;
	   this.isBarrier_ = true;
       this.invincible_ = true;
}
goog.inherits(Tank.Tree, Tank.Life);

/**************message************/
Tank.Message = function(text, size, loc, color, time){
    Tank.Message.superClass_.constructor.call(this,  "message", size, loc)
    this.color_ = color || "rgb(255, 0, 0)";
    this.text_ = text;
    this.time_ = time || 30; //
    this.isBarrier4Bullet_ = false;
    this.isBarrier4Walk_ = false;
}

goog.inherits(Tank.Message, Tank.BaseObject);

Tank.Message.prototype.go = function(){
        this.time_ --;
        if(this.time_ <= 0) this.alive_ = false;
        this.loc_.y -= 1;
}
Tank.Message.prototype.draw = function(){
    var lastStyle = this.canvas_.fillStyle;
    this.canvas_.fillStyle = this.color_;
    this.canvas_.fillText(this.text_, this.loc_.x, this.loc_.y);
    this.canvas_.fillStyle = lastStyle;
}

/*******爆炸动画*********/
Tank.Explode = function(loc){
    Tank.Explode.superClass_.constructor.call(this,  "explode", null, loc); 
    this.isBarrier4Bullet_ = false;
    this.isBarrier4Walk_ = false;
    for(var i = 0; i < 11; i++){
        var img = new Image();
        img.src = "img/" + i + ".gif";
        this.imgs_.push(img);
    }
    this.time_ = 30; //持续时间
}
goog.inherits(Tank.Explode, Tank.BaseObject);
Tank.Explode.prototype.go = function(){
    Tank.Explode.superClass_.go.call(this);
    this.time_ --;
    if(this.time_ < 0) this.alive_ = false;
}
/********food*********/
/**
所有食物的父类，子类只需要重写其中的feed方法即可
  */
Tank.Food = function(loc){
    Tank.Food.superClass_.constructor.call(this,  "food-" + this.type_, null, loc); 
    this.size_ = new Tank.Point(30, 30);
    this.isFood_ = true;
    this.time_ = 50; //食物持续时间
    this.imgs_ = [];
    this.isBarrier4Bullet_ = false;
    this.isBarrier4Walk_ = true;
    this.invincible_ = true;
}
goog.inherits(Tank.Food, Tank.Life);

//当时间结束后食物会消失
Tank.Food.prototype.tick = function(){
    Tank.Food.superClass_.tick.call(this);
    this.time_ --;
    if(this.time_ < 0) this.alive_ = false;

    //最后10秒开始闪烁
    if(this.time_ < 10 && this.time_ % 2 == 1) this.visible_ = false;
    else this.visible_ = true;
}

Tank.Food.prototype.draw = function(){
    Tank.Food.superClass_.draw.call(this);
    if(this.time_ <= 10){
    var lastStyle = this.canvas_.fillStyle;
    this.canvas_.fillStyle = "rgb(255, 0, 0)";
    this.canvas_.strokeRect(this.loc_.x, this.loc_.y, this.size_.x, this.size_.y);
    this.canvas_.fillText(parseInt(this.time_) + "", this.loc_.x, this.loc_.y + this.size_.y + 15);
    this.canvas_.fillStyle = lastStyle;
    }
}

//吃到食物的时候会触发一次此方法，传入的参数是吃到此食物的物体，当食物的效果是吃到后就触发的，比如说是加血/加攻击等，应该在此方法中定义
Tank.Food.prototype.feed = function(obj){
    if(obj.hp_ != undefined){
    }
}


/**********equip***************/
/**
    所有装备的父类
  */
//装备看作是一类特殊的食物,食物被吃掉后就消失了，但是装备被吃掉后只是从地图上消失了，在被装备的物体上还存在
//所有装备都要继承此类，需要重写 equip ,go, tick, beHit, ,harm, fire 方法即可 
Tank.Equip = function(loc){
    Tank.Equip.superClass_.constructor.call(this, "noname equip", null, loc); 
    this.size_ = new Tank.Point(30, 30);
    this.isFood_ = true; //因为掉在地上的装备表现和食物相同
    this.imgs_ = [];
    this.isBarrier4Bullet_ = false;
    this.isBarrier4Walk_ = true;
}

goog.inherits(Tank.Equip, Tank.Life);
Tank.Equip.prototype.feed = function(obj){
    obj.equips_.push(this);
    this.obj_ = obj;
	this.owner_ = obj;
    this.obj_.popMessage("装备<" + this.name_ + ">");
    this.alive_ = false; //注意，此时会从地图上移除，但是在被装备的对象上仍然保存
    this.equip();
}
//穿上装备的时候触发此方法一次
Tank.Equip.prototype.equip= function(){
}
//
Tank.Equip.prototype.go = function(){
    
}
Tank.Equip.prototype.tick = function(){
    if(this.obj_){
    }
}
Tank.Equip.prototype.beHit = function(obj){
    if(this.obj_){
    }
}

Tank.Equip.prototype.harm = function(num, obj){
}
Tank.Equip.prototype.fire = function(){
}


/*兵营*/
Tank.Barrack = function(gridLoc){
    this.gridLoc_ = gridLoc;
	loc = new Tank.Point(gridLoc.x * 50, gridLoc.y * 50);

    Tank.Barrack.superClass_.constructor.call(this,  "explode", null, loc); 
    this.isBarrier4Bullet_ = true;
    this.isBarrier4Walk_ = true;
    this.invincible_ = true;
    this.imgs_ = [Tank.createImg("img/walls/barrack.png")];
    this.camp_ = 0;
    this.Life_ = Tank.RandomTank;// 此兵营会产生的小兵
    this.lifeCamp_ = 2; // 此兵营产生的小兵所属阵营
    this.amount_ = 20;  //产生的小兵总数，达到此数后不会再产生
    this.time_ = 20;    //每20秒产生一个小兵
    this.timeCount_ = this.time_;
}
goog.inherits(Tank.Barrack, Tank.BaseObject);
Tank.Barrack.prototype.tick = function(){
    Tank.Barrack.superClass_.tick.call(this);
    this.timeCount_ --;
    if(this.timeCount_ < 0) {
        this.produce();
        this.timeCount_ = this.time_;
    }
}

Tank.Barrack.prototype.produce = function(){
    if(!this.Life_) return;
    var life = new this.Life_(new Tank.Point(this.loc_.x, this.loc_.y + 50));
    life.camp_ = this.lifeCamp_;
    life.move(4);
    life.say("新鲜出炉--");
    Tank.SceneManager.push(life);
}
