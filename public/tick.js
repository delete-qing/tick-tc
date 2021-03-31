/*!
 * Copyright &copy; 2015-2020 <a href="http://www.tickauto.com">TickAuto</a> All rights reserved.
 *
 * 通用公共方法
 * @author tickAuto
 * @version 2014-4-29
 */
// 获取系统配置
var getIndexObj = ''
function getIndex() {
    var xhr = new XMLHttpRequest();//第一步：新建对象
    xhr.open('GET', '/tick-tc/course/dictSysConfig/pageList', true);//第二步：打开连接  将请求参数写在url中 
    xhr.send();//第三步：发送请求  将请求参数写在URL中
    /**
     * 获取数据后的处理程序
     */
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var res = xhr.responseText;//获取到json字符串，解析
            document.title = JSON.parse(res).result.systemName.value
            var link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = JSON.parse(res).result.systemLogo.value;
            document.getElementsByTagName('head')[0].appendChild(link);
            getIndexObj = JSON.parse(res).result;
        }
    };
}
getIndex()
function IndexObj() {
    return getIndexObj
}

// cookie操作
function cookie(name, value, options) {
    if (typeof value !== 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires === 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}


/**
 * 得到当前网站域名
 * @returns {string}
 * @constructor
 */
function getUrl() {
    var url = window.location.href;
    url = url.substring(url.indexOf("//") + 2);
    var str = url.split('/');
    url = "http://" + str[0];
    // if (isEmpty(type)) {
    //     url += ctx + "/";
    // } else if (type === "static") {
    //     url += ctxStatic + "/";
    // } else {
    //     if (str[1].indexOf("tick") > -1) {
    //         url += "/" + str[1] + "/";
    //     }
    // }
    return url;
}

/**
 * 判断字符串为空
 * @param obj 对象
 * @returns {boolean}
 */
function isEmpty(obj, defaultValue) {
    if (obj === undefined || obj === null || obj === "undefined" || obj === "null" || obj === "" || obj === "&nbsp;" || obj.length === 0 || obj === false) {
        if (defaultValue !== undefined && defaultValue !== null) {
            return defaultValue;
        } else {
            return true;
        }
    }
    if (defaultValue != undefined && defaultValue !== null) {
        return obj;
    } else {
        return false;
    }
}

/**
 * 判断字符串为非空
 * @param obj 对象
 * @returns {boolean}
 */
function isNotEmpty(obj) {
    return !isEmpty(obj);
}


// 日期加减
function addDate(date, dadd, type) {
    if ($.type(date) === "number") {
        type = dadd;
        dadd = date;
        date = null;
    }
    date = getDate("newDate", date);
    if ($.type(dadd) === "string") {
        type = dadd;
    }
    switch (type) {
        case "年":
            date = date.setFullYear(date.getFullYear() + dadd);
            break;
        case "月":
            date = date.setMonth(date.getMonth() + dadd);
            break;
        case "秒":
            date = date.setSeconds(date.getSeconds() + dadd);
            break;
        default:
            date = date.setDate(date.getDate() + dadd);
            break;
    }
    if (type !== "秒") {
        return getDate("YMD", date);
    } else {
        return date;
    }
}

/**
 * 根据Type返回相应的年月日，如objdate为空，默认为当前日期 Y2:返回两位年份 Y4:返回四为年份 M:返回月份 D:返回日 Y2M:返回yyMM
 * @param type   类型
 * @param objdate  时间
 * @param compensation 补时区差，默认为false，设置为true，将自动将当前时间加8个小时
 * @return {*} Y2MD:返回yyMMdd YMD:返回当yyyy-MM-dd YM:返回当yyyy-MM
 */
function getDate(type, objdate, compensation) {
    if (objdate == "") {
        return objdate;
    }
    var Y, M, D, S, min, mill, W, Sec;
    var date;
    if (objdate !== null && objdate !== undefined && objdate.toString() !== "") {
        if (objdate.toString().indexOf('/Date') >= 0) {
            objdate = objdate.replace('/Date(', '').replace(')/', '');
            date = new Date(eval(objdate));
        } else if (typeof objdate === "string" && type === "YMD") {
            objdate = objdate.split(" ")[0];
        } else {
            if (typeof objdate === "string") {
                objdate = objdate.replaceAll("-", "/");
            }
        }
        date = new Date(objdate);
    } else {
        objdate = new Date();
    }

    date = new Date(objdate);
    if (isNotEmpty(compensation)) {
        date = date.setHours(date.getHours() + 8);
        date = new Date(date);
    }
    Y = date.getFullYear().toString();
    M = (date.getMonth() + 1).toString();
    D = date.getDate().toString();
    W = date.getDay();
    S = date.getHours().toString();
    min = date.getMinutes().toString();
    mill = date.getMilliseconds().toString();
    Sec = date.getSeconds().toString();
    if (M.length === 1)
        M = "0" + M;
    if (D.length === 1)
        D = "0" + D;
    if (S.length === 1)
        S = "0" + S;
    if (min.length === 1)
        min = "0" + min;
    if (Sec.length === 1)
        Sec = "0" + Sec;

    var str_date;
    switch (type) {
        case "Y2":
            str_date = Y.substring(2, 4);
            break;
        case "Y4":
            str_date = Y;
            break;
        case "Q":
            M = parseInt(M);
            if (M <= 3) {
                str_date = 1;
            } else if (M <= 6) {
                str_date = 2;
            } else if (M <= 9) {
                str_date = 3;
            } else {
                str_date = 4;
            }
            break;
        case "M":
            str_date = M;
            break;
        case "W":
            str_date = W;
        case "周":
            str_date = "周" + "日一二三四五六".substring(W, W + 1);
            break;
        case "D":
            str_date = D;
            break;
        case "Y2M":
            str_date = Y.substring(2, 4) + M;
            break;
        case "Y4M":
            str_date = Y + M;
            break;
        case "Y2MD":
            str_date = Y.substring(2, 4) + M + D;
            break;
        case "Y4MD":
            str_date = Y + M + D;
            break;
        case "YMD":
            str_date = Y + "-" + M + "-" + D;
            break;
        case "arrYMD":
            str_date = new Array();
            str_date.push(parseInt(Y));
            str_date.push(parseInt(M));
            str_date.push(parseInt(D));
            break;
        case "YMDSM":
            str_date = Y + "-" + M + "-" + D + " " + S + ":" + min;
            break;
        case "YMDSMS":
            str_date = Y + "-" + M + "-" + D + " " + S + ":" + min + ":" + Sec;
            break;
        case "YMDS":
            str_date = Y + "-" + M + "-" + D + "-" + S;
            break;
        case "年月":
            str_date = Y + "年" + M + "月";
            break;
        case "年月2":
            str_date = Y + "年" + parseInt(M) + "月";
            break;
        case "年月日":
            str_date = Y + "年" + M + "月" + D + "日";
            break;
        case "月日":
            str_date = M + "月" + D + "日";
            break;
        case "日":
            str_date = D + "日";
            break;
        case "日时":
            str_date = D + "日" + S + "时";
            break;
        case "日时分":
            str_date = D + "日" + S + "时" + min + "分";
            break;
        case "YM":
            str_date = Y + "-" + M;
            break;
        case "SM":
            str_date = S + ":" + min;
            break;
        case "newDate":
            str_date = date;
            break;
    }
    return str_date;
}

/**
 * 两个日期之间相差的天数
 * @param smallDate 较小的日期
 * @param bigDate   较大的日期
 */
function getChaDate(smallDate, bigDate, type) {
    var s1 = getDate("newDate", smallDate);
    var s2 = getDate("newDate", bigDate);
    var days = s2.getTime() - s1.getTime();
    switch (type) {
        case "分钟":
            return parseInt(days / (1000 * 60));
            break;
        case "秒":
            return parseInt(days / 1000);
            break;
        default:
            return parseInt(days / (1000 * 60 * 60 * 24));
            break;
    }
}

Array.prototype.in_array = function (e) {
    var r = new RegExp(',' + e + ',');
    return (r.test(',' + this.join(this.S) + ','));
};

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}


/**
 * 将表格导出为excel
 * @param el 表格选择器，必须为唯一
 * @param headTitle 表头名称，添加此列后，会在第一行显示表头信息
 * @param template 是否有导入模板，后端excel模板的名称，如果有则会将该数据导入到excel模板中
 * @param cols [1,,2,3,4,5,6]导入第几列的数据,留空，则导出全部列数据
 * @param dataBase 原始Array数据数据，有原始数据时，直接
 */
function excelExport(el, headTitle, template, cols, dataBase) {
    if (isNotEmpty(dataBase)) {
        if (isEmpty(cols)) {
            alert("原始数据后，cols必须传入对应的字段名数组！");
            return false;
        }
        if (!isNaN(cols[0])) {
            alert("原始数据后，cols必须传入对应的字段名数组！");
            return false;
        }
    }
    if (!(el.indexOf("#") > -1 || el.indexOf(".") > -1)) { //当为纯文本时，则当
        el = "#" + el;
    }
    $("#downLoad").remove();
    if ($('#downLoad').length === 0) {
        $("body").append('<form id="downLoad" class="hidden" method="post"><input name="headTitle" id="headTitle" type="hidden"><input name="template" id="template" type="hidden"><input name="data" id="data" type="hidden"> <input name="fileName" id="fileName" type="hidden"></form>');
    }
    var data = new Array();
    if (isEmpty(dataBase)) {
        if ($(el).length == 1) {
            $(el).eq(0).find("tr").each(function (i, j) {
                if ($(j).css("display") !== "none") {
                    var row = new Array();
                    var tdArr = $(j).children();
                    var thRow = false;
                    if ($(j).find("td").length === 0) {
                        thRow = true;
                    }
                    if (isEmpty(template) || (!thRow && isNotEmpty(template))) {
                        for (var columnI = 0; columnI < tdArr.length; columnI++) {
                            var td = tdArr.eq(columnI);
                            if (isEmpty(cols) || (isNotEmpty(cols) && cols.in_array(columnI))) {
                                if ($(td).css("display") !== "none") {
                                    var column = {};
                                    column.head = thRow;
                                    column.value = $(td).text().replaceAll("&nbsp;", "");
                                    if (isNotEmpty($(td).attr("colspan"))) {
                                        column.colspan = $(td).attr("colspan");
                                    } else {
                                        column.colspan = 1;
                                    }
                                    if (isNotEmpty($(td).attr("rowspan"))) {
                                        column.rowspan = $(td).attr("rowspan");
                                    } else {
                                        column.rowspan = 1;
                                    }
                                    column.backgroundColor = $(td).css("background-color");
                                    row.push(column);
                                }
                            }
                        }
                        data.push(row);
                    }
                }
            });
        } else {
            alert("未找到对应的" + el + "表格或者表格非唯一！表格数量" + $(el).length);
        }
    } else {
        for (var i = 0; i < dataBase.length; i++) {
            var row = new Array();
            var rowData = dataBase[i];

            if (i == 0) {
                var rowTitle = new Array();
                for (var columnI = 0; columnI < cols.length; columnI++) {
                    if (columnI == 0) {
                        var column = {};
                        column.head = true;
                        column.value = '序号';
                        column.colspan = 1;
                        column.rowspan = 1;
                        rowTitle.push(column);
                    }
                    var column = {};
                    column.head = true;
                    column.value = cols[columnI].title;
                    column.colspan = 1;
                    column.rowspan = 1;
                    rowTitle.push(column);
                }
                data.push(rowTitle);

            }
            for (var columnI = 0; columnI < cols.length; columnI++) {
                if (columnI == 0) {
                    var columnIndex = {};
                    columnIndex.head = false;
                    columnIndex.value = i + 1;
                    columnIndex.colspan = 1;
                    columnIndex.rowspan = 1;
                    row.push(columnIndex);
                }
                var rowContent = rowData[cols[columnI].fieldName];
                rowContent = isEmpty(rowContent, "");
                var column = {};
                column.head = false;
                column.value = rowContent;
                column.colspan = 1;
                column.rowspan = 1;
                row.push(column);
            }
            data.push(row);
        }
    }
    if (data.length > 0) {
        if (isEmpty(template)) {
            var fileName = getDate("YMD");
            data = "{" + '"data"' + ":" + JSON.stringify(data) + '}';
            $("#data").val(data);
            if (isEmpty(headTitle)) {
                headTitle = ""
            } else {
                fileName = headTitle;
            }
            $("#headTitle").val(headTitle);
            $("#fileName").val(fileName + ".xls");
            $("#downLoad").attr("action", getUrl() + '/tick-tc-tt/sys/common/exportByTable');
        } else {
            $("#fileName").val(headTitle + getDate("Y4MD"));
            $("#template").val(template);
            var templateData = {};
            templateData.list = data;
            $("#data").val(JSON.stringify(templateData));
            $("#downLoad").attr("action", getUrl() + '/tick-tc-tt/sys/common/commonExportByTemplate');
        }
        $("#downLoad").submit();
    } else {
        alert("不能导出空数据！");
    }
}