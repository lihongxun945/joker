/**
*@author axun,lixiang 
*@time 2011.10.22
*/

/*������ļ��󣬻��Զ�����һ��jokerȫ�ֶ���*/

var joker={};

/*
*********************************************************
********************** dom ���� *************************
**********************************************************
*/
/**
*joker.dom
*�ṩ���õ�dom����
*/

joker.dom={};

/**
  *dom�ڵ�����
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
  *����һ��ElementԪ��
  *
  *
  *@time 2011.11.01
  */
joker.dom.createElement = function(strName){
	return document.createElement(strName);
}

/**
  *��ȡ���е���Ԫ��,������ע��
  *@param {Node} elm:
  *@return {Array<Node>}:
  *@time 2011.11.01
  */
joker.dom.getChildren = function(elm){
	var result = elm.children;
	if(result) return result;
	//���ڲ�֧��children���Ե����������childNodes�е�comment�ڵ�ɾ��
	var children = elm.childNodes;

	result = new Array();
	for(var i = 0, length = children.length; i < length; i++){
		if(children[i].nodeType == joker.dom.NodeType.ELEMENT)
			result.push(children[i]);
	}
	return result;
}

/**
*����classnameȡ��Ԫ��,ԭ����getElementsByClassName�����Ժܺã�����ֻ��document�д˷���
*@param    {String} strClassName��Ҫ���ҵ�className
*@param#optional    {Element} objElm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return   {Array}
*@time 2011.10.22
*@refer http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
*/
joker.dom.getElementsByClassName = function(strClassName, objElm){
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
*@param    {String} strTagName��Ҫ���ҵ�TagName
*@param	{Element} objElm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return   {Array}
*@time 2011.10.23
*/
joker.dom.getElementsByTagName = function(strTagName,objElm){
	objElm = objElm || document;
	return joker.array.nodeListToArray(objElm.getElementsByTagName(strTagName));
}

/**
*����id��ȡԪ��
*@param	{String} id
*@param {Element} objElm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return {Element} 
*@time 2011.10.23
*/
joker.dom.getElementById = function(strId,objElm){
	var arrElements = (objElm == undefined)?(document.all || document.getElementsByTagName("*")):(objElm.all || objElm.getElementsByTagName("*"));
	//ֻ��ie֧��all����ie��getElementsByTagName("*")
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
*��children�и���classname��ȡԪ��
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
*��children�и���tagname��ȡԪ��
*@param {String} strTagName: tagName�����ִ�Сд
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
*��children�и���id��ȡԪ��
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
  *ȡ�õ�һ��Element���͵ĺ��ӽڵ�
  *@param {Node} node
  *@return {Element}
  *@time 2011.11.01
  */
joker.dom.getFirstChild = function(node){
	return (node.firstChild.nodeType == joker.dom.NodeType.ElEMENT)?
		node.firstChild : joker.dom.getChildren(node)[0];
}

/**
  *ȡ�����һ��Element���͵ĺ��ӽڵ�
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
  *ȡ�ø��ڵ�
  *@param {Node} node;
  *@return {Node}
  *@time 2011.11.01
  */
joker.dom.getParentNode = function(node){
	return node.parentNode;
}

/**
  *ɾ��һ���ӽڵ�
  *@param {Node} parent
  *@param {Node} child
  *@return {Node}
  *@time 2011.11.01
  */
joker.dom.removeChild = function(parent,child){
	return parent.removeChild(child);
}

/**
* ��ȡԪ�ص�ͨ�÷���,���ڲ�֧��querySelectorAll()�������������֧������css2�е�ѡ������Ԫ��ѡ��������ѡ������idѡ���������ѡ��������Ԫ��ѡ����
*����֧��querySelectorAll()������������ô˷����������ת��Ϊ����󷵻ء��˷���֧�����е�cssѡ������
*@param {String} strSelector :ѡ�������ʽ
*@param {Element} objElm:Ŀ��Ԫ��
*@return {Array}
*@author axun;
*@time 2011.10.23;
*@example joker.dom.g(".header #title a"); joker.dom.g("body.container div#utity a"); joker.dom.g("div#course > span");
*/

joker.dom.q = function(strSelector, objElm){
	var arrElements = new Array();
	objElm = objElm || document;
	arrElements.push(objElm);
	//���ж�������Ƿ�֧��querySelectorAll(),����ǣ�����ô˷���
	if(objElm.querySelectorAll) return objElm.querySelectorAll(strSelector);

	//���ڲ�֧��querySelectorAll()�����������,�����Լ�ʵ�ֵķ���
	//����Ԥ����ʹ��ʽ�淶
	strSelector = strSelector.replace(/>/g,' > ');	//��Ԫ��ѡ���� �����ÿո����,���ܻ��������Ŀո񣬵�������ȫ��ɾ��	
	strSelector = strSelector.replace(/  /g,' ');//ɾ������Ŀո�
	var tokens = strSelector.split(" ");
	var tempResults;	//�洢���ҵ��м���
	var token;
	var element;
	var childrenTag = false;	//��һ������Ƿ���> ����ǣ�����һ�β���ֻ���Һ��� �����Ǻ��
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
				if(token.length > 1){	//Ȼ��ѽ���в�����id��classname��ֵɾ��
					for(var k = 1;k < token.length; k++){
						t = token[k];
						if(t.charAt(0) == '#'){
							for(var a = 0; a < tempResults.length; a++){
								if(tempResults[a].id != t.substr(1)){
									tempResults.splice(a,1);
									a--;	//ע�⣬�ڱ������鲢ɾ��ʱ����ɾ����һ��Ԫ�غ�Ҫindex--�������©���Ե�ǰindexԪ�ص��жϡ���Ҫ���������
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
  *��Ԫ���ӽڵ�ĩβ׷��һ�����ӽڵ�
  *@param {Node} parent:��Ԫ��
  *@param {Node} child:��Ԫ��
  *@time 2011.11.01
  */
joker.dom.appendChild = function(parent, child){
	parent.appendChild(child);
}

/**
  *��Ԫ�ؽڵ�ĩβ׷�Ӷ�����ӽڵ�
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
***********************���������*************************
**********************************************************
*/
/**
  *joker.io
  *�ṩ���õ�io����
  */
joker.io = {};

/**
*����jsonp
*@param	{string} strUrl:Ҫ���ص���Դ��ַ
*@param	{function} callback:������ɺ�ִ�еĻص�����
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
*���鷽��
*/

joker.array = {};

/**
  *��һ��nodeListת��������
  */
joker.array.nodeListToArray = function(nodes){
	var arrResults = new Array();
	for(var i = 0; i < nodes.length; i++){
		arrResults.push(nodes[i]);
	}
	return arrResults;
}

