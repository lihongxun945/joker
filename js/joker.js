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
********************** base  *************************
**********************************************************
*/



/**
  *ʵ�ּ̳С��ڸ��๹�캯���в�����ʱ���ô˷���ʵ�ֵļ̳У����������๹��
  *������ֱ�ӵ���super(args)���������ø���Ĺ��캯��
  *��ʵ�ַ�����ԭ���ǣ��Զ���child��prototypeָ��parent��protoype��ʹ����
  *ӵ�и����ȫ�����������ǣ��������Ա���ͨ��������Ĺ��캯���е���
  *this.super��������ӵ����࣬����������û�и��������
  *�������Ҫ�����е����ԣ���ֻ��Ҫ��prototype�ж���ķ��������Բ��õ���super
  *�˷���ʵ�ֵļ̳У�������instanceof��constructor����������͸��࣬������ȷ�ķ���true
  *ע�⣺inherit�����������������Ĺ��캯��֮��������֮ǰ����������ӵ�prototype�еķ����ᱻ������
  *@param {Function} childCons:���๹�캯��
  *@param {Function} parentCons:���๹�캯��
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
		//��goog�����ϵĸĽ�������һ��super������������Ĺ��캯���п�����this.super�����ø���Ĺ��캯�����������������ӵ������ϡ�ע�ⲻ����ӵ������__proto__�ϣ���Ϊ__proto__���������๲�������Բ�Ӧ���Ǳ�����ġ�
		parentCons.apply(this, arguments);
	}
	childCons.prototype.constructor = childCons;//��ָ���Ļ������Ǹ���Ķ����������
}

/**
  *�Ա�goog��ʵ��
  *
  */
joker.goog_inherit = function(childCtor, parentCtor){
	function tempCtor() {};
	tempCtor.prototype = parentCtor.prototype;
	childCtor.superClass_ = parentCtor.prototype;
	childCtor.prototype = new tempCtor();
	childCtor.prototype.constructor = childCtor;//��ָ���Ļ������Ǹ���Ķ����������
}


/**
  *����ʵ�ֵĶ���
  *�Ӷ�βѹ��Ԫ�أ��Ӷ��׵���Ԫ��
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
  *����һ��������������ͬ�Ĳ������ô˺���ʱ���������ؽ����
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
  *��ȡ��url���ݵı���������һ�����󣬴˶����ÿһ�����Զ�Ӧһ��url������
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
  *��ȡ����ϵͳ���ͣ���������ͣ�������汾
  *@return {Object}: ��������:OS,browser,version
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
    if(!opt_elm){
        if(document.getElementsByClassName){    //ie8�����°汾��֧�ִ˷���
            return document.getElementsByClassName(strClassName);
        }else if(querySelectorAll){
            return querySelectorAll(strClassName);  //ie8 ֧�ִ˷�����
        }
    }
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
    if(!opt_elm) return document.getElementById(strId);
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
  *ɾ��һ���ڵ�,���ر�ɾ���Ľڵ�
  *@param {Node}
  *@return {Node}
  *@time 2011.11.01
  */
joker.dom.removeNode = function(node){
	return node.parentNode.removeChild(node);
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

/**
  *��ǰ���ڵĹ���λ��
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
  *��ǰ���Ӵ��ڵĴ�С
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
  *ֻ�����첽��
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


/*
*********************************************************
*********************** JSON *************************
**********************************************************
*/

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
    if(window.JSON) window.JSON.parse(str)
	return eval("("+str+")");
}


/**
  *˽�к������ݹ�ʵ�ֶ�json��������л�
  *@param {Object} obj:Ҫ���л��Ķ���
  *@return {String}
  *@time 2011.11.02
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
  *�ݹ�ʵ�ֶ��ڰ����������ݵ�json������ܴ��������ϵ����⡣
  *��ȷ��serialize����Ӧ�ôﵽ��Ч����:������obj,serialize(parse(obj)) ��obj����ȫһ���ġ�
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
  *cookie����
  *ֱ�Ӵ򿪱����ļ�ʱ���޷�����cookie�ġ�
  */
//��û��ȫ���Թ����´��Ȳ������
joker.cookie = joker.cookie || {};

/**
  *Ĭ�ϵĲ���������û���ָ����Ӧ�Ĳ�������ʹ��Ĭ�ϵĲ�����
  *
  */
joker.cookie._defaluts = {
	expireHours : 24*30, //Ĭ�ϱ���һ����
	path : "/",//Ĭ���Ǹ�Ŀ¼����
}

/**
  *��ȡ����cookie��������ֵ���ڶ��������У�����һ������
  *@return {Object};
  *@time 2011.11.03
  *@author axun
  */
joker.cookie.getCookieObject = function(){
	var cookieStr = document.cookie;
	if(cookieStr == "") return {};	//û��ȡ��cookie
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
  *����nameȡ��cookie
  *@param {String} strName:����
  *@return {String}:ֵ
  *@time 2011.11.03
  *@author axun
  */
joker.cookie.getCookie = function(strName){
	var cookie = this.getCookieObject();
	return cookie[strName];
}

/**
  *����һ��cookie���������������ӣ����������ı���ֵ
  *@param {String} strName;
  *@param {String} strValue
  *@param {Number} opt_expireHours:��Чʱ�䣬��Сʱ����
  *@param {String} opt_path:�ɷ��ʵ�·��
  *@param {String} opt_domain:�ɷ��ʵ���
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
  *ɾ��һ��cookie
  *@param {String} strName
  *@time 2011.11.03
  *@author axun
  */
joker.cookie.deleteCookie = function(strName){
	this.setCookie(strName, "null", -1); 
}



/*
********************************************************
********************** �¼����� *************************
**********************************************************
*/
/**
  *���¼���Ϊ���ֻ������ͣ�dom�¼� �� �Զ����¼���
  *dom�¼��Ĵ����������������ɵģ���Ҫ�������֧��,�¼������ǹ̶��ġ�
  *���Զ����¼������ɴ��봥���ģ������Զ����������͵��¼�.
  *
  */

/**
  *dom�¼�����
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
  *����¼�����.
  *@param {Node} element:
  *@param {String} type:
  *@param {Function} handler:
  *@time 2011.11.12
  *@ref ��JavaScript �߼�������ƣ��ڶ��棩��p290
  */
joker.events.addListener = function(element, type, handler){
	if(!element) return;
	if(element.addEventListener){
		//���ڷ�ie�����
		element.addEventListener(type, handler, false);
	}else if(element.attachEvent){
		//����ie�����
		element.attachEvent("on" + type, handler);
	}else {
		//���ڲ�֧��dom2�¼��������
		element["on" + type] = handler;
	}

}

/**
  *�Ƴ��¼�����.
  *@param {Node} element:
  *@param {String} type:
  *@param {Function} handler:
  *@time 2011.11.12
  *@ref ��JavaScript �߼�������ƣ��ڶ��棩��p290
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
  *��event����ת���ɱ�׼����event������ӵ��e.target,e.preventDefault,e.stopPropagation����
  *@param {Object} e
  *@return {Object}
  *@ref ��javascript �߼�������ƣ��ڶ��棩��p295
  */
joker.events.getEvent = function(e){
	e = e || window.event;
	e.target = e.target || e.srcElement;
	e.preventDefault = e.preventDefault || function(){e.returnValue = false;};
	e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true;};
	return e;
}
