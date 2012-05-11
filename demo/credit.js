//计算选修学分
var d=window.frames[0].document;
var trs = d.getElementsByClassName("TR_BODY",d.getElementsByClassName("TB_LINE"));
var total = 0;
var opt = 0;
var req = 0;
for(var i=0;i<trs.length;i++){
    var ch = trs[i].children;
    if(ch && ch.length == 12){
        var c = parseInt(ch[8].innerHTML);
        total += c;
        if(/选修/.test(ch[9].innerHTML)) opt += c;
        if(/必修/.test(ch[9].innerHTML)) req += c;
    }
}
console.log("总分：" + total + "，必修" + req + ", 选修：" + opt);
