var G = {};
G.app = {};     // 应用
G.logic = {}; // 业务公共逻辑相关
G.ui = {};      // 界面相关
G.util = {}; // 工具相关
G.web={};

G.web={
	browserRedirect:function(){
		 var sUserAgent = navigator.userAgent.toLowerCase();
		    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
		    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
		    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
		    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
		    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
		    var bIsAndroid = sUserAgent.match(/android/i) == "android";
		    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
		    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
		    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
		        return "phone";
		    } else {
		        return "pc";
		    }
	}
}

G.util = {
    //格式化
    format: function (string) {
        var args = arguments;
        if (args.length > 1) {
            string = string.replace(/({{)|(}})|{(\d+)}|({)|(})/g, function (unused, left, right, index, illegalLeft, illegalRight) {
                if (illegalLeft || illegalRight) {
                    throw "格式错误";
                }
                return (left && "{") || (right && "}") || args[(index | 0) + 1];
            });
        }
        return string;
    },
    hexToRgb: function (e) {
        var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
        return t ? {
            r: parseInt(t[1], 16),
            g: parseInt(t[2], 16),
            b: parseInt(t[3], 16)
        } : null
    },
    rgbToRgba: function (e, t) {
        if (jQuery.browser.version <= 8) {
            e = hexToRgb(e);
            rgba = "rgba(" + e.r + "," + e.g + "," + e.b + "," + t + ")"
        } else {
            e = e.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            rgba = "rgba(" + e[1] + "," + e[2] + "," + e[3] + "," + t + ")"
        }
        return rgba
    },
    getFileExt: function (filepath) {
        var re = /(\\+)/g;
        var filename = filepath.replace(re, "#");
        var one = filename.split("#");
        var two = one[one.length - 1];
        var three = two.split(".");
        var last = three[three.length - 1];
        return last;
    },
    removePxSuffix: function (size) {
        return size ? size.replace(/px$/, '') : "";
    },
    addSizeSuffix: function (size) {
        if (/^[0-9]+$/.test(size)) {
            size += "px";
        }
        return size;
    }
};

/**
 * URL地址相关操作
 */
G.util.url = {
    //查询URL参数
    queryString: function (paramName) {
        var result = null;
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null && r[2] != null) {
            result = unescape(r[2]);
        }
        return result;
    },
    //给URL加随机数防止缓存
    no_cache_url: function (url) {
        var returnurl = "";
        var cachetime = new Date().getTime();
        var index = url.indexOf("cachetime=");
        var param = url.indexOf("?");
        if (index == -1) {
            if (param == -1) { returnurl = url + "?cachetime=" + cachetime; }
            else { returnurl = url + "&cachetime=" + cachetime; }
        } else {
            if (param == -1) { returnurl = url.substring(0, index) + "?cachetime=" + cachetime; }
            else { returnurl = url.substring(0, index) + "&cachetime=" + cachetime; }
        }
        return returnurl.replace('&&', '&').replace('?&', '?');
    },
    //给当前URL追加参数
    appendParam: function (url, parames) {
        var pattern = /(\w+)=(\w+)/g;
        var urlparames = {};
        url.replace(pattern, function (a, b, c) {
            urlparames[b] = c;
        });
        for (var i = 0; i < parames.length; i++) {
            urlparames[parames[i].name] = parames[i].value;
        }
        if (url.indexOf("?") >= 0) {
            url = url.substring(0, url.indexOf("?"));
        }
        url = url + "?";
        for (var key in urlparames) {
            url = (url + (key + "=" + urlparames[key]) + "&");
        }
        if (url.lastIndexOf("&") + 1 == url.length) {
            url = url.substring(0, url.lastIndexOf("&"));
        }
        return url;
    }
};

/**
 * Cookie 相关操作
 */
G.util.cookie = {
    get: function (name) {
        var r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
        var m = document.cookie.match(r);
        return (!m ? "" : unescape(m[2]));
    },

    add: function (name, v, path, expire, domain) {
        var s = name + "=" + escape(v)
			+ "; path=" + (path || '/') // 默认根目录
			+ (domain ? ("; domain=" + domain) : '');
        if (expire > 0) {
            var d = new Date();
            d.setTime(d.getTime() + expire * 1000);
            s += ";expires=" + d.toGMTString();
        }
        document.cookie = s;
    },

    del: function (name, domain) {
        document.cookie = name + "=;path=/;" + (domain ? ("domain=" + domain + ";") : '') + "expires=" + (new Date(0)).toGMTString();
    }
};

G.ui = {
    alertFlag:true,
    confirmFlag:true,
    alertT: function (tit,msg) {
    	 bootbox.alert({
				buttons: {
					ok: {
						label: '确认',
						className: 'btn green'
					}
				},
				message: msg,
				title:tit==undefined?"提示":tit
		});
    },
    alert: function (msg,title,okLabel,callbackFunc) {
        try{
            if(!G.ui.alertFlag){
                return;
            }
            G.ui.alertFlag=false;
            bootbox.alert({
                buttons: {
                    ok: {
                        label: (okLabel==undefined || okLabel==null)?"确定":okLabel,
                        className: 'btn green'
                    }
                },
                message: msg,
                title:(title==undefined || title==null)?"提示":title,
                callback: function() {
                    G.ui.alertFlag=true;
                    if(callbackFunc!=undefined){
                        callbackFunc();
                    }
                }
            });
        }catch(e) {
            G.ui.alertFlag=true;
        }

    },
    success: function (msg) {
     
    },
    confirm: function (msg,title,confirmLabel,cancelLabel, okFunc) {
        try{
            if(!G.ui.confirmFlag){
                return;
            }
            G.ui.confirmFlag=false;
            bootbox.confirm({
                buttons: {
                    confirm: {
                        label: (confirmLabel==undefined || confirmLabel==null)?"确定":confirmLabel,
                        className: 'btn green'
                    },
                    cancel: {
                        label: (cancelLabel==undefined || cancelLabel==null)?"取消":cancelLabel,
                        className: 'btn-default'
                    }
                },
                message: msg,
                callback: function(result) {
                    G.ui.confirmFlag=true;
                    if(okFunc!=undefined && okFunc!=null) {
                        okFunc(result);
                    }
                },
                title: (title==undefined || title==null)?"提示":title
            });
        }catch(e){
            G.ui.confirmFlag=true;
        }

    }
};

/**
 * Loding动画
 */
G.ui.loading = {
   
};

/***
** reg:依赖jQuery
      封装公用的AJAX调用，其中包含异常的基本处理、会话超时的处理等
**
*/
G.util.ajax = {
    get: function (options) {
        this._action("GET", options);
    },
    post: function (options) {
        this._action("POST", options);
    },
    put: function (options) {
        this._action("PUT", options);
    },
    del: function (options) {
        this._action("DELETE", options);
    },
    _action: function (type, options) {
        this._checkParam(type, options);
        var params = this.params;
        $.ajax({
            url: params.url,
            type: params.type,
            data: params.data,
            datatype: params.datatype,
            cache: false,
            async: params.async,
            beforeSend: function () {
                if (typeof (params.beforeSend) === "function") {
                    params.beforeSend();
                }
            },
            success: function (result) {
            	if(params.callSuccessFunc!=undefined ){
            		params.callSuccessFunc(result);
            	}               
            },
            error: function (xhr, err) {
            	if(params.callErrorFunc!=undefined && typeof (params.callErrorFunc) === "function"){
            		params.callErrorFunc(xhr,err);
            	}else{
            		G.ui.alert("操作异常,请联系客服！");
            	}
            },
            complete: function (xhr, txt) { 
            	if(params.callCompleteFunc!=undefined && typeof (params.callCompleteFunc) === "function"){
            		params.callCompleteFunc(result);
            	}                         
            }
        });
    },
    _checkParam: function (type, options) {
        this.params = {
            url: null,
            type: type,
            data: null,
            async: true,
            datatype: "json",
            cache: false,
            beforeSend: function () {
                if (G.ui.loading != undefined && G.ui.loading != null) {
                  
                }
            },
            success: function () { },
            complete: function (xhr, txt) {
               
            },
            backError: function (json) {
               
            }
        };
        $.extend(this.params, options);
        if (this.params.type === null || this.params.type === undefined || this.params.type === "") {
            type = "POST";
        }
        if (this.params.data === null || this.params.data === undefined || this.params.data === "") {
            data = {};
        }
        if (this.params.url === null || this.params.url === undefined || this.params.url === "") {
            G.ui.alert("当前AJAX请求缺少目标URL！");
            return;
        }
    }
};

//工具包
G.util.regex = {
    /**
    *   Html 编码
    **/
    html_encode: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        //s = s.replace(/\n/g, "<br>");
        return s;
    },
    /**
    *   Html 解码
    **/
    html_decode: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/'/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    },
    //中文、字母、数字
    isChnAlphaNumeric: function (value) {
        var reg = /^(([a-zA-Z0-9])|([\u4e00-\u9fa5])|(-))+$/;
        value = value.trim();
        if (!reg.test(value)) {
            return false;
        }
        return true;
    },
    isNumericPoint: function (value) {
        var reg = /^[\d][\d|.]+$/;
        var flag = reg.test(value);
        return flag;
    },
    isNumeric: function (value) {
        var reg = /^\d+$/;
        return reg.test(value);
    },
    isUppercaseLettersNumeric: function (str) {
        var reg = /^[0123456789A-Z]+$/;
        var flag = reg.test(str);
        return flag;
    },
    //检查是否字母或数字
    isAlphaNumeric: function (str) {
        var reg = /^[0123456789A-z]+$/;
        var flag = reg.test(str);
        return flag;
    }, //检查是否字母或数字或中划线下划线
    isAlphaDash: function (str) {
        var reg = /^[-_0123456789A-z]+$/;
        var flag = reg.test(str);
        return flag;
    },
    is16Hex: function (str) {
        var reg = /^([0-9A-Fa-f])+$/;
        var flag = reg.test(str);
        return flag;
    },
    //把整数转换成浮点数据
    formatFloat: function (value, pos) {
        if (value !== "undefined") {
            if (pos != "undefined") {
                pos = parseFloat(pos);
                if (pos < 0) {
                    pos = 0;
                }
            }
            return Math.round(value * Math.pow(10, pos)) / Math.pow(10, pos);
        }
        return value;
    },
    ValidateFtpAndFilePath: function (value) {
        var filter = new RegExp("^(file\://\\\\\\\\|ftp\://)([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*([\\\\/]+($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
        return filter.test(value);
    },
    //验证email格式
    validateEmail: function (value) {
        var filter = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        //if it's valid email
        return filter.test(value);
    },
    //验证正浮点数
    isPositiveFloat: function (value) {
        var filter = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$");
        return filter.test(value);
    },
    //验证浮点数
    isFloat: function (value) {
        var filter = new RegExp("^(-?\\d+)(\\.\\d+)?$");
        return filter.test(value);
    },
    // 非负整数
    isNonnegativeInteger: function (value) {
        var filter = new RegExp("^[1-9]\d*|0$");
        return filter.test(value);
    },
    isPositiveNum: function (value) {
        var filter = new RegExp("^[0-9]*[1-9][0-9]*$");
        return filter.test(value);
    },
    //检查是否整数，包括负数
    isNumeric: function (value) {
        var filter = new RegExp("^-?\\d+$");
        return filter.test(value);
    }, //验证IP
    validationIP: function (ip) {
        re = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
        return re.test(ip);
    }, //验证IP格式为:(192.168||192||192.||192.168.19||192.168.18.)...
    validateNumberOrPoint: function (e, pnumber) {
        var reg1 = /^[0-9]{0,3}$/;
        var reg2 = /^[0-9]{0,3}[.]$/;
        var reg3 = /^[0-9]{0,3}[.][0-9]{0,3}$/;
        var reg4 = /^[0-9]{0,3}[.][0-9]{0,3}[.]$/;
        var reg5 = /^[0-9]{0,3}[.][0-9]{0,3}[.][0-9]{0,3}$/;
        var reg6 = /^[0-9]{0,3}[.][0-9]{0,3}[.][0-9]{0,3}[.]$/;
        var reg7 = /^[0-9]{0,3}[.][0-9]{0,3}[.][0-9]{0,3}[.][0-9]{0,3}$/;
        var reg8 = /^[.][0-9]{0,3}[.][0-9]{0,3}[.][0-9]{0,3}$/;
        var reg9 = /^[.][0-9]{0,3}[.][0-9]{0,3}$/;
        var reg10 = /^[.][0-9]{0,3}[.]$/;
        var reg11 = /^[.][0-9]{0,3}$/;
        if (reg1.test(pnumber)) {
            e.value = reg1.exec(e.value);
            return true;
        }
        if (reg2.test(pnumber)) {
            e.value = reg2.exec(e.value);
            return true;
        } if (reg3.test(pnumber)) {
            e.value = reg3.exec(e.value);
            return true;
        } if (reg4.test(pnumber)) {
            e.value = reg4.exec(e.value);
            return true;
        }
        if (reg5.test(pnumber)) {
            e.value = reg5.exec(e.value);
            return true;
        }
        if (reg6.test(pnumber)) {
            e.value = reg6.exec(e.value);
            return true;
        }
        if (reg7.test(pnumber)) {
            e.value = reg7.exec(e.value);
            return true;
        }
        if (reg8.test(pnumber)) {
            e.value = reg8.exec(e.value);
            return true;
        }
        if (reg9.test(pnumber)) {
            e.value = reg9.exec(e.value);
            return true;
        }
        if (reg10.test(pnumber)) {
            e.value = reg10.exec(e.value);
            return true;
        }
        return false;
    },
    //短日期，形如 (2008-07-22)
    isShortDate: function (value) {
        var r = value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) {
            return false;
        }
        var d = new Date(r[1], r[3] - 1, r[4]);
        return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
    },
    //日期对比函数
    comptime: function (startDate, endDate) {
        if (startDate.length > 0 && endDate.length > 0) {
            var startDateTemp = startDate.split(" ");
            var endDateTemp = endDate.split(" ");
            var arrStartDate = startDateTemp[0].split("-");
            var arrEndDate = endDateTemp[0].split("-");
            var arrStartTime = startDateTemp[1].split(":");
            var arrEndTime = endDateTemp[1].split(":");
            var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
            var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);
            if (allStartDate.getTime() > allEndDate.getTime()) {
                return false;
                //alert("开始日期不能大于结束日期");
            }
        }
        return true;
    },
    //json日期类型转换为日期date
    convertDateTime: function (jsondate) {
        var date = new Date(parseInt(jsondate.replace("/Date(", "").replace(")/", ""), 10));
        return date;
    },
    //日期格式化为yyyy-MM-dd HH:mm:ss
    dateTimeFormat: function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hh = date.getHours();
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
    },
    //验证日期
    validateDateTime: function (datetime) {
        if (datetime.length == 0) {
            return true;
        }
        /*try {
            var arr = (datetime.length == 19) ? datetime.split(/\D/) : []
            --arr[1]
            eval("var d=new Date(" + arr.join(",") + ")")
            return Number(arr[0]) == d.getFullYear() && Number(arr[1]) == d.getMonth()
                      && Number(arr[2]) == d.getDate() && Number(arr[3]) == d.getHours()
                     && Number(arr[4]) == d.getMinutes() && Number(arr[5]) == d.getSeconds()
        } catch (x) { return false };*/
    }
};

//转换类
G.util.convert = {
    convertIPAddress: function (ip) {
        if (common.util.validationIP(ip)) {
            var sip = ip.split('.');
            return parseFloat(ip = 256 * (sip[2] + 256 * (sip[1] + 256 * sip[0])) + sip[3]);
        } else {
            alert("对不起IP地址不合法");
            return ip;
        }
    },
    toDate: function (date) {
        date = date.replace(/年|月/g, "-");
        date = date.replace(/日/g, " ");
        date = date.replace(/时|分/g, ":");
        date = date.replace(/秒/g, " ");
        date = date.replace(/-/g, "/");
        return new Date(date);
    },
    toBoolean: function (value) {
        if (value == 1 || value == "true") {
            return true;
        }
        if (value == 0 || value == "false") {
            return false;
        }
        return undefined;
    }
};


/*******************重新构建类似IE的哈希表用于支持火狐**************************/
function Map() {
    this.map = {}; //initialize with an empty array   
    this.Count = 0;
}
Map.prototype.size = function () {
    return this.Count;
}
Map.prototype.item = function (key) {
    if (this.exists(key)) {
        return this.map[key];
    } else {
        return null;
    }
}
Map.prototype.add = function (key, value) {

    if (!this.exists(key)) {
        this.Count++;
    }
    this.map[key] = value;
}
Map.prototype.items = function () {
    var array = [];
    for (var key in this.map) {
        array.push(this.map[key]);
    }
    return array;
}
Map.prototype.keys = function () {
    var array = [];
    for (var key in this.map) {
        array.push(key);
    }
    return array;
}
Map.prototype.exists = function (key) {
    if (typeof this.map[key] != "undefined") {
        return true;
    } else {
        return false;
    }
}
Map.prototype.remove = function (key) {
    var newMap = {};
    for (var i in this.map) {
        if (i != key) {
            newMap[i] = this.map[i];
        } else {
            this.Count--;
        }
    }
    this.map = newMap;
}
Map.prototype.removeAll = function () {
    this.map = {};
    this.Count = 0;
}
