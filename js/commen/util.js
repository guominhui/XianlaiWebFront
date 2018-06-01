/**
 * 一些常用的js工具类
 * xhl 2016-04-03 
 */

/**标准时间转换成可识别时间**/
function tf(i) {
	return(i < 10 ? '0' : '') + i
};
var format = function(time, format) {
		var t = new Date(time);
		var tf = function(i) {
			return(i < 10 ? '0' : '') + i
		};
		if(time == null) {
			return '';
		} else {
			return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
				switch(a) {
					case 'yyyy':
						return tf(t.getFullYear());
						break;
					case 'MM':
						return tf(t.getMonth() + 1);
						break;
					case 'mm':
						return tf(t.getMinutes());
						break;
					case 'dd':
						return tf(t.getDate());
						break;
					case 'HH':
						return tf(t.getHours());
						break;
					case 'ss':
						return tf(t.getSeconds());
						break;
				}
			})
		}
	}

	/********获取url里参数**********/
var URL_ARGUMENTS = {};
if(location.search.length) {
	var args = location.search.slice(1).split('&');
	for(var i = 0; i < args.length; i++) {
		var arg = args[i].split('=');
		URL_ARGUMENTS[arg[0]] = arg[1];
	}
}

function GET() {
	if(arguments.length) {
		if(arguments[0] in URL_ARGUMENTS) {
			return URL_ARGUMENTS[arguments[0]];
		} else {
			//throw '"' + arguments[0] + '"参数不存在！';
			return false;
		}
	} else {
		return URL_ARGUMENTS;
	}
}
//获取移动设备类型(1移动设备;0&#45;&#45;非移动设备;)			
function getuserMobileType() {
	var ua = navigator.userAgent;
	if(!!ua.match(/AppleWebKit.*Mobile.*/)) {
		return 1;
	} else {
		return 0;
	}
}
var H = $(document.body).outerHeight(true);
var mt = getuserMobileType();
if(mt == 1) {
	$('input[type!=radio]').each(function() {
		$(this).on('click', function(event) {
			event.preventDefault();
			$(this).addClass('clicked');
			if($(this).hasClass("clicked")) {
				$('body').scrollTop($(this).offset().top);
			} else {
				$('body').css('height', $(document.body).outerHeight(true) - $(this).offset().top);
			}
			event.stopPropagation();
			return false;
		})
		$(this).on('focus', function(event) {
			event.preventDefault();
			if($(this).hasClass("clicked")) {
				$('body').css('height', $(document.body).outerHeight(true) + $(this).offset().top);
				$('body').scrollTop($(this).offset().top);
			} else {
				$('body').css('height', $(document.body).outerHeight(true) + $(this).offset().top);
				$('body').scrollTop($(this).offset().top);
			}
			event.stopPropagation();
			return false;
		});
		/*$(this).blur(function() {
			var _this=this;
			setTimeout(function() {
				$(_this).removeClass('clicked');
				$('body').css('height', $(document.body).outerHeight(true) - $(_this).offset().top);
			}, 400);
		});*/
		$(document).click(function() {
			$('input[type!=radio]').removeClass('clicked');
			$('body').css('height', H);
		});

	})
}
