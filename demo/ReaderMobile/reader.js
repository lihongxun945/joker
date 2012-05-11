$(function(){
console.log("ok");
var ListItem = Backbone.Model.extend({
        defaults:{
            url:"#answer-page",
            imgURL:"images/album-mg.jpg",
            title:"默认标题",
            author:{name:"作者名字",bio:"作者简介"},
            time:1336720729582
        },
        initialize:function(){
        }
    });
var List = Backbone.Collection.extend({
        model:ListItem,
        url:"data/home/0.js",
        initialize:function(){
            this.loadIndex = 0;
        },
        loadmore:function(){
            this.url = "data/home/" + this.loadIndex + ".js";
            this.fetch({error:function(){alert("failed to load resoure!");}});
        },
        parse:function(data){
            if(data[0]){
                this.add(data[1]);
                this.loadIndex ++;
            }
            this.trigger("addComplete", data[0]);
        }
    });
var ListItemView = Backbone.View.extend({
        tagName:"li",
        template:_.template($("#list-item-template").html()),
        initialize:function(){
        },
        render:function(){
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
var ListView = Backbone.View.extend({
        el:$("#home-content"),
        events:{
            "click #loadmore":"loadmore"
        },
        initialize:function(){
            this.list = new List();
            this.list.bind("add", this.onAdd, this);
            this.list.bind("addComplete", this.onAddComplete, this);

            this.list.fetch({error:function(){
                    alert("failed to fetch data");
                }});
        },
        render:function(){

        },
        loadmore:function(){
            this.list.loadmore();
        },
        onAdd:function(e){
            this.addOne(e);
            this.render();
        },
        addOne:function(model){
            var view = new ListItemView({model:model});
            var el = $("#home-list-wrap");
            el.append(view.render().el);
            el.listview("refresh");
        },
        onAddComplete:function(count){
            this.showLoading(false);
            if(count < 5) $("#loadmore").hide();
        },
        showLoading:function(b){
            if(b){
                $("#loading").show();
                $("#loadmore").hide();
            }else{
                $("#loading").hide();
                $("#loadmore").show();
            }
        }
    });

$("#home-page").bind("pageinit", function(){
        new ListView();    
    });

new ListView();    
});



