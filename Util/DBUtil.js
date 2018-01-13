var mysql  = require('mysql');
// if(!global.connection){
// 	global.connection = mysql.createConnection({
// 	  	host: '192.168.168.134',
// 	  	user: 'root',
// 	  	password: '175947400',
// 	  	// host: 'localhost',
// 	  //user: 'root',
// 	  //	 password: '175947400',
// 	  	database: 'appbs'
// 	});
// 	global.connection.connect();
// }

module.exports = {
	SQL : function(sql,params,scb,ecb){
		global.connection.query(sql,params, function(err, rows, fields) {
  			if(err){
  				ecb(err);
  			}else{
  				scb(rows);
  			}
		});
	},
	REMOVENULL : function(obj){
		for(var key in obj){
			if(obj[key] == ""){
				delete obj[key];
			}
		}

		// return  (Object.keys(obj).length ==0)?null:obj;
		return obj;
	},
	ISNOTNULL : function(value1){
		return (value1 !=undefined && value1 !="");
	}
	,
	ESCAPE :function(value){
		return connection.escape(value);
	}


};
