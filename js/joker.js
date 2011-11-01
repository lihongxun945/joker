/**
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
*@param#optional    {Element} objElm:目标元素，取目标元素的子元素
*@return   {Array}
*@time 2011.10.22
*@refer http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
*/
joker.dom.getElementsByClassName = function(strClassName, objElm){
    var arrElements = (objElm == undefined)?(document.all || document.getElementsByTagName("*")):(objElm.all || objElm.getElementsByTagName("*"));
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
*@param	{Element} objElm:目标元素，取目标元素的子元素
*@return   {Array}
*@time 2011.10.23
*/
joker.dom.getElementsByTagName = function(strTagName,objElm){
	objElm = objElm || document;
	return joker.array.nodeListToArray(objElm.getElementsByTagName(strTagName));
}

/**
*根据id获取元素
*@param	{String} id
*@param {Element} objElm:目标元素，取目标元素的子元素
*@return {Element} 
*@time 2011.10.23
*/
joker.dom.getElementById = function(strId,objElm){
	var arrElements = (objElm == undefined)?(document.all || document.getElementsByTagName("*")):(objElm.all || objElm.getElementsByTagName("*"));
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
*@param {Element} objElm:
*@return {Array}
*@time 2011.10.23
*/
joker.dom.getChildrenByClassName = function(strClassName, objElm){
	objElm = objElm || document;
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
*@param {Element} objElm:
*@return {Array}
*@time 2011.10.23
*/
joker.dom.getChildrenByTagName = function(strTagName, objElm){
	objElm = objElm || document;
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
*@param {Elementlement} objElm:
*@return {Element}
*@time 2011.10.23
*/
joker.dom.getChildById = function(strId, objElm){
	objElm = objElm || document;
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
  *删除一个子节点
  *@param {Node} parent
  *@param {Node} child
  *@return {Node}
  *@time 2011.11.01
  */
joker.dom.removeChild = function(parent,child){
	return parent.removeChild(child);
}

/**
* 获取元素的通用方法,对于不支持querySelectorAll()方法的浏览器，支持类似css2中的选择器：元素选择器，类选择器，id选择器，后代选择器，子元素选择器
*对于支持querySelectorAll()的浏览器，调用此方法，将结果转换为数组后返回。此方法支持所有的css选择器。
*@param {String} strSelector :选择器表达式
*@param {Element} objElm:目标元素
*@return {Array}
*@author axun;
*@time 2011.10.23;
*@example joker.dom.g(".header #title a"); joker.dom.g("body.container div#utity a"); joker.dom.g("div#course > span");
*/

joker.dom.q = function(strSelector, objElm){
	var arrElements = new Array();
	objElm = objElm || document;
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
joker.dom.appendChildren = function(parent, arr_children){
	for(var i = 0,length = arr_children.length; i < length; i++){
		parent.appendChild(arr_children[i]);
	}
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
joker.io.getjsonp = function(strUrl, callback){
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
	if(callback) callback(); 
}




/**
*数组方法
*/

joker.array = {};

/**
  *将一个nodeList转换成数组
  */
joker.array.nodeListToArray = function(nodes){
	var arrResults = new Array();
	for(var i = 0; i < nodes.length; i++){
		arrResults.push(nodes[i]);
	}
	return arrResults;
}

