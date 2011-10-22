/**
*@author 
*@time 2011.10.22
*/

/*引入此文件后，会自动创建一个joker全局对象*/

var joker={};

/**
*joker.dom
*提供常用的dom操作
*/

joker.dom={};

/**
*根据classname取得元素
*@param
*    {string} strClassName：要查找的className
*    {object} objElm:目标元素，取目标元素的子元素
*@return
*	{array} 
*/
joker.dom.getElementsByClassName=function(strClassName,objElm){
    var arrElements = (objElm == undefined)?document.all:objElm.all;
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
*	根据id获取元素
*@param
*	{string}
*	{object} objElm:目标元素，取目标元素的子元素
*@return 
*	{object}
*/
joker.dom.getElementById=function(strId,objElm){
	if(objElm == undefined) objElm = document;
	return objElm.getElementById(strId);
}

/**
* 获取元素的通用方法
*
*/
joker.dom.g=function(){
	
}


/**
*输入输出流
*/
joker.io = {};

/**
*加载jsonp
*@param
*	{string} strUrl:要加载的资源地址
*	{function} callback:加载完成后执行的回调函数
*/
joker.io.getjsonp=function(strUrl,callback){
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
