var code = (function(){
    var code = '';
    var createCode = function(jqDom, codeLength){
        code = '';
        var length = codeLength || 4;
        var color='#';
        var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
                'S','T','U','V','W','X','Y','Z');
        for(var i = 0; i < length; i++) {
            var index = Math.floor(Math.random()*36);
            code += random[index];
        }
        for(var i=0;i<6;i++){color+=parseInt(Math.random()*9);}
        jqDom.css("background-color",color);
        jqDom.html(code);
    }
    var getCode = function(){
        return code;
    }
    return {
        createCode : createCode,
        getCode: getCode
    }
})()