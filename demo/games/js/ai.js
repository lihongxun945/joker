

Tank.AI = function(obj){
    this.obj_  = obj;
}
goog.inherits(Tank.AI, goog.ui.Component);

Tank.AI.prototype.go = function() {}
Tank.AI.prototype.tick = function() {}
Tank.AI.prototype.beHit = function(obj){};
Tank.AI.prototype.hit = function(obj){};
Tank.AI.prototype.harm = function(num, obj){};
Tank.AI.prototype.beHarmed = function(obj, showMessage){}
Tank.AI.prototype.outOfRange = function(){};



/*
   KeyAI 响应键盘事件
   */
Tank.KeyAI = function(obj){
    Tank.KeyAI.superClass_.constructor.call(this, obj); 
    this.getHandler().listen(Tank.listenBody_, goog.events.EventType.KEYDOWN, this.onKeyDown); 
    this.getHandler().listen(Tank.listenBody_, goog.events.EventType.KEYUP, this.onKeyUp); 

}
goog.inherits(Tank.KeyAI, Tank.AI);
Tank.KeyAI.prototype.outOfRange = function(){
        this.obj_.alive_ = true;
        this.obj_.loc_ = new Tank.Point(this.obj_.lastLoc_);
}
Tank.KeyAI.prototype.go = function(){
    this.parseDirec();
}
Tank.KeyAI.prototype.parseDirec = function(){
    if(this.up_) this.obj_.moveDirec_ = 0;
    if(this.right_) this.obj_.moveDirec_ = 2;
    if(this.down_) this.obj_.moveDirec_ = 4;
    if(this.left_) this.obj_.moveDirec_ = 6;

    if(this.up_ && this.right_) this.obj_.moveDirec_ = 1;
    if(this.right_ && this.down_) this.obj_.moveDirec_ = 3;

    if(this.down_ && this.left_) this.obj_.moveDirec_ = 5;
    if(this.left_ && this.up_) this.obj_.moveDirec_ = 7;

    if(this.up_ || this.right_ || this.down_ || this.left_) this.obj_.moving_ = true;
    else this.obj_.moving_ = false;
}
Tank.KeyAI.prototype.onKeyDown = function(e){
    switch(e.keyCode){
        case(goog.events.KeyCodes.UP):
            this.up_ = true;
            break;
        case(goog.events.KeyCodes.RIGHT):
            this.right_ = true;
            break;
        case(goog.events.KeyCodes.DOWN):
            this.down_ = true;
            break;
        case(goog.events.KeyCodes.LEFT):
            this.left_ = true;
            break;
        case(goog.events.KeyCodes.A):
            this.obj_.startFire();;
            break;

    }
}
Tank.KeyAI.prototype.onKeyUp = function(e){
    switch(e.keyCode){
        case(goog.events.KeyCodes.UP):
            this.up_ = false;
            break;
        case(goog.events.KeyCodes.RIGHT):
            this.right_ = false;
            break;
        case(goog.events.KeyCodes.DOWN):
            this.down_ = false;
            break;
        case(goog.events.KeyCodes.LEFT):
            this.left_ = false;
            break;
        case(goog.events.KeyCodes.A):
            this.obj_.stopFire();
            break;
    }
}


/*
   随机的走动,碰到障碍物后会随机的改变方向
   如果当前正在进行攻击动作，则不会触发随即走动和转向
*/
Tank.RandomMoveAI = function(obj, moveProb){
    Tank.RandomMoveAI.superClass_.constructor.call(this, obj);
    this.autoTurnProbility_ = 1;	
	this.moveProb_ = moveProb || 50;	//移动时间占的比例
	this.willStop_ = stop || false;//是否会停止移动
}
goog.inherits(Tank.RandomMoveAI, Tank.AI);
Tank.RandomMoveAI.prototype.go = function(){
	if(this.obj_.firing_ == false && Tank.rand(this.autoTurnProbility_)){
		this.randomTurn();
	}
		
}
Tank.RandomMoveAI.prototype.tick = function(){
	if(this.obj_.firing_ == true) return;
	if(Tank.rand(this.moveProb_)){
			this.obj_.moving_ = true;
		}else{
			this.obj_.moving_ = false;
		}
}
Tank.RandomMoveAI.prototype.outOfRange = function(){
        this.obj_.alive_ = true;
        this.obj_.loc_ = new Tank.Point(this.obj_.lastLoc_);
        this.randomTurn();

}
Tank.RandomMoveAI.prototype.randomTurn = function(){
    var i = parseInt(Math.random() * 8); 
    this.obj_.moveDirec_ = i;

}
Tank.RandomMoveAI.prototype.hit = function(obj){
    if(obj.isBarrier4Walk_ && (obj.camp_ != this.obj_.camp_) && !obj.isFood_ && !obj.isBullet_){
        this.randomTurn();
    }
}

/*
    随机fire ai
   */
Tank.RandomFireAI = function(obj){
    Tank.RandomFireAI.superClass_.constructor.call(this, obj);
    this.autoFireProb_ = 20;
}
goog.inherits(Tank.RandomFireAI, Tank.AI);
Tank.RandomFireAI.prototype.tick = function(){
    if(Tank.rand(this.autoFireProb_)){
        this.obj_.startFire();
    }else {
        this.obj_.stopFire();
    }
}

/**
	自动瞄准攻击射程内的敌人,但是不会追击。会优先攻击 攻击自己的敌人
*/
Tank.AutoFireAI = function(obj){
    Tank.AutoFireAI.superClass_.constructor.call(this, obj);
	this.range_ = this.obj_.fireRange_;
	this.target_ = null;    //当前锁定的攻击对象
}
goog.inherits(Tank.AutoFireAI, Tank.AI);
Tank.AutoFireAI.prototype.tick = function(){	//若是tick，则瞄准并攻击的延迟在1秒以内，若是放在go中，则延迟可以忽略
    if(this.target_ && this.target_.alive_){
        if(Tank.getDistance(this.obj_, this.target_) <= this.range_)
        {
            var target = this.target_;
            var obj = this.obj_;
            this.obj_.moveDirec_ = Tank.getDirect(this.obj_.loc_, this.target_.loc_);
            this.obj_.startFire();
            return;
        }
        else{
            this.obj_.stopFire();
            this.target_ = null;
        }
    }

    this.obj_.stopFire();
    this.target_ = null;
    var objs = Tank.SceneManager.getObjsByScopeAndCamp(this.obj_.loc_, this.range_, this.obj_.camp_ == 1 ? 2 : 1);
    if(objs.length > 0 && !(objs[0].isBullet_)) 
    {
        this.target_ = objs[0];
        console.log("锁定目标", this.target_);
    }

}
Tank.AutoFireAI.prototype.beHarmed = function(obj, showMessage){
	if(obj.isBullet_ ) obj = obj.owner_; //子弹的伤害，来源是发射子弹的物体
	this.obj_.moveDirec_ = Tank.getDirect(this.obj_.loc_, obj.loc_);
	this.obj_.move();
}

/**
	自动说话
*/
Tank.AutoTalkAI = function(obj, opt_beHarmedWords, opt_nearlyDeathWords, opt_randomWords, opt_randomSayProb){
    Tank.AutoTalkAI.superClass_.constructor.call(this, obj);
	this.range_ = this.obj_.fireRange_;
	this.target_ = null;    //当前锁定的攻击对象
	this.beHarmedWords_ = opt_beHarmedWords || ["oh!fuck!", "不疼不疼!"];	//被攻击时说的话, 随即选择一句
	this.nearlyDeathWords_ = opt_nearlyDeathWords || ["救命啊！", "快逃啊！"];	//快死时说的话，随即选择一句
	this.randomWords_ = opt_randomWords || ["兄弟们大家一起上！", "哈哈……", "come on baby!", "我会喷火你信吗", "来，战个痛快！" ]	//随机选择一句
	this.randomSayProb_ = opt_randomSayProb || 5;	//随即说话的概率
}
goog.inherits(Tank.AutoTalkAI, Tank.AI);
Tank.AutoTalkAI.prototype.tick = function(){	//若是tick，则瞄准并攻击的延迟在1秒以内，若是放在go中，则延迟可以忽略
	if(Tank.rand(this.randomSayProb_)){
		this.obj_.say(this.randomSelect(this.randomWords_));
	}

}
Tank.AutoTalkAI.prototype.beHarmed = function(obj, showMessage){
	this.obj_.say(this.randomSelect(this.beHarmedWords_));
	if(this.obj_.hp_ < this.obj_.hpLimit_/3) this.obj_.say(this.randomSelect(this.nearlyDeathWords_));
}
Tank.AutoTalkAI.prototype.randomSelect = function(arr){
	return arr[parseInt(Math.random() * arr.length)];
}
