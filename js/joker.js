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
/*
*在children中根据id来取元素
*@param {String} strId:
*@param {Elementlement} opt_elm:
*@return {Element}
*@time 2011.10.23
*/
joker.dom.getChildById = function(strId, opt_elm){
	objElm = opt_elm || document;
	var children = joker.dom.getChildren(objElm);
	for(var i = 0; i < children.length; i++){
		if(children[i].id == strId) return children[i];
	}
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
	return eval("("+str+")");
}


/**
  *私有函数，递归实现对json对象的序列化
  *@param {Object} obj:要序列化的对象
  *@return {String}
  *@time 2011.11.02
  *@author axun;
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
  *应该达到的效果是:对任意obj,serialize(parse(obj)) 和obj是完全一样的。
  *@param {Object} obj:
  *@return {String}
  *@time 2011.11.02
  *@author axun
  */

joker.json.serialize = function(obj){
	return joker.json._seri(obj);
}
