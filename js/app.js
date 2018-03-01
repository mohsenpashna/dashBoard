var data=[];




function crateRandData(){
    var weekInMS = 604800*1000;
    var dateNow = Date.now(); 
    var trimT =   dateNow - (dateNow % weekInMS);
    
    for(var i=0; i< 1000; i++){
    var d = {time:"", rate: ""};
        var t = trimT + Math.floor(weekInMS*Math.random());
        var r = Math.floor(5*Math.random()+1);
        d.time = t;
        d.rate = r;
        data = data.concat(d);
        delete d;
//        data = jsonConcat(data, d);
    }
    console.log(data);
}

crateRandData();
