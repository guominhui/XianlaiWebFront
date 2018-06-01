/*if(localStorage.form && localStorage.form == 'browser') {
	$('#Logout').show();
} else {
	$('#Logout').hide();
}*/
//获取设备类型(1移动设备;0非移动设备;)
function getuserMobileType() {
	var ua = navigator.userAgent;
	if(!!ua.match(/AppleWebKit.*Mobile.*/)) {
		return 1;
	} else {
		return 0;
	}
}
var mt=getuserMobileType();
if(localStorage.form && localStorage.form == 'browser'&&mt==1) {
	$('#GameRecharge').show();
} else {
	$('#GameRecharge').hide();
}