var sppEditArr=[],lastSelColIndex=0,searchLabel=isAdding?i18n.filterThese:i18n.search,totalWidth,minPerWidthPx,daysPerPx,pxPerDay,$copySppRow,changedIcon='<i class="icon-changed"></i>',copyMsgDefault=$('#copyto-status').html(),maxNumCol=13,minDaysPerPer=5,numSppToCopy=0;$.fx.off=!0;function setEdited(rowId)
{if($.inArray(rowId,sppEditArr)==-1)
{$('#cb_'+rowId).parent().append(changedIcon);sppEditArr.push(rowId);$('#btn_save').text(i18n.save+" ("+sppEditArr.length+")");if(sppEditArr.length==1)
{$('#btn-copyto-filter').prop("disabled",!0);$('#btn_save').prop("disabled",!1);$('#btn_revert').prop("disabled",!1)}}}
function dateFromDay(day)
{var date=new Date(2012,0);return new Date(date.setDate(day))}
function dateStrFromDate(date)
{var month=date.getMonth()+1;var dayOfMonth=date.getDate();return i18n.months[month-1]+" "+dayOfMonth}
function linearDateFromDateStr(month,day){switch(month){case i18n.months[0]:return day;case i18n.months[1]:return 31+day;case i18n.months[2]:return 31+28+day;case i18n.months[3]:return 31+28+31+day;case i18n.months[4]:return 31+28+31+30+day;case i18n.months[5]:return 31+28+31+30+31+day;case i18n.months[6]:return 31+28+31+30+31+30+day;case i18n.months[7]:return 31+28+31+30+31+30+31+day;case i18n.months[8]:return 31+28+31+30+31+30+31+31+day;case i18n.months[9]:return 31+28+31+30+31+30+31+31+30+day;case i18n.months[10]:return 31+28+31+30+31+30+31+31+30+31+day;case i18n.months[11]:return 31+28+31+30+31+30+31+31+30+31+30+day}
return null}
function mmDDFromDateStr(month,day){var dayStr=day.length==2?""+day:"0"+day;switch(month){case i18n.months[0]:return"01"+dayStr;case i18n.months[1]:return"02"+dayStr;case i18n.months[2]:return"03"+dayStr;case i18n.months[3]:return"04"+dayStr;case i18n.months[4]:return"05"+dayStr;case i18n.months[5]:return"06"+dayStr;case i18n.months[6]:return"07"+dayStr;case i18n.months[7]:return"08"+dayStr;case i18n.months[8]:return"09"+dayStr;case i18n.months[9]:return"10"+dayStr;case i18n.months[10]:return"11"+dayStr;case i18n.months[11]:return"12"+dayStr}
return null}
function onResize(e)
{var selCol=$(e.currentTarget).find("td").eq(lastSelColIndex+1),newDate=selCol.find(".tc span.dt").html(),monthStr=newDate.substring(0,3),dayStr=newDate.substring(4);setEdited($(e.currentTarget).find("tr").attr("id"));selCol.children('.tc').children(":hidden").attr("value",mmDDFromDateStr(monthStr,dayStr))}
function onDrag(e,selColIndex)
{lastSelColIndex=selColIndex;var columns=$(e.currentTarget).find("td"),sumWidthPx=0.0,curDateSpan=columns.eq(selColIndex+1).children('.tc').children("span.dt"),$range=$(e.currentTarget).find('#range-current');for(var i=0;i<=selColIndex;i++){sumWidthPx+=columns.eq(i).width()}
var curDate=curDateSpan.html(),newDate=dateStrFromDate(dateFromDay(Math.ceil(sumWidthPx*daysPerPx)));if(newDate!=curDate)
{curDateSpan.html(newDate);return}
if($range.length>0){updateRangePop($range)}}
function initiateColResize($targetTable)
{var numCols=$targetTable.find("td").length;if(numCols<=1){return!1}
$targetTable.colResizable({draggingClass:'rangeDrag',dragCursor:'col-resize',gripInnerHtml:'<div class="rangeGrip"></div>',hoverCursor:'col-resize',liveDrag:!0,minWidth:minPerWidthPx,onDrag:onDrag,onResize:onResize,postbackSafe:!1})}
function removeColumn($column)
{var numSiblings=$column.siblings().length;if(numSiblings==0)
return!1;var $colToResize=$column.prev('td'),delFirstCol=$colToResize.length===0,rowId=$column.parent().attr("id");if(delFirstCol)
{$colToResize=$column.next('td');$colToResize.find('.dt').html('Jan 1');$colToResize.find("input:hidden").attr("value","0101")}
var $parent=$colToResize.parents('.JColResizer');$parent.colResizable({'disable':!0});var $newColWidth=$colToResize.width()+$column.width();$column.remove();$colToResize.attr('style','width:'+$newColWidth+'px');var startIndex=$colToResize.index()+(delFirstCol?1:2);var fnRename=function(i)
{$(this).find("input").each(function(j)
{var curName=$(this).attr("name"),colIndex=i+startIndex;var newName=curName.replace("["+colIndex+"]","["+(colIndex-1)+"]");$(this).attr("name",newName)})};if(delFirstCol)
$colToResize.nextAll().andSelf().each(fnRename);else $colToResize.nextAll().each(fnRename);initiateColResize($parent);$colToResize.find('input').select();setEdited(rowId);if(numSiblings==maxNumCol-1)
{$('#'+rowId+"_add").prop("disabled",!1)}}
function doCopyLimits()
{disableInputs();$("#hid_copy").attr("name","copySpp");$("#hid_copy").attr("value",!0);enableCheckedInputs();$("#fullChecklist").submit();return!1}
function checkRangeWidth($range)
{var isSmall=!1,characterWidth=8,minWidth=0,$dt=$range.find('.dt'),$input=$range.find('input');if($dt.length>0&&$input.length>0)
{minWidthDate=$dt.html().length*characterWidth,minWidthCount=$input.val().length*characterWidth;if(minWidthDate>minWidthCount){minWidth=minWidthDate}else{minWidth=minWidthCount}
if($range.width()<minWidth){isSmall=!0}}
return isSmall}
function updateRangePop($range)
{var $currentPop=$('#current-pop'),popContent='<div class="ttip-range"><a href="#delete" tabindex=-1 id="ttip-delete" class="btn btn-inverse btn-mini">'+i18n.DEL+'</a></div>',$input=$range.find('input'),isSmall=checkRangeWidth($range);if(isSmall){popContent='<div class="ttip-range w-data"><div class="ttip-data">'+$input.siblings('.dt').html()+' <strong id="current-pop-count">'+$input.val()+'&nbsp;</strong></div> <a href="#delete" id="ttip-delete" tabindex=-1 class="btn btn-inverse btn-mini">'+i18n.DEL+'</a></div>'}
$('#pop-content').html(popContent);$('#current-pop-count').html($input.val());var leftMargin=-1*$currentPop.width()/2-5;$currentPop.css('margin-left',leftMargin+'px');$('#ttip-delete').click(function(e)
{removeColumn($range);$(this).remove();return!1})}
function createRangePop($range)
{var $rangePop=$('<div id="current-pop" class="tooltip bottom" style="opacity:1;left:50%;"><div class="tooltip-arrow"></div><div id="pop-content" class="tooltip-inner"></div></div>'),popContent='<div class="ttip-range"><a href="#delete" id="ttip-delete" class="btn btn-inverse btn-mini">'+i18n.DEL+'</a></div>',$input=$range.find('input'),isSmall=checkRangeWidth($range);if(isSmall){popContent='<div class="ttip-range w-data"><div class="ttip-data">'+$input.siblings('.dt').html()+' <strong id="current-pop-count">'+$input.val()+'&nbsp;</strong></div> <a href="#delete" id="ttip-delete" class="btn btn-inverse btn-mini">'+i18n.DEL+'</a></div>'}
$range.children('.tc').append($rangePop);$('#pop-content').append(popContent);updateRangePop($range)};function adjustColWidth()
{var $target=$('#filter-grid-species').children('li:visible:not(.spc):first');targetSrvWidth=$target.find('.srv').width(),$firstCol=$target.filter(':first').children('table');initiateColResize($firstCol);$('#month-scale').find('.scale-month').each(function(){var dataPeriod=parseFloat($(this).data('period'))/100;$(this).width(Math.round(targetSrvWidth*dataPeriod))})}
function addColumn($target,month,day,count)
{var linearDate=linearDateFromDateStr(month,parseInt(day)),pixelDate=(linearDate-1)*pxPerDay,precedingMonthWidths=0,rowId=$target.find("tr").attr("id"),colAdded=!1,tooNarrow=!1,$colList=$target.find('td'),numCol=$colList.length;$colList.each(function(i)
{var $this=$(this),thisColWidth=$this.width();if(thisColWidth<minPerWidthPx)
{tooNarrow=!0;return!1}
precedingMonthWidths+=thisColWidth;if(precedingMonthWidths>pixelDate)
{if(!colAdded)
{var newSplitColWidth=Math.round(pixelDate-(precedingMonthWidths-thisColWidth)),newColWidth=thisColWidth-newSplitColWidth;if(newSplitColWidth<minPerWidthPx||newColWidth<minPerWidthPx)
{tooNarrow=!0;return!1}
$target.colResizable({'disable':!0});$this.attr('style','width:'+newSplitColWidth+'px');var $newColumn=$("#filterColTmpl").tmpl({"colWidthPx":newColWidth,"dt":month+' '+day,"rowId":rowId,"colIndex":i+1,"countLimit":count,"mmDDStr":mmDDFromDateStr(month,day)});$this.after($newColumn);initiateColResize($target)}
else{$this.find("input").each(function(j)
{var curName=$(this).attr("name"),newName=curName.replace("["+i+"]","["+(i+1)+"]");$(this).attr("name",newName)})}
colAdded=!0}});if(tooNarrow)
{$('.arg-msg').show();return!1}
setEdited(rowId);if(numCol==maxNumCol-1)
{$('#arg-cancel').trigger('click');$('#'+rowId+"_add").prop("disabled",!0)}}
function addRangeModal($target)
{var months=i18n.months,monthOptions='<option>- - -</option>',dayOptions='<option>- - -</option>';for(month in months){monthOptions+='<option>'+months[month]+'</option>'}
for(i=1;i<=31;i=i+1){dayOptions+='<option>'+i+'</option>'}
var timePerMsg=i18n.timePer1+" "+minDaysPerPer+" "+i18n.timePer2;var $formTemplate=$('<form id="form-add-range" class="alert-info form-inline arg-form" style="display:none;"><h4 class="arg-msg hide">'+timePerMsg+'</h4><h3 class="arg-head">'+i18n.addLimit+':</h3> <div class="arg-opt-group"><label for="ar-month-options">'+i18n.month+'</label> <select id="ar-month-options" class="input-mini">'+monthOptions+'</select></div> <div class="arg-opt-group"><label for="ar-day-options">Day</label> <select id="ar-day-options" class="input-mini">'+dayOptions+'</select></div> <div class="arg-opt-group"><label for="ar-count">Count Limit</label> <input type="text" id="ar-count" class="input-mini ar-count"></div> <div class="arg-opt-group"><input type="submit" value="'+i18n.addLimit+'" id="arg-add" class="btn btn-primary"> <button type="button" id="arg-cancel" class="btn">'+i18n.close+'</button></div></form>');$target.append($formTemplate);$('#ar-count').numeric({decimal:!1,negative:!1},function(){alert(i18n.posOnly);this.value="";this.focus()});var $addBtn=$('#arg-add'),$cancelBtn=$('#arg-cancel'),$monthOptions=$('#ar-month-options'),$dayOptions=$('#ar-day-options'),$count=$('#ar-count'),$firstInput=$('#form-add-range select:first')
clearRangeForm=function(){$monthOptions.val('');$dayOptions.val('');$count.val('')};$addBtn.click(function(e){addColumn($target.children('table'),$monthOptions.val(),$dayOptions.val(),$count.val());clearRangeForm();$firstInput.focus();return!1});$cancelBtn.click(function(e){$formTemplate.remove();return!1});$formTemplate.show();$firstInput.focus()}
function launchNotSaved(type)
{var $notSavedWarning='';switch(type){case 'revert':$notSavedWarning=$('#revert-warning');break;case 'copytofilter':$notSavedWarning=$('#copy-to-filter-warning');break;default:$notSavedWarning=$('#not-saved-warning')}
if($notSavedWarning.length>0){$notSavedWarning.modal({'backdrop':!0,'keyboard':!0})}};function disableInputs()
{$("#filter-grid-species :input").attr("disabled",!0)};function enableInputs()
{$("#filter-grid-species :input").removeAttr("disabled")};function enableEditedInputs()
{for(var i=0;i<sppEditArr.length;i++)
{$("#"+sppEditArr[i]+" :input").removeAttr("disabled")}};function enableCheckedInputs()
{$("#fullChecklist :input:checked").each(function()
{var speciesCode=this.id.split("_")[1];$("#"+speciesCode+" :input").removeAttr("disabled")})}
function copyExisting()
{var fromRowId=$copySppRow.attr("id");$("#fullChecklist :input:checked").each(function()
{var rowId=this.id.split("_")[1];var newContent=$copySppRow.html();var $curRow=$("#"+rowId);var $curTable=$("#"+rowId+"_out").find('.srv > table');$curTable.colResizable({'disable':!0});$curRow.html(newContent);$curRow.find("input").each(function(j)
{var curName=$(this).attr("name"),newName=curName.replace(fromRowId,rowId);$(this).attr("name",newName)});initiateColResize($curTable);setEdited(rowId)});$("#fullChecklist :input:checked").prop("checked",!1)}
function updateWidths()
{totalWidth=$('.srv:visible table','#filter-grid-species').filter(':first').width();daysPerPx=366.0/totalWidth;pxPerDay=1/daysPerPx;minPerWidthPx=Math.floor((minDaysPerPer-.9)*pxPerDay)}
function updateSpeciesToCopy(num)
{if(num===0){$('#copyto-status').html(copyMsgDefault)}else{$('#copyto-status').html(i18n.appRanLim+' <a href="#" id="selected-list">'+num+' '+i18n.taxa+'...</a>')}
$('#selected-list').click(function(e){e.preventDefault();e.stopPropagation();var $sppList=$('.cb-spp:checked').siblings('.snam');sppListDisp='<div class="selected-pop">';$sppList.each(function(){sppListDisp+=$(this).html()+'<br>'});sppListDisp+='</div>';$(this).tooltip({'placement':'bottom','title':sppListDisp,'trigger':'manual'});$(this).tooltip('toggle')})};function copyExistingHide()
{$('#panel-copy-to').modal('hide');$('.bulk-actions').addClass('btn-group').removeClass('ba-copy-to');$('#filter-grid-species_filter').removeClass('ba-copy-to');$('#btn-search-clear').removeClass('bsc-copy-existing');$('#panel-copy-to').trigger('copyclosed')};function copyExistingShow(){$('#panel-copy-to').show();updateSpeciesToCopy($('.cb-spp:checked').length);$('#select-all-dialog .holder').hide();$('.oncopy-hide').attr('style','visibility:hidden');$('.oncopy-show').show();$('.bulk-actions').removeClass('btn-group').addClass('ba-copy-to');$('#filter-grid-species_filter').addClass('ba-copy-to');$('#btn-search-clear').addClass('bsc-copy-existing')};$(document).ready(function()
{adjustColWidth();$(window).resize(function(){adjustColWidth();updateWidths()});var $searchInput=$('#filter-spp'),$searchClearBtn=$('#btn-search-clear');$searchInput.fastLiveFilter('#filter-grid-species',{timeout:200,callback:function(total){var $loadingItems=$('#loading-msg, #loading-bg');if(total===0){$('#not-found').show()}else{$('#not-found').hide()}
$loadingItems.hide()}}).keyup(function(){var searchStr=$(this).val();searchStr.length>0?$searchClearBtn.show():$searchClearBtn.hide()});$searchClearBtn.click(function(e){var $this=$(this);e.preventDefault();e.stopPropagation();$searchInput.val('').focus().trigger('keydown');$this.hide()});$('#btn_cancel').click(function(){history.back()});$('#region-toggler').clickover({'content':$('#region-name-codes').html(),'placement':'bottom','onShown':function(){$('#view-desc').clickover('hide');$('.popover-content .btn-select').click(function(e){e.preventDefault();e.stopPropagation();var target=$(this).attr('href');$('.popover-content '+target).select()})}});if(!editable)
return;updateWidths();$('.fgs > li > .srv > table').one("mouseenter",function(e)
{initiateColResize($(this))});$('#filter-grid-species').on("change","input.lim",function(e)
{var rowId=this.parentNode.parentNode.parentNode.getAttribute('id'),newLimit=this.value;$(this).attr("value",newLimit);if(newLimit==0)
$(this).addClass("rare");else $(this).removeClass("rare");setEdited(rowId)});$('#filter-grid-species').on("focus","input.lim",function(e)
{this.select();var $currentRange=$(this).parent().parent('td');$currentRange.addClass('range-current').prop('id','range-current');$('#current-pop').remove();if($currentRange.siblings().length>0)
{createRangePop($currentRange);$(this).keyup(function(){updateRangePop($currentRange)}).blur(function(){$currentRange.removeClass('range-current').attr('id','')})}
$(this).numeric({decimal:!1,negative:!1},function(){alert(i18n.posOnly);this.value="";this.focus()})});$('#filter-grid-species').on("click","input.lim",function(e){e.stopPropagation()});$('.CRZ').click(function(e){e.stopPropagation()});var $selectAllSpp=$('#input-select-all-spp, #input-select-all-spp2, #input-select-all-spp-oncopy');$selectAllSpp.click(function(){var $cbs=$('.cb-spp');$cbs.prop('checked',this.checked);updateSpeciesToCopy($('.cb-spp:checked').length)});var $btnCopyNew=$('.btn-copy-new'),$btnCancelCopy=$('#copy-existing-cancel, #copy-cancel'),$selectAllExistingCb=$('#select-all-dialog .checkbox');$('.btn-copy-existing').click(function()
{var speciesCode=this.id.split("_")[0];$copySppRow=$('#'+speciesCode);$('.cb-spp').prop('checked',!1);$('#tbl_copy_preview').html($copySppRow.html());$('#tbl_copy_preview :input').prop('disabled',!0);$('#add-toolbar').hide();$('input:checkbox').show();copyExistingShow()});$("#copy-existing-continue").click(function()
{copyExisting();copyExistingHide();$('#panel-copy-to').hide();return!1});$btnCopyNew.click(function(){var speciesCode=this.id.split("_")[0];copyExistingHide();$copySppRow=$("#"+speciesCode);$('#add-toolbar').show().addClass('copy-new');$('#add-spp-input').focus();$("#hid_add_from").attr("name","copyFrom");$("#hid_add_from").attr("value",speciesCode);$('#tbl_copynew_preview').show();$('#tbl_copynew_preview').html($copySppRow.html()).find('input').prop('disabled',!0)});$btnCancelCopy.click(function(){$copySppRow=null;copyExistingHide()});var $radioBtnTogglers=$('.btn-radio-toggler');$radioBtnTogglers.button();$('#copy-existing-cancel').click(function(){$('#panel-copy-to').hide()});$('#href_ddt').click(function(e){$(this).tooltip('hide');e.preventDefault()}).dropdown().tooltip();$('.btn-add-range').click(function(e){e.preventDefault();var $targetTable=$(this).parents('.srh').next('.srv').children('table');if(!$targetTable.hasClass('JColResizer')){initiateColResize($targetTable)}
if($(this).parents('.srh').next('.srv').children('#form-add-range').length===0){$('#form-add-range').remove();addRangeModal($(this).parents('.srh').next('.srv'))}else{$('#form-add-range').remove()}}).tooltip();$('#btn_revert').click(function(e)
{if(sppEditArr.length>0){launchNotSaved('revert');return!1}});$('#copy-limits').click(function()
{$('#copy-confirm').modal('hide');var numFiltersSel=$("#filter-list :checked").length,numSppSel=$("#filter-grid-species :checked").length;$('#copy-to-filter-warning p').html(i18n.cfWarn1+' <b>'+numSppSel+'</b>'+(numSppSel>1?' '+i18n.taxa:' '+i18n.taxon)+' to <b>'+numFiltersSel+'</b> '+i18n.unFil);launchNotSaved('copytofilter')});$('#btn_sync').click(function()
{$("#hid_sync").attr("name","sync");$("#hid_sync").attr("value",!0);$("#fullChecklist").submit();return!1});$('#btn_del').click(function(e)
{disableInputs();$("#filter-grid-species :checked").removeAttr("disabled");if(sppEditArr.length>0){launchNotSaved();return!1}
$("#fullChecklist").submit();return!1});$('#filter-list > li').tsort();$('#input-select-all-filters').click(function(){var $cbs=$('#filter-list > li:visible input');$cbs.prop('checked',this.checked)});$('#btn-copyto-filter').click(function()
{var $searchFiltersInput=$('#input-filter-filters'),$searchFilterClear=$('#btn-search-filters-clear');if($("#fullChecklist :input:checked").length==0)
{alert(i18n.cofs);return!1}
$('#copy-confirm').modal('show');$searchFiltersInput.focus();$searchFiltersInput.fastLiveFilter('#filter-list',{timeout:200}).keyup(function(){var searchStr=$(this).val();searchStr.length>0?$searchFilterClear.show():$searchFilterClear.hide()});$searchFilterClear.click(function(e){var $this=$(this);e.preventDefault();e.stopPropagation();$searchFiltersInput.val('').focus().trigger('keydown');$this.hide()})});$('#btn_conf').click(function(e)
{$("#fullChecklist").submit();return!1});$('#btn_conf_save').click(function(e){enableEditedInputs();$("#fullChecklist").submit();return!1});$('#btn_conf_revert').click(function(e){window.location.reload();return!1});$('#btn_conf_copy').click(function(e){doCopyLimits();return!1});$('#btn_add').click(function(e){disableInputs();enableCheckedInputs();$("#fullChecklist").submit();return!1});$('#btn_save').click(function(e){disableInputs();enableEditedInputs();$("#fullChecklist").submit()});$('#filter-grid-species li .srh .cb-spp').on('change',function(e){updateSpeciesToCopy($('.cb-spp:checked').length)});$(document).click(function(e){$('.tooltip').remove()})})