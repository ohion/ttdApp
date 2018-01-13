document.write("<script language=javascript src='tymAES/aes.js'></script>");
document.write("<script language=javascript src='tymAES/md5.js'></script>");
document.write("<script language=javascript src='tymAES/pad-zeropadding.js'></script>");

var supplement = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getRnd(len){
	var rndstr = "";
	for(var i=0;i<len;i++){
		rndstr+=supplement[Math.floor(Math.random()*10000%supplement.length)];
	}
	return rndstr;
}

function Lock(key,data,len){
	var keylen = key.length;
	for(i=0;i<32-keylen;i++){
		key+=supplement[i];
	}

	var Mykey = key;
	var text = getRnd(len)+data;
        var key_hash = Mykey; 
        var key = CryptoJS.enc.Utf8.parse(key_hash);
        var iv = CryptoJS.enc.Utf8.parse('\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000');
    
        var encrypted = CryptoJS.AES.encrypt(text, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }); 
        return encrypted.toString();  
}