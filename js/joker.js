/**
*@author 
*@time 2011.10.22
*/

/*������ļ��󣬻��Զ�����һ��jokerȫ�ֶ���*/

var joker={};

/**
*joker.dom
*�ṩ���õ�dom����
*/

joker.dom={};

/**
*����classnameȡ��Ԫ��
*@param
*    {string} strClassName��Ҫ���ҵ�className
*    {object} objElm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
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
*	����id��ȡԪ��
*@param
*	{string}
*	{object} objElm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return 
*	{object}
*/
joker.dom.getElementById=function(strId,objElm){
	if(objElm == undefined) objElm = document;
	return objElm.getElementById(strId);
}

/**
* ��ȡԪ�ص�ͨ�÷���
*
*/
joker.dom.g=function(){
	
}


/**
*���������
*/
joker.io = {};

/**
*����jsonp
*@param
*	{string} strUrl:Ҫ���ص���Դ��ַ
*	{function} callback:������ɺ�ִ�еĻص�����
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
