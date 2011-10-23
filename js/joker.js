/**
*@author axun,lixiang 
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
*@param    {string} strClassName��Ҫ���ҵ�className
*@param#optional    {object} objElm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return   {array}
*@time 2011.10.22
*@refer http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
*/
joker.dom.getElementsByClassName=function(strClassName,objElm){
    var arrElements = (objElm == undefined)?(document.all || document.getElementsByTagName("*")):(objElm.all || objElm.getElementsByTagName("*"));
    //ֻ��ie֧��all����ie��getElementsByTagName("*")
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
*����tagNameȡ��Ԫ��,����ֵ�����飨ԭ����js����ֵ��nodeList)
*@param    {string} strTagName��Ҫ���ҵ�TagName
*@param#optional    {object} objElm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return   {array}
*@time 2011.10.23
*/
joker.dom.getElementsByTagName=function(strTagName,objElm){
	objElm = objElm || document;
	var arrResults = new Array();
	var nodes = objElm.getElementsByTagName(strTagName);
	for(var i = 0; i < nodes.length; i++){
		arrResults.push(nodes[i]);
	}
	return (arrResults);
}

/**
*	����id��ȡԪ��
*@param	{string} id
*@param#optional	{object} objElm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return {object} 
*@time 2011.10.23
*/
joker.dom.getElementById=function(strId,objElm){
	objElm = objElm || document;
	return objElm.getElementById(strId);
}

/*
*	��children�и���classname��ȡԪ��
*@param {string} strClassName:
*@param {object} objElm:
*@return {array}
*@time 2011.10.23
*/
joker.dom.getChildrenByClassName = function(strClassName, objElm){
	objElm = objElm || document;
	var children = objElm.children || objElm.childNodes;	//document��֧��children,����֧��childNodes
	var arrResults = new Array();
	for(var i = 0; i < children.length; i++){
		if(children[i].className == strClassName) arrResults.push(children[i]);
	}
	return arrResults;
}
/*
*	��children�и���tagname��ȡԪ��
*@param {string} strTagName: tagName�����ִ�Сд
*@param {object} objElm:
*@return {array}
*@time 2011.10.23
*/
joker.dom.getChildrenByTagName = function(strTagName, objElm){
	objElm = objElm || document;
	var children = objElm.children || objElm.childNodes;	//document��֧��children,����֧��childNodes
	var arrResults = new Array();
	for(var i = 0; i < children.length; i++){
		if(children[i].tagName.toUpperCase() == strTagName.toUpperCase()) arrResults.push(children[i]);
	}
	return arrResults;
}
/*
*	��children�и���id��ȡԪ��
*@param {string} strId:
*@param {object} objElm:
*@return {object}
*@time 2011.10.23
*/
joker.dom.getChildById = function(strId, objElm){
	objElm = objElm || document;
	var children = objElm.children || childNodes;
	for(var i = 0; i < children.length; i++){
		if(children[i].id == strId) return children[i];
	}
}
/**
* ��ȡԪ�ص�ͨ�÷���,֧������css2�е�ѡ������Ԫ��ѡ��������ѡ������idѡ���������ѡ��������Ԫ��ѡ����
*@param {string} strSelector :ѡ�������ʽ
*@param#optional {obj} objElm:Ŀ��Ԫ��
*@return {array}
*@author axun;
*@time 2011.10.23;
*@example joker.dom.g(".header #title a"); joker.dom.g("body.container div#utity a"); joker.dom.g("div#course > span");
*/

joker.dom.g=function(strSelector,objElm){
	var arrElements = new Array();
	arrElements.push(objElm || document);
	var tokens = strSelector.split(" ");
	var tempResults;	//�洢���ҵ��м���
	var token;
	var element;
	var childrenTag = false;	//��һ������Ƿ���> ����ǣ�����һ�β���ֻ���Һ��� �����Ǻ��
	for(var i=0;i<tokens.length;i++){
		tempResults = new Array();
		token = tokens[i];
		if(token == ">") {
			childrenTag = true;
			continue;
		}
		for(var j=0;j<arrElements.length;j++){
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
			else{	//����Ԫ��ѡ���������ܴ���div.classname����div#id,����div.classname1.classname2#id���������
				//�ȶ�#��.���зָ�
				token = token.replace(/\./g,' \.');
				token = token.replace(/\#/g,' \#');
				token = token.split(" ");
				if(childrenTag == true){
					tempResults = tempResults.concat(joker.dom.getChildrenByTagName(token[0],element));	
					//ע�⣬��Ҫ��document.getElementsByTagName��������Ϊ�����ص���nodeList���󣬶���������,��֧�����鷽����
					childrenTag = false;
				}else{
					tempResults = tempResults.concat(joker.dom.getElementsByTagName(token[0],element));	
					//ע�⣬��Ҫ��document.getElementsByTagName��������Ϊ�����ص���nodeList���󣬶���������,��֧�����鷽����
				}
				if(token.length>1){	//Ȼ��ѽ���в�����id��classname��ֵɾ��
					for(var k=1;k<token.length;k++){
						t = token[k];
						if(t.charAt(0) == '#'){
							for(var a=0;a<tempResults.length;a++){
								if(tempResults[a].id != t.substr(1)){
									tempResults.splice(a,1);
									a--;	//ע�⣬�ڱ������鲢ɾ��ʱ����ɾ����һ��Ԫ�غ�Ҫindex--�������©���Ե�ǰindexԪ�ص��жϡ���Ҫ���������
								}
							}
						}
						if(t.charAt(0) == '.'){
							for(var a=0;a<tempResults.length;a++){
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
*���������
*/
joker.io = {};

/**
*����jsonp
*@param	{string} strUrl:Ҫ���ص���Դ��ַ
*@param	{function} callback:������ɺ�ִ�еĻص�����
*@time 2011.10.22
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
