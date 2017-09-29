/*
	@company 博育云
	@site : www.boyuyun.cn
	@author boyuyun
*/

byy.define(function(a){"use strict";var b=(window.document,100),c={},d={},e=100,f={striped:!1,singleSelect:!1,index:++b,data:[],sortSingle:!1,checkOnSelect:!1,onClickRow:function(){}},g=function(a){if(!a.selector)return void byy.error("selector must in table config");if(!a.columns)return void byy.error("columns must in table config");var b=byy.extend(f,a);return b.target=$(b.selector),g.create(b),new g.prototype.init(b)};g.prototype={version:"1.0.0",constructor:g,init:function(a){return this.cfg=a,this},loadData:function(a){var b=this.cfg;b.data=a,this.cfg=b,g.create(b)},reload:function(){g.create(this.cfg)},getSort:function(){return g.getSort(this.cfg.selector)}},g.fn=g.prototype,g.prototype.init.prototype=g.fn,byy.extend(g,{create:function(a){g.beauty(a),g.getHead(a),g.getBody(a),g.bindEvent(a)},getSort:function(a){var b=d[a],c=[],e=[];if(null!=b&&b.length>0)for(var f=0;f<b.length;f++){var g=b[f];g.sortNo?c.push(g):e.push(g)}return c.length>0&&c.sort(function(a,b){return a.sortNo>b.sortNo}),c.concat(e)},bindEvent:function(a){$("body").off("change","input[id^=selectAll]").on("change","input[id^=selectAll]",function(){var a=$(this),b=a.prop("checked");a.parent().parent().parent().parent().find("th:not(.byy-table-fro),td:not(.byy-table-fro)").find('[type="checkbox"]:not(.hide)').prop("checked",b)}),$("body").off("click",'th[id^="sort_"]').on("click",'th[id^="sort_"]',function(){var b=$(this),e=b.attr("id"),f=b.parent().find('[id^="sort_"]'),g=[];f.each(function(){var b=$(this),c=b.attr("sortname"),d=b.attr("tname")||"",f=b.attr("sortno"),h=b.attr("class"),i=b.attr("id")==e,j=i?h.indexOf("nosort")>-1?"asc":h.indexOf("asc")>-1?"desc":"asc":a.sortSingle?"nosort":h;"nosort"!=byy.trim(j)&&g.push({order:j,sort:c,tname:d,sortNo:f}),b.attr("class",j)}),d[a.selector]=g,c[e]&&byy.isFunction(c[e])&&c[e](g.length>1?g:g.length>0?g[0]:[])}),$("body").find(a.selector).off("click","tbody>tr").on("click","tbody>tr",function(b){var c=$(b.currentTarget);if(a.checkOnSelect){if(a.singleSelect){var d=c.hasClass("selected");$(a.selector).find('input[name^="table-checkbox"]:checked').prop("checked",!1),$(a.selector).find(".selected").removeClass("selected"),d&&(c.toggleClass("selected"),c.find('input[name^="table-checkbox"]').prop("checked",!0))}c.toggleClass("selected"),c.find('input[name^="table-checkbox"]').prop("checked",c.hasClass("selected")),byy.stope(b)}if(a.onClickRow){var e=c.data("obj")||{};a.onClickRow(e)}})},beauty:function(a){var b=a.target?a.target:$(a.selector);!0===a.striped&&b.attr("byy-even","even");var c=["","row","line","nob"];b.attr("byy-skin",c[byy.isNull(a.border)?0:a.border>3?0:a.border]),a.width&&b.css("width",a.width+"px")},getHead:function(a,f){var h={index:a.index||++b},i=a.columns,j=[];if(j.push("<thead><tr>"),byy.isArray(i)){var k=[];i.forEach(function(b,f){var g=(b.width?"width:"+(parseInt(b.width,10)-30)+"px;":"")+(b.align?"text-align:"+b.align+";":"");if("checkbox"in b)!0===b.checkbox&&j.push('<th class="'+(!0===b.hidden?" hide":"")+'" style="'+g+'" ><input type="checkbox" id="selectAll'+h.index+'" /> </th>');else if("sort"in b){e++,c["sort_"+e]=b.sort;var i="nosort";if(d[a.selector]&&null!=(k=d[a.selector])&&k.length>0)for(var l=0;l<k.length;l++){var m=k[l];if(m.sort==b.column){i=m.order;break}}j.push('<th id="sort_'+e+'" class="'+(!0===b.hidden?" hide":"")+" "+i+'" sortno="'+b.sortNo+'" tname="'+(b.tname||"")+'" sortname="'+(b.column||"")+'" style="'+g+'">'+(b.name||"")+'<span class="byy-edge"></span></th>')}else j.push('<th class="'+(!0===b.hidden?" hide":"")+'" style="'+g+'">'+(b.name||"")+"</th>")})}return j.push("</tr></thead>"),!f&&g.renderHead(a.target?a.target:$(a.selector),j),j},renderHead:function(a,b){a.find("thead").length>0&&a.find("thead").remove(),a.prepend(byy.isArray(b)?b.join(""):b+"")},getValue:function(a,b){if(!b)return"";for(var c=b.split("."),d=a,e=0,f=c.length;e<f;e++){var g=c[e];if(byy.isNull(d[g])){d="";break}d=d[g]}return d},getBody:function(a){var b=a?a.data||[]:[],c=a.columns||[],d=a?a.msg||"暂无数据":"暂无数据",e=$("<tbody></tbody"),f=!0===a.frozenColumn?1:!1===a.frozenColumn?0:a.frozenColumn;if(b.length>0)b.forEach(function(b){var d=$("<tr></tr>");d.data("obj",b),c.forEach(function(c,e){var f=' style="'+(c.align?" text-align:"+c.align+"; ":"")+(c.width?"width:"+(parseInt(c.width,10)-30)+"px;":"")+'"';if("checkbox"in c){var h=byy.isArray(b)?b[parseInt(c.idField||"0",10)]:b[c.idField||"id"],i=!c.filter||c.filter(b),j='<td class="'+(!0===c.hidden?" hide":" ")+'" '+f+'><input type="checkbox" class="'+(i?"":"hide")+'" name="table-checkbox-'+(a.index||e)+'" value="'+h+'" /></td>';d.append(j)}else if("column"in c){var k=g.getValue(b,c.column),j='<td class="'+(!0===c.hidden?" hide":"")+'" '+f+" >"+(c.formatter?c.formatter(k,b):k)+"</td>";d.append(j)}}),e.append(d)});else{var h=c.length;e.append('<tr><td style="height:100px;text-align:center;color:#999;" colspan="'+h+'">'+d+"</td></tr>")}g.renderBody(a.target?a.target:$(a.selector),e),f>0&&g.frozenTable(a.target?a.target:$(a.selector),f)},renderBody:function(a,b){a.find("tbody").length>0&&a.find("tbody").remove(),a.append(byy.isArray(b)?b.join(""):b)},frozenTable:function(a,b){a.find("tr").each(function(){$(this).find("th,td").each(function(a){var c=$(this),d=(c[0].nodeName,c.width(),c[0].outerHTML);a<b&&(c.after($(d).addClass("byy-table-place")),c.addClass("byy-table-fro"))})})}}),g.fn.getHead=function(){g.getHead(this.cfg)},g.fn.getBody=function(){g.getBody(this.cfg)},g.fn.selectAll=function(a){this.cfg.target.find("th:not(.byy-table-fro),td:not(.byy-table-fro)").find('[type="checkbox"]:not(.hide)').prop("checked",!!byy.isNull(a)||a)},window.$?a("table",g):byy.require("jquery",function(){a("table",g)})});