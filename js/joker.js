/**
*设计原则：
*兼容主流的浏览器：ie6+, firefox, chrome, opera.
*dom操作除非注明，否则都忽略注释节点，比如getChildren会过滤掉注释节点。
*以"_"开头的都是私有属性
*以opt_开头的参数都是可选的
*注释中有@author 的是原创的比较重要的或者是实现比较复杂的函数,是测试的重点
*@author axun,lixiang 
*@time 2011.10.22
*/

/*引入此文件后，会自动创建一个joker全局对象*/

var joker={};
/*
*********************************************************
********************** base  *************************
**********************************************************
*/



/**
  *实现继承。在父类构造函数有参数的时候，用此方法实现的继承，可以在子类构造
  *函数中直接调用super(args)方法来调用父类的构造函数
  *此实现方法的原理是：自动将child的prototype指向parent的protoype，使子类
  *拥有父类的全部方法。但是，父类属性必须通过在子类的构造函数中调用
  *this.super函数来添加到子类，否则子类中没有父类的属性
  *如果不需要父类中的属性，而只需要其prototype中定义的方法，可以不用调用super
  *此方法实现的继承，可以用instanceof和constructor来测试子类和父类，都能正确的返回true
  *注意：inherit声明必须紧跟在子类的构造函数之后，在声明之前的子类中添加的prototype中的方法会被丢掉。
  *@param {Function} childCons:子类构造函数
  *@param {Function} parentCons:父类构造函数
  *@time 2011.11.05
  *@example:
  *function Sup(name){this.name=name;}
  *function Sub(name,age){this.super(name);this.age=age;}
  *joker.inherit(Sub,Sup);
  *var sub = new Sub("axun",123);
  *sub instanceof Sub; //true
  *sub instanceof Sup;//true
  *sub.constructor;//Sub
  */
joker.inherit = function(childCons, parentCons){
	function tempCons(){}
	tempCons.prototype = parentCons.prototype;
	childCons.prototype = new tempCons();
	childCons.superClass_ = parentCons;
	childCons.prototype.super = function(){
		//在goog基础上的改进，增加一个super方法，在子类的构造函数中可以用this.super来调用父类的构造函数，将父类的属性添加到子类上。注意不能添加到子类的__proto__上，因为__proto__是所有子类共享，而属性不应该是被共享的。
		parentCons.apply(this, arguments);
	}
	childCons.prototype.constructor = childCons;//不指定的话，就是父类的而不是子类的
}

/**
  *对比goog的实现
  *
  */
joker.goog_inherit = function(childCtor, parentCtor){
	function tempCtor() {};
	tempCtor.prototype = parentCtor.prototype;
	childCtor.superClass_ = parentCtor.prototype;
	childCtor.prototype = new tempCtor();
	childCtor.prototype.constructor = childCtor;//不指定的话，就是父类的而不是子类的
}


/**
  *数组实现的队列
  *从队尾压入元素，从队首弹出元素
  *@time 2011.11.12
  *
  */
joker.Queue = function(){
	this.queue = new Array();
}

joker.Queue.prototype.clear = function(){
	this.queue = new Array();
}

joker.Queue.prototype.push = function(obj){
	return this.queue.push(obj);

}
joker.Queue.prototype.pop = function(){
	return this.queue.shift();
}
joker.Queue.prototype.remove = function(obj){
	for(var i = 0, length = this.queue.length; i < length; i++){
		if(this.queue[i] == obj) this.queue.splice(i,1);
	}
}
joker.Queue.prototype.getArray= function(){
	return this.queue;
}

/*
********************************************************
********************** uti *************************
**********************************************************
*/
joker.uti = joker.uti || {};
/**
  *缓存一个函数，当用相同的参数调用此函数时会立即返回结果。
  *@param {Function} f:function to cache
  *@return *;
  */
joker.uti.memoize = function (f){
         var cache = {};
         return function(){
             var key = arguments.length + Array.prototype.join.call(arguments, ",");
             if(key in cache) return cache[key];
             else return cache[key]=f.apply(this, arguments);
         };
}

/*
********************************************************
********************** bom *************************
**********************************************************
*/

joker.bom = {};

/**
  *获取由url传递的变量，返回一个对象，此对象的每一个属性对应一个url变量。
  *@return {Object};
  *@time 2011.11.06
  */
joker.bom.getURLArgs = function(){
	var search = location.search;
	if(!(search && search.length > 1)) return null;
        var tokens = search.substring(1).split("&");
	var result = {};
	for(var i = 0, length = tokens.length; i < length; i++){
		var items = tokens[i].split("=");
		result[decodeURIComponent(items[0])] = decodeURIComponent(items[1]);
	}	
	return result;
}


/**
  *获取操作系统类型，浏览器类型，浏览器版本
  *@return {Object}: 三个属性:OS,browser,version
  *@ref http://www.quirksmode.org/js/detect.html;
  */
joker.bom.getBrower = function(){
var BrowserDetect = {
        init: function () {
                  this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                  this.version = this.searchVersion(navigator.userAgent)
                      || this.searchVersion(navigator.appVersion)
                      || "an unknown version";
                  this.OS = this.searchString(this.dataOS) || "an unknown OS";
              },
        searchString: function (data) {
                  for (var i=0;i<data.length;i++) {
                      var dataString = data[i].string;
                      var dataProp = data[i].prop;
                      this.versionSearchString = data[i].versionSearch || data[i].identity;
                      if (dataString) {
                          if (dataString.indexOf(data[i].subString) != -1)
                              return data[i].identity;
                      }
                      else if (dataProp)
                          return data[i].identity;
                  }
              },
        searchVersion: function (dataString) {
                   var index = dataString.indexOf(this.versionSearchString);
                   if (index == -1) return;
                   return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
               },
        dataBrowser: [
             {
                string: navigator.userAgent,
                subString: "Chrome",
                identity: "Chrome"
             },
             {   string: navigator.userAgent,
                subString: "OmniWeb",
               versionSearch: "OmniWeb/",
               identity: "OmniWeb"
             },
             {
                string: navigator.vendor,
                        subString: "Apple",
                        identity: "Safari",
                versionSearch: "Version"
             },
             {
prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
             },
             {
string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
             },
             {
string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
             },
             {
string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
             },
             {
string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
             },
             {       // for newer Netscapes (6+)
string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
             },
             {
string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
             },
             {
string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
             },
             {       // for older Netscapes (4-)
string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
             }
              ],
                  dataOS : [
                  {
string: navigator.platform,
        subString: "Win",
        identity: "Windows"
                  },
                  {
string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
                  },
                  {
string: navigator.userAgent,
        subString: "iPhone",
        identity: "iPhone/iPod"
                  },
                  {
string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
                  }
              ]

};
BrowserDetect.init();
var o = {
    "OS":BrowserDetect.OS,
    "browser":BrowserDetect.browser,
    "version":BrowserDetect.version
}
return o;
}
/*
********************************************************
********************** dom 操作 *************************
**********************************************************
*/
/**
*joker.dom
*提供常用的dom操作
*/

joker.dom={};

/**
  *dom节点类型
  *@time 2011.11.01
  */
joker.dom.NodeType = {
	ELEMENT: 1,
  	ATTRIBUTE: 2,
  	TEXT: 3,
  	CDATA_SECTION: 4,
  	ENTITY_REFERENCE: 5,
  	ENTITY: 6,
  	PROCESSING_INSTRUCTION: 7,
  	COMMENT: 8,
  	DOCUMENT: 9,
  	DOCUMENT_TYPE: 10,
  	DOCUMENT_FRAGMENT: 11,
  	NOTATION: 12  
}

/**
  *创建一个Element元素
  *
  *
  *@time 2011.11.01
  */
joker.dom.createElement = function(strName){
	return document.createElement(strName);
}

/**
  *获取所有的子元素,不包括注释
  *@param {Node} elm:
  *@return {Array<Node>}:
  *@time 2011.11.01
  */
joker.dom.getChildren = function(elm){
	var result = elm.children;
	if(result) return result;
	//对于不支持children属性的浏览器，把childNodes中的comment节点删除
	var children = elm.childNodes;

	result = new Array();
	for(var i = 0, length = children.length; i < length; i++){
		if(children[i].nodeType == joker.dom.NodeType.ELEMENT)
			result.push(children[i]);
	}
	return result;
}

/**
*根据classname取得元素,原生的getElementsByClassName兼容性很好，但是只能document有此方法
*@param    {String} strClassName：要查找的className
*@param#optional    {Element} opt_elm:目标元素，取目标元素的子元素
*@return   {Array}
*@time 2011.10.22
*@refer http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
*/
joker.dom.getElementsByClassName = function(strClassName, opt_elm){
    if(!opt_elm){
        if(document.getElementsByClassName){    //ie8及以下版本不支持此方法
            return document.getElementsByClassName(strClassName);
        }else if(querySelectorAll){
            return querySelectorAll(strClassName);  //ie8 支持此方法。
        }
    }
    var arrElements = (opt_elm == undefined)?(document.all || document.getElementsByTagName("*")):(opt_elm.all || opt_elm.getElementsByTagName("*"));
    //只有ie支持all，非ie用getElementsByTagName("*")
    var arrResults = new Array();
    var objElement;
    for(var i=0; i < arrElements.length; i++){
        objElement = arrElements[i];
        if(strClassName == objElement.className){
            arrResults.push(objElement);
        }
    }
    return (arrResults);
}

/**
*根据tagName取得元素,返回值是数组（原生的js返回值是nodeList)
*@param    {String} strTagName：要查找的TagName
*@param	{Element} opt_elm:目标元素，取目标元素的子元素
*@return   {Array}
*@time 2011.10.23
*/
joker.dom.getElementsByTagName = function(strTagName, opt_elm){
	objElm = opt_elm || document;
	return joker.array.nodeListToArray(objElm.getElementsByTagName(strTagName));
}

/**
*根据id获取元素
*@param	{String} id
*@param {Element} opt_elm:目标元素，取目标元素的子元素
*@return {Element} 
*@time 2011.10.23
*/
joker.dom.getElementById = function(strId, opt_elm){
    if(!opt_elm) return document.getElementById(strId);
	var arrElements = (opt_elm == undefined)?(document.all || document.getElementsByTagName("*")):(opt_elm.all || opt_elm.getElementsByTagName("*"));
	//只有ie支持all，非ie用getElementsByTagName("*")
	var arrResults = new Array();
	var objElement;
	for(var i=0; i < arrElements.length; i++){
		objElement = arrElements[i];
		if(strId == objElement.id){
			return objElement;
		}
	}

}

/*
*在children中根据classname来取元素
*@param {String} strClassName:
*@param {Element} opt_elm:
*@return {Array}
*@time 2011.10.23
*/
joker.dom.getChildrenByClassName = function(strClassName, opt_elm){
	objElm = opt_elm || document;
	var children = joker.dom.getChildren(objElm);
	var arrResults = new Array();
	for(var i = 0; i < children.length; i++){
		if(children[i].className == strClassName) arrResults.push(children[i]);
	}
	return arrResults;
}
/*
*在children中根据tagname来取元素
*@param {String} strTagName: tagName不区分大小写
*@param {Element} opt_elm:
*@return {Array}
*@time 2011.10.23
*/
joker.dom.getChildrenByTagName = function(strTagName, opt_elm){
	objElm = opt_elm || document;
	var children = joker.dom.getChildren(objElm);
	var arrResults = new Array();
	for(var i = 0; i < children.length; i++){
		if(children[i].tagName.toUpperCase() == strTagName.toUpperCase()) arrResults.push(children[i]);
	}
	return arrResults;
}

/**
  *取得第一个Element类型的孩子节点
  *@param {Node} node
  *@return {Element}
  *@time 2011.11.01
  */
joker.dom.getFirstChild = function(node){
	return (node.firstChild.nodeType == joker.dom.NodeType.ElEMENT)?
		node.firstChild : joker.dom.getChildren(node)[0];
}

/**
  *取得最后一个Element类型的孩子节点
  *@param {Node} node
  *@return {Element}
  *@time 2011.11.01
  */
joker.dom.getLastChild = function(node){
	if(node.lastChild.nodeType == joker.dom.NodeType.ElEMENT)
		return node.lastChild;
	var children = joker.dom.getChildren(node);
	return children[children.length-1];
}

/**
  *取得父节点
  *@param {Node} node;
  *@return {Node}
  *@time 2011.11.01
  */
joker.dom.getParentNode = function(node){
	return node.parentNode;
}



/**
* 获取元素的通用方法,对于不支持querySelectorAll()方法的浏览器，支持类似css2中的选择器：元素选择器，类选择器，id选择器，后代选择器，子元素选择器.暂不支持其他选择器，因为不常用。
*对于支持querySelectorAll()的浏览器，调用此方法，将结果转换为数组后返回。此方法支持所有的css2选择器。
*注意返回的结果总是数组，即使只有一个结果,如果希望直接返回一个dom元素，可以使用g方法。
*@param {String} strSelector :选择器表达式
*@param {Element} objElm:目标元素
*@return {Array}
*@time 2011.10.23;
*@author axun;
*@example joker.dom.q(".header #title a"); joker.dom.q("body.container div#utity a"); joker.dom.q("div#course > span");
*/

joker.dom.q = function(strSelector, opt_elm){
	var arrElements = new Array();
	objElm = opt_elm || document;
	arrElements.push(objElm);
	//先判断浏览器是否支持querySelectorAll(),如果是，则调用此方法
	if(objElm.querySelectorAll) return objElm.querySelectorAll(strSelector);

	//对于不支持querySelectorAll()方法的浏览器,则用自己实现的方法
	//进行预处理，使格式规范
	strSelector = strSelector.replace(/>/g,' > ');	//子元素选择器 总是用空格隔开,可能会产生多余的空格，但是最后会全部删掉	
	strSelector = strSelector.replace(/  /g,' ');//删除多余的空格
	var tokens = strSelector.split(" ");
	var tempResults;	//存储查找的中间结果
	var token;
	var element;
	var childrenTag = false;	//上一个标记是否是> 如果是，则下一次查找只查找孩子 而不是后代
	for(var i=0; i<tokens.length; i++){
		tempResults = new Array();
		token = tokens[i];
		if(token == ">") {
			childrenTag = true;
			continue;
		}
		for(var j = 0; j < arrElements.length; j++){
			element = arrElements[j];
			if(token.charAt(0) == '#') {	//id
				if(childrenTag == true){
					tempResults.push(joker.dom.getChildById(token.substr(1),element));
					childrenTag = false;
				}else{
					tempResults.push(joker.dom.getElementById(token.substr(1),element));
				}
			}
			else if(token.charAt(0) == '.') {
				if(childrenTag == true){
					tempResults = tempResults.concat(joker.dom.getChildrenByClassName(token.substr(1),element));
					childrenTag = false;
				}else {
					tempResults = tempResults.concat(joker.dom.getElementsByClassName(token.substr(1),element));
				}
			}
			else{	//对于元素选择器，可能存在div.classname或者div#id,或者div.classname1.classname2#id这样的情况
				//先对#和.进行分割
				token = token.replace(/\./g,' \.');
				token = token.replace(/\#/g,' \#');
				token = token.split(" ");
				if(childrenTag == true){
					tempResults = tempResults.concat(joker.dom.getChildrenByTagName(token[0],element));	
					//注意，不要用document.getElementsByTagName方法，因为它返回的是nodeList对象，而不是数组,不支持数组方法。
					childrenTag = false;
				}else{
					tempResults = tempResults.concat(joker.dom.getElementsByTagName(token[0],element));	
					//注意，不要用document.getElementsByTagName方法，因为它返回的是nodeList对象，而不是数组,不支持数组方法。
				}
				if(token.length > 1){	//然后把结果中不符合id和classname的值删除
					for(var k = 1;k < token.length; k++){
						t = token[k];
						if(t.charAt(0) == '#'){
							for(var a = 0; a < tempResults.length; a++){
								if(tempResults[a].id != t.substr(1)){
									tempResults.splice(a,1);
									a--;	//注意，在遍历数组并删除时，当删除了一个元素后要index--，否则会漏掉对当前index元素的判断。不要犯这个错误。
								}
							}
						}
						if(t.charAt(0) == '.'){
							for(var a = 0; a<tempResults.length; a++){
								if(tempResults[a].className != t.substr(1)){
									tempResults.splice(a,1);
									a--;
								}
							}
						}
					}
				}
			}
		}
		arrElements = tempResults;
	}
	return arrElements;
}

/**
  *此方法和q方法唯一的区别是：此方法只会返回第一个符合的结果，而忽略其他结果
  **@param {String} strSelector :选择器表达式
  *@param {Element} objElm:目标元素
  *@return {Node}
  *@time 2011.10.23;
  *@example joker.dom.g(".header #title a"); joker.dom.g("body.container div#utity a"); joker.dom.g("div#course > span");
  *
  */
joker.dom.g = function(strSelector, opt_elm){
	return joker.dom.q(strSelector, opt_elm)[0];
}

/**
  *删除一个子节点,返回被删除的节点
  *@param {Node} parent
  *@param {Node} child
  *@return {Node}
  *@time 2011.11.01
  */
joker.dom.removeChild = function(parent,child){
	return parent.removeChild(child);
}

/**
  *删除一个节点,返回被删除的节点
  *@param {Node}
  *@return {Node}
  *@time 2011.11.01
  */
joker.dom.removeNode = function(node){
	return node.parentNode.removeChild(node);
}

/**
  *清空一个节点的子节点,返回被删除的节点数组
  *@param {Node} parent
  *@return {Array<Node>}:被删除的节点 
  *@time 2011.11.02
  */
joker.dom.removeChildren = function(parent){
	var arrChildren = new Array();
	var child = joker.dom.getFirstChild(parent);
	while(child){
		arrChildren.push(child);
		joker.dom.removeChild(parent,child);
		child = joker.dom.getFirstChild(parent);
	}
	return arrChildren;
}

/**
  *向元素子节点末尾追加一个孩子节点
  *@param {Node} parent:父元素
  *@param {Node} child:子元素
  *@time 2011.11.01
  */
joker.dom.appendChild = function(parent, child){
	parent.appendChild(child);
}

/**
  *向父元素节点末尾追加多个孩子节点
  *@param {Node} parent:
  *@param {Array<Node>} children:
  *@time 2011.11.01
  */
joker.dom.appendChildren = function(parent, arrChildren){
	for(var i = 0,length = arrChildren.length; i < length; i++){
		parent.appendChild(arrChildren[i]);
	}
}


/**
  *在父元素指定的子元素前追加一个子元素,返回被追加的元素,
  *@param {Node} child:要追加的子元素
  *@param {Node} parent:父元素
  *@param {Node} targetChild:作为参照的子元素,如果不存在则追加到末尾
  *@return {Node}
  *@time 2011.11.02
  */
joker.dom.insertChildBefore = function(child, parent, opt_targetChild){
	return parent.insertBefore(child, opt_targetChild);
}


/**
  *在父元素的子元素中的指定位置前追加一个子元素，返回被添加的元素
  *@param {Node} child:要添加的子元素
  *@param {Node} parent:
  *@param {Integer} opt_index:
  *@return {Node}
  *@time 2011.11.02
  */
joker.dom.insertChildBeforeIndex = function(child, parent, opt_index){
	return joker.dom.insertChildBefore(child, parent, joker.dom.getChildren(parent)[opt_index]);
}

/**
  *替换父节点中指定的子节点,返回替换后的节点,
  *@param {Node} child:要替换的子元素
  *@param {Node} parent:父元素
  *@param {Node} targetChild:被替换的元素
  *@return {Node}
  *@time 2011.11.02
  */
joker.dom.replaceChild = function(child, parent, opt_targetChild){
	return parent.replaceChild(child, opt_targetChild);
}

/**
  *当前窗口的滚动位置
  *@param {Window}: window
  *@return {Object}:obj.x, obj.y
  *@ref <<javascript the definitive guide>>
  */
joker.dom.getPageOffset = function(opt_win){
    var w = opt_win || window;
    if(w.pageXOffset != null) return {x:w.pageXOffset, y:w.pageYOffset};
    //for ie
    var d = w.document;
    if(document.compatMode == "CSS1Compat"){
        return {x:d.documentElement.scrollLeft, y:d.documentElement.scrollTop};
    }
    //for quirks mode
    return {x:d.body.scrollLeft, y:d.body.scrollTop};
}

/**
  *当前可视窗口的大小
  *@param {Window}: window
  *@return {Object}:obj.w, obj.h
  *@ref <<javascript the definitive guide>>
  */
joker.dom.getViewportSize = function(opt_win){
    var w = opt_win || window;
    if(w.innerWidth != null) return {w:w.innerWidth, h:w.innerHeight};
    //for ie8-
    var d = w.document;
    if(document.compatMode == "CSS1Compat"){
        return {w:d.documentElement.clientWidth, h:d.documentElement.clientHeight};
    }
    //for quirks mode
    return {w:d.body.clientWidth, h:d.body.clientHeight};
}


/*
*********************************************************
***********************输入输出流*************************
**********************************************************
*/
/**
  *joker.io
  *提供常用的io操作
  */
joker.io = {};

/**
*加载jsonp
*@param	{string} strUrl:要加载的资源地址
*@param	{function} callback:加载完成后执行的回调函数
*@time 2011.10.22
*/
joker.io.getjsonp = function(strUrl, opt_callback){
	var head = document.getElementsByTagName( "head" )[ 0 ] || document.documentElement,
	script = document.createElement( "script" );
	script.async = "async";
	script.src = strUrl;
	// Attach handlers for all browsers
	script.onload = script.onreadystatechange = function( _, isAbort ) {
		if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {
			// Handle memory leak in IE
			script.onload = script.onreadystatechange = null;
			if ( head && script.parentNode ) {
				head.removeChild( script );
			}
			// Dereference the script
			script = undefined;
			// Callback if not abort
		}
	};
	// Use insertBefore instead of appendChild to circumvent an IE6 bug.
	// This arises when a base node is used (#2709 and #4378).
	head.insertBefore( script, head.firstChild);
	if(opt_callback) opt_callback(); 
}
/**
  *只能是异步的
  */
joker.io.ajax = function(url, opt_args, opt_callback, opt_method){
    if(!url) return;
    var args = opt_args || "";
    var method = opt_method || "POST";
    var callback = opt_callback || null;
    var xhr;
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    }else{// code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState==4 && xhr.status==200)
        {
            var str = xhr.responseText || "";
            var e = new joker.io.AjaxEventObject(str);
            if(callback) callback(e);
        }
    } 
    xhr.open(method, url, true);
    xhr.send(args);

}
joker.io.AjaxEventObject = function(str){
    this.str = str || "";
    this.json = joker.json.parse(str);
}

joker.io.AjaxEventObject.prototype.getString = function(){
    return this.str;
}
joker.io.AjaxEventObject.prototype.getJson = function(){
    return this.json;
}
/*
*********************************************************
*********************** Array *************************
**********************************************************
*/

/**
*数组方法
*/

joker.array = {};

/**
  *将一个nodeList转换成数组
  *@param {NodeList} nodes
  *@return {Array<Node>}
  *@time 2011.11.02
  */
joker.array.nodeListToArray = function(nodes){
	var arrResults = new Array();
	for(var i = 0; i < nodes.length; i++){
		arrResults.push(nodes[i]);
	}
	return arrResults;
}


/*
*********************************************************
*********************** JSON *************************
**********************************************************
*/

/**
  *json处理
  *
  */
joker.json = joker.json || {};

/**
  *将字符串转成json对象，注意先要进行安全性验证
  *@param {String} str:
  *@return {Object}
  *@time 2011.11.02
  */
joker.json.parse = function(str){
    if(window.JSON) window.JSON.parse(str)
	return eval("("+str+")");
}


/**
  *私有函数，递归实现对json对象的序列化
  *@param {Object} obj:要序列化的对象
  *@return {String}
  *@time 2011.11.02
  */
joker.json._seri = function(obj){
	var strResult = "";
	//先检测是不是数组，不要把顺序搞反了，因为数组也是对象
	if(obj instanceof Array){
		strResult += "[";
		for(var i = 0, length = obj.length; i < length; i++){
			strResult += this._seri(obj[i])+((i == length - 1)?"":",");
		}
		strResult += "]";
		return strResult;
	}
	//再检查是不是对象
	if(obj instanceof Object){
		strResult += "{";
		var first = true;//是不是第一次循环，用来判断是不是要加","
		for(var key in obj){
			strResult += (first?"":",")+key+":"+this._seri(obj[key]);
			first = false;
		}
		
		strResult += "}";
		return strResult;
	}
	//不是数组，也不是对象，则是 字符串，数字或者布尔类型

	if((typeof obj) == "number")
		return obj;
	if((typeof obj) == "string"){
		return "\""+obj+"\"";
	}
	return obj;

}

/**
  *递归实现对json对象的序列化，调用私有函数_seri来实现。
  *递归实现对于包含大量数据的json对象可能存在性能上的问题。
  *正确的serialize函数应该达到的效果是:对任意obj,serialize(parse(obj)) 和obj是完全一样的。
  *@param {Object} obj:
  *@return {String}
  *@time 2011.11.02
  *@author axun
  */

joker.json.serialize = function(obj){
    if(window.JSON) return window.JSON.stringify(obj);
	return joker.json._seri(obj);
}

/**
  *cookie操作
  *直接打开本地文件时是无法操作cookie的。
  */
//还没完全测试过，下次先测试这个
joker.cookie = joker.cookie || {};

/**
  *默认的参数，如果用户不指定相应的参数，则使用默认的参数。
  *
  */
joker.cookie._defaluts = {
	expireHours : 24*30, //默认保存一个月
	path : "/",//默认是根目录访问
}

/**
  *获取本地cookie，并将其值存在对象属性中，返回一个对象
  *@return {Object};
  *@time 2011.11.03
  *@author axun
  */
joker.cookie.getCookieObject = function(){
	var cookieStr = document.cookie;
	if(cookieStr == "") return {};	//没有取到cookie
	var tokens = cookieStr.split(";");
	var objCookie = {};
	var name,value;
	for(var i = 0, length = tokens.length; i < length; i++){
		name = tokens[i].split("=")[0];
		value = tokens[i].split("=")[1] || null;
		objCookie[name] = value;
	}
	return objCookie;
}


/**
  *根据name取得cookie
  *@param {String} strName:名字
  *@return {String}:值
  *@time 2011.11.03
  *@author axun
  */
joker.cookie.getCookie = function(strName){
	var cookie = this.getCookieObject();
	return cookie[strName];
}

/**
  *设置一个cookie，如果不存在则添加，如果存在则改变其值
  *@param {String} strName;
  *@param {String} strValue
  *@param {Number} opt_expireHours:有效时间，以小时计算
  *@param {String} opt_path:可访问的路径
  *@param {String} opt_domain:可访问的域
  *@time 2011.11.03
  *@author axun
  */
joker.cookie.setCookie = function(strName, strValue, opt_expireHours, opt_path, opt_domain){
	var expireHours = opt_expireHourse || this._defaults.expireHours;
	var path = opt_path || this._defaults.path;
	var domain = opt_domain || null;
	var cookieString = strName + "=" + encodeURIComponent(strValue);
	var date = new Date();
	date.setTime(date.getTime() + expireHours * 3600 * 1000);
	cookieString += ";expires=" + date.toGMTString();
	cookieString += ";path=" + path;
	if(domain) cookieString += ";domain=" +domain;
	document.cookie = cookieString;
}	

/**
  *删除一个cookie
  *@param {String} strName
  *@time 2011.11.03
  *@author axun
  */
joker.cookie.deleteCookie = function(strName){
	this.setCookie(strName, "null", -1); 
}



/*
********************************************************
********************** 事件处理 *************************
**********************************************************
*/
/**
  *把事件分为两种基本类型：dom事件 和 自定义事件。
  *dom事件的触发是由浏览器来完成的，需要浏览器的支持,事件类型是固定的。
  *而自定义事件，是由代码触发的，可以自定义任意类型的事件.
  *
  */

/**
  *dom事件类型
  *@time 2011.11.12
  */
joker.events = joker.events || {};
joker.events.EventType = {
	CLICK : "click",
	DBCLICK : "dbclick",
	MOUSEDOWN : "mousedown",
	MOUSEOUT : "mouseout",
	MOUSEUP : "mouseup",
	MOUSEOVER : "mouseover",
	MOUSEMOVE : "mousemove",
	
	KEYUP : "keyup",
	KEYDOWN : "keydown",
	KEYPRESS : "keypress",

	LOAD : "load",
	UNLOAD : "unload",
}

/**
  *添加事件监听.
  *@param {Node} element:
  *@param {String} type:
  *@param {Function} handler:
  *@time 2011.11.12
  *@ref 《JavaScript 高级程序设计（第二版）》p290
  */
joker.events.addListener = function(element, type, handler){
	if(!element) return;
	if(element.addEventListener){
		//对于非ie浏览器
		element.addEventListener(type, handler, false);
	}else if(element.attachEvent){
		//对于ie浏览器
		element.attachEvent("on" + type, handler);
	}else {
		//对于不支持dom2事件的浏览器
		element["on" + type] = handler;
	}

}

/**
  *移除事件监听.
  *@param {Node} element:
  *@param {String} type:
  *@param {Function} handler:
  *@time 2011.11.12
  *@ref 《JavaScript 高级程序设计（第二版）》p290
  */
joker.events.removeListener = function(element, type, handler){
	if(element.removeEventListener){
		element.removeEventListener(type, handler, false);
	}else if(element.detachEvent){
		element.detachEvent("on"+type, handler);
	}else {
		element["on" + type] = null;
	}
}

/**
  *将event对象转换成标准化的event对象，其拥有e.target,e.preventDefault,e.stopPropagation方法
  *@param {Object} e
  *@return {Object}
  *@ref 《javascript 高级程序设计（第二版）》p295
  */
joker.events.getEvent = function(e){
	e = e || window.event;
	e.target = e.target || e.srcElement;
	e.preventDefault = e.preventDefault || function(){e.returnValue = false;};
	e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true;};
	return e;
}
