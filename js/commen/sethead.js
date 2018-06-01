
$.ajax({
	url: '../gameapi/getUserInfo?t=' + Math.random(),
	type: 'GET',
	dataType: 'JSON',
	success: function(response) {
		if(response.enable=='forbidding'){
			window.location.href='../login/logout';
		}else{
			$("#mycounttop").html(' 房卡：' + response.cardNum );//+ ' 剩余钻石：' + response.diamond
		}
	},
	error: function() {
		bootbox.alert({
			buttons: {
				ok: {
					label: '确认',
					className: 'btn green'
				}
			},
			message: '请求失败，请联系管理员',
			callback: function() {}
		});
	}
});
