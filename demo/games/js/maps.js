Tank.maps = [];

var map1 = {
    name:"Zombie Island",
    describ:"kill all the zombies! Or you will be killed",
    author:'axun',
    time:'2012-02-21',
    objs:[
        {type:"MainTank",loc:{x:200,y:400}},
        {type:"Zombie",loc:{x:0,y:0}, amount:4},
        {type:"Zombie2",loc:{x:200,y:0}, amount:4},
        {type:"RandomTank",loc:{x:400,y:0},amount:4},
        {type:"Emplacement", loc:{x:200,y:200}, amount:2, distance:{x:100, y:0}},
        {type:"Rock", loc:{x:0,y:2}, amount:12, distance:{x:1, y:0}},
        {type:"Tree", loc:{x:4,y:4}, amount:12, distance:{x:1, y:0}},

        {type:"Rock2", loc:{x:0,y:6}, amount:12, distance:{x:1, y:0}},
        {type:"Tree2", loc:{x:4,y:8}, amount:12, distance:{x:1, y:0}},

        
        ]


}

var map2 = {
    name:"僵尸森林",
    describ:"kill all the zombies! Or you will be killed",
    author:'axun',
    time:'2012-02-21',
    objs:[
        {type:"MainTank",loc:{x:200,y:400}},
        {type:"Zombie",loc:{x:0,y:0}, amount:6},
        {type:"Zombie2",loc:{x:200,y:0}, amount:6},
        {type:"RandomTank",loc:{x:400,y:0},amount:6},
        {type:"RandomTank",loc:{x:400,y:400},amount:6},
        {type:"Emplacement", loc:{x:200,y:200}, amount:2, distance:{x:100, y:0}},
        {type:"Rock", loc:{x:0,y:2}, amount:6, distance:{x:1, y:0}},
        {type:"Tree", loc:{x:6,y:2}, amount:6, distance:{x:1, y:0}},
        {type:"Tree", loc:{x:3,y:6}, amount:9, distance:{x:1, y:0}},
        {type:"Tree", loc:{x:6,y:3}, amount:9, distance:{x:0, y:1}},
        
        ]


}

var map3 = {
    name:"僵尸森林",
    describ:"kill all the zombies! Or you will be killed",
    author:'axun',
    time:'2012-02-21',
    objs:[
        {type:"MainTank",loc:{x:200,y:400}},
        {type:"Zombie",loc:{x:0,y:0}, amount:8},
        {type:"Zombie2",loc:{x:200,y:0}, amount:8},
        {type:"RandomTank",loc:{x:400,y:0},amount:8},
        {type:"RandomTank",loc:{x:400,y:400},amount:8},
        {type:"Emplacement", loc:{x:200,y:200}, amount:3, distance:{x:50, y:0}},
        {type:"Rock", loc:{x:0,y:2}, amount:6, distance:{x:1, y:0}},
        {type:"Rock2", loc:{x:8,y:8}, amount:6, distance:{x:1, y:0}},
        {type:"Tree2", loc:{x:6,y:2}, amount:6, distance:{x:1, y:0}},
        {type:"Tree", loc:{x:3,y:6}, amount:9, distance:{x:1, y:0}},
        
        ]


}
Tank.maps.push(map1);
Tank.maps.push(map2);
Tank.maps.push(map3);
