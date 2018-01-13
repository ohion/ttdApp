$(document).ready(function(){
    var type = utils.getQueryString("type");
    // type = 0 :显示个代的
    // type = 1 :显示商家的
    if(type == 0){
        $('#all_proxy').css('display','block');
        $('#all_merchant').css('display','none');
    }else if(type == 1){
        $('#all_merchant').css('display','block');
        $('#all_proxy').css('display','none');
    }
    //进入页面
    $('.proxy').click(function(){
        window.location.href = '../personal_proxy.html';//个代协议
    });
    $('.cooperate').click(function(){
        window.location.href = '../cooperate_shop.html';//联盟商家协议
    });
    $('.policy').click(function(){
        window.location.href = 'proxy_shop_policy.html';//个人经销商政策
    });
    $('.policy3').click(function(){
        window.location.href = 'proxy_agency_policy2.html';//2017年代理政策
    });

    $('.agency').click(function(){
        window.location.href = 'proxy_shop_agency.html';//代理管理规范
    });
    $('.merch').click(function(){
        window.location.href = 'merch_shop_merchant.html';//商家管理规范
    });
    $('.area_support').click(function(){
        window.location.href = 'TTD_proxy_support_area.html';//2017年天天兑代理扶持政策
    });
    $('.personage_support').click(function(){
        window.location.href = 'TTD_proxy_support_personage.html';//2017年天天兑经销商扶持政策
    });

});