// GWG




!(function(){
  var goodsList = {
    init: function(){
      this.bindEvent();

    },
    bindEvent: function(){
      var self = this;
      $('.jsChangeArray').click(function(){
        var $this = $(this);
        self.changeArray($this);
      });
      $('.nav li').click(function(){
        var $this = $(this);
        var index = $this.index();
        if(index !== 2){
          $this.addClass('active').siblings().removeClass('active');
        }

      })
    },
    // 改变排列方式
    changeArray: function($this){
      var changeArray = $('.main ul');
      if($this.hasClass('deft')){
        // 多列
        $this.removeClass('deft').attr('src', 'images/2.png');
        changeArray.removeClass('default').addClass('horizontal');
      } else {
        // 单列
        $this.addClass('deft').attr('src', 'images/1.png');
        changeArray.removeClass('horizontal').addClass('default');
      }
    }
  };
  goodsList.init()
}());