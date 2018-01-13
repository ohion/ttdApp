var servers = (function(){  //调用就是  servers.permissionServer
	
	// var server = {//(内网)
	// 	shopServer:"192.168.168.16:8088",  //商品分享   //供应商店铺分享
	// 	nearshopService: "192.168.168.69:3314",//联盟商家店铺分享 //商品券详情
	// }

	var server = {//(发布版)
		shopServer:"appbs.tymshop.com:8088",  //商品分享  //供应商店铺分享
		nearshopService: "120.25.129.101:2314",//联盟商家店铺分享  //商品券详情
		voteService:"shop.tymplus.com:3314",//投票服务
		// voteService:"192.168.168.69:3314",//投票服务
	}
	return server;
})()