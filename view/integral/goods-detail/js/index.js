// GWG
!(function(){
  var busiDetail = {
    openplace: "",   // 1微信   0 天天兑   2其他浏览器
    productId: '',   // 产品id
    storeId: '',
    userAgentInfo: navigator.userAgent,
    isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1,//android终端
    isiOS: navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),                                //ios终端
    // permissionServer: "appbs.tymshop.com:8080",
    permissionServer: "192.168.168.16:8088",
    init: function(){
      this.getData();
      this.bindEvent();
    },
    bindEvent: function(){
      var self = this;
      // 点击立即购买
      $('.buying').click(function(){
        self.openPlace();
      })
    },
    // 判断页面打开的位置
    openPlace: function(){
      busiDetail.isApp = Number(busiDetail.getQueryString('isApp'));
      if (busiDetail.isApp) {  //在天天兑打开
        busiDetail.openplace = 0;
      } else if (
          busiDetail.userAgentInfo.toLocaleLowerCase().match(/MicroMessenger/i) == 'micromessenger') {   //在微信打开
        busiDetail.openplace = 1;
      } else {   //在其他浏览器打开
        busiDetail.openplace = 2;
      }
      this.shopStore(busiDetail.storeId);
    },
    // 店铺
    shopStore: function(e){
      var getIrefereeId = this.getQueryString('lrefereeId');  //平台号
      var refuserid = this.getQueryString('refuserid'); 		//用户id
      if (busiDetail.openplace === 0) {  //在天天兑打开
        $('.search').removeClass('hide');    // 打开搜索框
        if (busiDetail.isAndroid) {
          window.jsObj.toShop(e);//打开店铺
        }
        if (busiDetail.isiOS) {
          window.location = "tiantiandui://storeProductList?storeId=" + e;
        }
      } else if ((busiDetail.userAgentInfo.indexOf("MicroMessenger") > 0 || busiDetail.userAgentInfo.indexOf("QQ/") > 0)) { //微信或者QQ
        // 隐藏搜索框
        $('.search').addClass('hide');
        if (/(iPhone)/i.test(navigator.userAgent)) {
          $(".brower-name").text("在Safari中打开");
        } else if (/(Android)/i.test(navigator.userAgent)) {
          $(".brower-name").text("在浏览器中打开");
        }
        $(".pop").show(300);
        $(".pop-close").click(function () {
          $(".pop").hide(300);
        });
      } else {
        // 隐藏搜索框
        $('.search').addClass('hide');
        location.href = "http://"+busiDetail.permissionServer+"/appbs/TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid + "&shopId=" + e;
      }
    },
    getData: function(){
      // 获取商品id
      busiDetail.productId = this.getQueryString(productId);
      $.ajax({
        url: 'http://'+busiDetail.permissionServer+'/shop/productService/getProductInfo/'+ busiDetail.productId +'/111',
        type: 'get',
        success: function(res){
          var result = res.result;
          // 店铺id
          busiDetail.storeId = result.ms_shop_id;
          busiDetail.rending(result, busiDetail.storeId);
        },
        error: function(err){
          console.log(err);
        }
      })
    },
    // 页面渲染
    rending: function(e, s){
      // 图片获取
      var logoImageList = JSON.parse(e.logoImageList);
      var htmlStr = '';
      // 字符串拼接
      logoImageList.forEach(function(v, i){
        htmlStr += '<div class="swiper-slide"><img src="'+ v +'"/></div>';
      });
      $('.jsSwiper').append(htmlStr);
      // 初始化轮播图
      this.swipers();
      // 产品名称
      $('.name').text(e.name);
      // 产品描述
      $('.remarks').text(e.remarks);
      // 价格
      $('.price p').text('￥'+e.specs[0].in_price);
      // 积分
      $('.price span').text('+积分'+e.specs[0].integral);
      // 运费
      $('.shipment').text('运费：' + e.shipment.toFixed(2));
      // 发货地址
      var adres = JSON.parse(e.address);
      $('.address').text(adres.city +' - '+ adres.district);
      // 商品描述
      var imageList = JSON.parse(e.image_list);
      var imageListStr = '';
      imageList.forEach(function(v, i){
        imageListStr += '<img src="'+ v +'" alt="">';
      });
      $('.descript').append(imageListStr);
      // 用户评论
      var userImage = e.lastEvaluate.user_image;
      var userName = e.lastEvaluate.user_name;
      var content = e.lastEvaluate.content;
      $('.img-boxs img').attr('src', userImage);
      $('.img-boxs span').text(userName);
      $('.com-content').text(content);
      // 店名
      $.ajax({
        url: 'http://'+busiDetail.permissionServer+'/shop/shopService/getShopInfo/'+ s +'/' + busiDetail.productId,
        type: 'get',
        success: function(res){
          var result = res.result;
          $('.into img').attr('src', result.titleImg);
          $('.into .shopName').text(result.name);
        },
        error: function(err){
          console.log(err);
        }
      })
    },
    swipers: function(){
      var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        pagination: '.swiper-pagination',
        autoplay: 1000
      });
    },
    // url 参数获取
    getQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    }
  };
  busiDetail.init()
}());
