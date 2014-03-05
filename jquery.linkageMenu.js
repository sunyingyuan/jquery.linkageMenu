/**
 * jQuery Linkage Menu
 *
 * Copyright 2014, sunyingyuan
 * QQ: 1586383022
 * Email: yingyuansun@163.com
 *
 * 二级/三级 联动菜单
 * 支持二级或三级联动，支持页面静态json和AJAX动态从后台获取值
 *
 * 简单使用方法介绍：
 * HTML代码：
 * <select id="selectOne">
 *      <option>一级菜单默认显示名称</option>
 * </select>
 * <select id="selectTwo">
 *      <option>二级菜单默认显示名称</option>
 * </select>
 * 如果有三级菜单，同上
 *
 * JS代码:
 * 引入jQuery和jquery.linkageMenu.js后
 * 其中jquery.linkageMenu.js必须在jQuery之后引入
 *
 * $(function(){
 *          $.linkageMenu({
 *              'selectOneId': 'selectOne', //一级菜单Id
                'selectTwoId': 'selectTwo', //二级菜单Id
                'selectThreeId': '', //三级菜单Id
                'selectOneVal': '', //一级菜单option值
                'selectTwoVal': '', //二级菜单option值
                'selectThreeVal': '', //三级菜单option值
                'selectOneParam': 'selectOneValue', //向后台获取二级菜单的值时，一级菜单的参数名称，默认是selectOneValue
                'selectTwoParam': 'selectTwoValue', //向后台获取三级菜单的值时，二级菜单的参数名称，默认是selectTwoValue
                'getSelectTwoValUrl': '', //得到二级菜单value的url
                'getSelectThreeValUrl': '' //得到三级菜单value的url
 *          });
 * });
 *
 */
(function ($) {
    $.linkageMenu = function (options) {

        //默认参数
        var settings = $.extend({
            'selectOneId': 'selectOne', //一级菜单Id
            'selectTwoId': 'selectTwo', //二级菜单Id
            'selectThreeId': '', //三级菜单Id
            'selectOneVal': '', //一级菜单option值
            'selectTwoVal': '', //二级菜单option值
            'selectThreeVal': '', //三级菜单option值
            'selectOneParam': 'selectOneValue', //向后台获取二级菜单的值时，一级菜单的参数名称，默认是selectOneValue
            'selectTwoParam': 'selectTwoValue', //向后台获取三级菜单的值时，二级菜单的参数名称，默认是selectTwoValue
            'getSelectTwoValUrl': '', //得到二级菜单value的url
            'getSelectThreeValUrl': '' //得到三级菜单value的url
        }, options);

        var $s1 = $("#" + settings.selectOneId);
        var $s2 = $("#" + settings.selectTwoId);
        var $s3 = $("#" + settings.selectThreeId);

        //一级菜单初始化
        _selectValParseJSON($.parseJSON(settings.selectOneVal), $s1);
        //当一级菜单变化时，二级菜单改变option值
        $s1.change(function () {
            _changeMenu($s1, $s2, settings.selectTwoVal, settings.selectOneParam, settings.getSelectTwoValUrl);
            $s2.change();
        });

        //如果有三级菜单，当二级菜单改变时，三级菜单改变option
        if (settings.selectThreeId) {
            $s2.change(function () {
                _changeMenu($s2, $s3, settings.selectThreeVal, settings.selectTwoParam, settings.getSelectThreeValUrl);
            });
        }

        /**
         * Private Methods : _changeMenu
         *
         * 当select组件的value发生改变时，对下一级select组件value产生的影响，即下一级select组件值的改变
         * @param preSelectIdObj : value发生变化的组件的对象
         * @param folSelectIdObj : 由于变化的组件产生影响的下一级组件的对象
         * @param folSelectMenuVal : 下一级组件的静态值（非AJAX从后台获取数据时用）
         * @param getFolSelectMenuValParam : AJAX获取数据时，向后台请求的参数
         * @param getFolSelectMenuValUrl : AJAX获取数据的URL
         * @private
         */
        function _changeMenu(preSelectIdObj, folSelectIdObj, folSelectMenuVal, getFolSelectMenuValParam, getFolSelectMenuValUrl) {
            //preSelectIdObj.change(function () {
            folSelectIdObj.html("");
            var preSelectedVal = preSelectIdObj.val();
            if (folSelectMenuVal) {
                _selectValParseJSON($.parseJSON(folSelectMenuVal), folSelectIdObj);
                return;
            }
            //ajax异步获取下一级菜单数据
            $.ajax({
                type: "GET",
                url: getFolSelectMenuValUrl,
                data: getFolSelectMenuValParam + "=" + preSelectedVal,
                success: function (val) {
                    _selectValParseJSON($.parseJSON(val), folSelectIdObj);
                }
            });
            //});
        }

        /**
         * Private Methods : _selectValParseJSON
         *
         * 将json填充到指定id的select组件上
         * @param jsonVal : json对象，要填充到select组件上的json对象
         * @param selectId : 要填充的select组件的Id
         * @private
         */
        function _selectValParseJSON(jsonVal, selectId) {
            $.each(jsonVal, function (key, val) {
                _appendOptionTo(selectId, key, val);
            });
        };

        /**
         * Private Methods : _appendOptionTo
         *
         * 将值增加到option组件
         * @param $obj : The selected object jquery，一般为需要添加option的select对象
         * @param key : option的key，一般为设置的Id
         * @param val ; option的val，同时一般也作为显示的值，在这里我们默认为显示的value和option的value是同一个值
         * @param defaultSelectVal ; 设置默认选中的值，一般为初始化的情况下，默认选中的value
         * @private
         */
        function _appendOptionTo($obj, key, val, defaultSelectVal) {
            var $opt = $("<option>").text(key).val(val);
            if (val == defaultSelectVal) {
                $opt.attr("selected", "selected");
            }
            $opt.appendTo($obj);
        }
    };
})(jQuery);