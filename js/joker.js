/**
*���ԭ��
*�����������������ie6+, firefox, chrome, opera.
*dom��������ע�������򶼺���ע�ͽڵ㣬����getChildren����˵�ע�ͽڵ㡣
*��"_"��ͷ�Ķ���˽������
*��opt_��ͷ�Ĳ������ǿ�ѡ��
*ע������@author ����ԭ���ıȽ���Ҫ�Ļ�����ʵ�ֱȽϸ��ӵĺ���,�ǲ��Ե��ص�
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
*@param#optional    {Element} opt_elm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return   {Array}
*@time 2011.10.22
*@refer http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
*/
joker.dom.getElementsByClassName = function(strClassName, opt_elm){
    var arrElements = (opt_elm == undefined)?(document.all || document.getElementsByTagName("*")):(opt_elm.all || opt_elm.getElementsByTagName("*"));
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
*@param	{Element} opt_elm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return   {Array}
*@time 2011.10.23
*/
joker.dom.getElementsByTagName = function(strTagName, opt_elm){
	objElm = opt_elm || document;
	return joker.array.nodeListToArray(objElm.getElementsByTagName(strTagName));
}

/**
*����id��ȡԪ��
*@param	{String} id
*@param {Element} opt_elm:Ŀ��Ԫ�أ�ȡĿ��Ԫ�ص���Ԫ��
*@return {Element} 
*@time 2011.10.23
*/
joker.dom.getElementById = function(strId, opt_elm){
	var arrElements = (opt_elm == undefined)?(document.all || document.getElementsByTagName("*")):(opt_elm.all || opt_elm.getElementsByTagName("*"));
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
*��children�и���tagname��ȡԪ��
*@param {String} strTagName: tagName�����ִ�Сд
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
*��children�и���id��ȡԪ��
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
* ��ȡԪ�ص�ͨ�÷���,���ڲ�֧��querySelectorAll()�������������֧������css2�е�ѡ������Ԫ��ѡ��������ѡ������idѡ���������ѡ��������Ԫ��ѡ����.�ݲ�֧������ѡ��������Ϊ�����á�
*����֧��querySelectorAll()������������ô˷����������ת��Ϊ����󷵻ء��˷���֧�����е�css2ѡ������
*ע�ⷵ�صĽ���������飬��ʹֻ��һ�����,���ϣ��ֱ�ӷ���һ��domԪ�أ�����ʹ��g������
*@param {String} strSelector :ѡ�������ʽ
*@param {Element} objElm:Ŀ��Ԫ��
*@return {Array}
*@time 2011.10.23;
*@author axun;
*@example joker.dom.q(".header #title a"); joker.dom.q("body.container div#utity a"); joker.dom.q("div#course > span");
*/

joker.dom.q = function(strSelector, opt_elm){
	var arrElements = new Array();
	objElm = opt_elm || document;
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
  *�˷�����q����Ψһ�������ǣ��˷���ֻ�᷵�ص�һ�����ϵĽ�����������������
  **@param {String} strSelector :ѡ�������ʽ
  *@param {Element} objElm:Ŀ��Ԫ��
  *@return {Node}
  *@time 2011.10.23;
  *@example joker.dom.g(".header #title a"); joker.dom.g("body.container div#utity a"); joker.dom.g("div#course > span");
  *
  */
joker.dom.g = function(strSelector, opt_elm){
	return joker.dom.q(strSelector, opt_elm)[0];
}

/**
  *ɾ��һ���ӽڵ�,���ر�ɾ���Ľڵ�
  *@param {Node} parent
  *@param {Node} child
  *@return {Node}
  *@time 2011.11.01
  */
joker.dom.removeChild = function(parent,child){
	return parent.removeChild(child);
}

/**
  *���һ���ڵ���ӽڵ�,���ر�ɾ���Ľڵ�����
  *@param {Node} parent
  *@return {Array<Node>}:��ɾ���Ľڵ� 
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
joker.dom.appendChildren = function(parent, arrChildren){
	for(var i = 0,length = arrChildren.length; i < length; i++){
		parent.appendChild(arrChildren[i]);
	}
}


/**
  *�ڸ�Ԫ��ָ������Ԫ��ǰ׷��һ����Ԫ��,���ر�׷�ӵ�Ԫ��,
  *@param {Node} child:Ҫ׷�ӵ���Ԫ��
  *@param {Node} parent:��Ԫ��
  *@param {Node} targetChild:��Ϊ���յ���Ԫ��,�����������׷�ӵ�ĩβ
  *@return {Node}
  *@time 2011.11.02
  */
joker.dom.insertChildBefore = function(child, parent, opt_targetChild){
	return parent.insertBefore(child, opt_targetChild);
}


/**
  *�ڸ�Ԫ�ص���Ԫ���е�ָ��λ��ǰ׷��һ����Ԫ�أ����ر���ӵ�Ԫ��
  *@param {Node} child:Ҫ��ӵ���Ԫ��
  *@param {Node} parent:
  *@param {Integer} opt_index:
  *@return {Node}
  *@time 2011.11.02
  */
joker.dom.insertChildBeforeIndex = function(child, parent, opt_index){
	return joker.dom.insertChildBefore(child, parent, joker.dom.getChildren(parent)[opt_index]);
}

/**
  *�滻���ڵ���ָ�����ӽڵ�,�����滻��Ľڵ�,
  *@param {Node} child:Ҫ�滻����Ԫ��
  *@param {Node} parent:��Ԫ��
  *@param {Node} targetChild:���滻��Ԫ��
  *@return {Node}
  *@time 2011.11.02
  */
joker.dom.replaceChild = function(child, parent, opt_targetChild){
	return parent.replaceChild(child, opt_targetChild);
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
*���鷽��
*/

joker.array = {};

/**
  *��һ��nodeListת��������
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
  *json����
  *
  */
joker.json = joker.json || {};

/**
  *���ַ���ת��json����ע����Ҫ���а�ȫ����֤
  *@param {String} str:
  *@return {Object}
  *@time 2011.11.02
  */
joker.json.parse = function(str){
	return eval("("+str+")");
}


/**
  *˽�к������ݹ�ʵ�ֶ�json��������л�
  *@param {Object} obj:Ҫ���л��Ķ���
  *@return {String}
  *@time 2011.11.02
  *@author axun;
  */
joker.json._seri = function(obj){
	var strResult = "";
	//�ȼ���ǲ������飬��Ҫ��˳��㷴�ˣ���Ϊ����Ҳ�Ƕ���
	if(obj instanceof Array){
		strResult += "[";
		for(var i = 0, length = obj.length; i < length; i++){
			strResult += this._seri(obj[i])+((i == length - 1)?"":",");
		}
		strResult += "]";
		return strResult;
	}
	//�ټ���ǲ��Ƕ���
	if(obj instanceof Object){
		strResult += "{";
		var first = true;//�ǲ��ǵ�һ��ѭ���������ж��ǲ���Ҫ��","
		for(var key in obj){
			strResult += (first?"":",")+key+":"+this._seri(obj[key]);
			first = false;
		}
		
		strResult += "}";
		return strResult;
	}
	//�������飬Ҳ���Ƕ������� �ַ��������ֻ��߲�������

	if((typeof obj) == "number")
		return obj;
	if((typeof obj) == "string"){
		return "\""+obj+"\"";
	}
	return obj;

}

/**
  *�ݹ�ʵ�ֶ�json��������л�������˽�к���_seri��ʵ�֡�
  *Ӧ�ôﵽ��Ч����:������obj,serialize(parse(obj)) ��obj����ȫһ���ġ�
  *@param {Object} obj:
  *@return {String}
  *@time 2011.11.02
  *@author axun
  */

joker.json.serialize = function(obj){
	return joker.json._seri(obj);
}
