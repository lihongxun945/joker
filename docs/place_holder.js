window.G || (window.G = {});



/*

1. value��ʽģ��û�����壬�ƻ���ʵvalueֵ����form�ύ�������������⣬��ʹ������ʽģ��



2. ���ȿ���ԭ��placeholder֧��



3. API�����ʽ�󶨣���ѡvalueֵָ�������ȼ���ߣ����placeholder����ֵ��ʡ����ʹ��placeholder����ֵ��





���ã�

G.placeholder.bind(el, val, cls)



el:

1. string(id)

2. dom����(����getElementsByTagName)

3. array[string, dom](id ���� dom)



val��

��ʾ���ݣ���ʡ�ԣ�Ϊ����HTML5�Ƽ�ʹ��placeholder����



cls:

placeholder���ӦclassName��ʡ��Ĭ��Ϊ"placeholder"

*/

G.placeholder = {

	

	//����Ƿ�ԭ��֧��support����webkit��

	support: function() {

		var needle = document.createElement("INPUT"),

			

			//���£�chrome��placeholder����bug

			is = !!("placeholder" in needle);

		needle = null;

		return is;

	}(),

	

	//���£�����chrome���жϣ�����placeholder����bug

	isChrome: function() {

		return /chrome/.test(navigator.userAgent.toLowerCase());

	}(),

	

	byId: function(id) {

		return "string" === typeof id ? document.getElementById(id) : id;

	},

	

	on: document.addEventListener ? function(el, type, callback){

		el.addEventListener(type, callback, !1 );

	} : function(el, type, callback){

		el.attachEvent( "on" + type, callback );

	},

	

	map: function(obj, fun) {

		var i = 0,

			l = obj.length;

		for(; i < l; i++) {

			fun && fun.call(this, obj[i]);

		}

	},

	

	/*

	getCoords: function(el){

		var box = el.getBoundingClientRect(),

			doc = el.ownerDocument,

			body = doc.body,

			html = doc.documentElement,

			clientTop = html.clientTop || body.clientTop || 0,

			clientLeft = html.clientLeft || body.clientLeft || 0,

			top  = box.top  + (self.pageYOffset || html.scrollTop  ||  body.scrollTop ) - clientTop,

			left = box.left + (self.pageXOffset || html.scrollLeft ||  body.scrollLeft) - clientLeft;

		return {"x": left, "y": top};

	},

	*/

	

	addSupport: function(el, val, cls) {

		//��ȡdom������val

		val = val || el.getAttribute("placeholder");

		

		if(!val) {

			return;

		}

		

		//�ر���chrome

		(this.isChrome || el.tagName === "TEXTAREA") && (el.placeholder = "");

		

		var wrap = el.parentNode.insertBefore(document.createElement("SPAN"), el),

			holder = wrap.cloneNode(false);

			

		this.holder = holder;

		wrap.style.cssText = "display:inline-block;position:relative;z-index:10;";

		wrap.appendChild(el);

		

		holder.innerHTML = val;

		

		//��Ԥ��Ϊdisplay:none��������

		holder.style.cssText = "position:absolute;display:none;top:0;left:0;text-indent:3px;pointer-events:none;color:#999;*padding-top:1px;-moz-user-select:none;-webkit-user-select:none;-khtml-user-select:none;line-height:" + el.offsetHeight + "px";

		holder.className = cls;

		wrap.appendChild(holder);

		/*

		���Զ�λ��ʽ�����豣֤�������Զ�λ �� �Զ���style

		var holder = document.createElement("SPAN");

		holder.innerHTML = val;

		holder.style.cssText = "position:absolute;top:" + Math.round(this.getCoords(el).y) + "px;left:" + Math.round(this.getCoords(el).x) +"px;text-indent:3px;pointer-events:none;color:#999;*padding-top:1px;-moz-user-select:none;-webkit-user-select:none;-khtml-user-select:none;line-height:" + el.offsetHeight + "px";

		holder.className = cls;

		el.parentNode.insertBefore(holder, el);

		*/

		

		//���input�Ƿ�Ĭ����ֵ

		setTimeout(function() {

			holder.style.display = el.value ? "none" : "";

		}, 16);

		

		//ת��click�¼���������mousedown��

		this.on(holder, "click", function() {

			el.focus();

		});

		

		this.on(el, "focus", function() {

			holder.style.display = "none";

		});

		

		this.on(el, "blur", function() {

			holder.style.display = el.value ? "none" : "";

		});

	},

	

	//���£������ⲿ�޸Ľӿ�

	set: function(val) {

		var holder = this.holder;

		this.support && !this.isChrome ? holder.placeholder = val : holder.innerHTML = val;

		return this;

	},

	

	bind: function(el, val, cls) {

		if(!el) {

			return this;

		}

		

		//��������chrome�ж�(����textarea���͵�ʼ��ģ�⣬��Ĭ�ϵ���ʽ���ƺͻ��д�������)

		else if(this.support && !this.isChrome && !el.tagName === "TEXTAREA") {

			this.holder = this.byId(el);

			return this;

		}

		

		val = val || "";

		cls = cls || "placeholder";

		

		//string

		if(typeof el === "string") {

			(el = this.byId(el)) && this.addSupport(el, val, cls);

		}

		

		//�����dom����

		else {

			this.map(el, function(item) {

				(item = this.byId(item)) && this.addSupport(item, val, cls);

			})

		}

		

		return this;

	}

}
