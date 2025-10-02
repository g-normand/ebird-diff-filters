var elementon='no';function hideElement(element){var target=document.getElementById(element);target.style.display='none'}
function showElement(element){var target=document.getElementById(element);target.style.display='block'}
function toggleCheckBoxes(myForm,mainCheckBoxName,listCheckBoxName){var setValue=myForm[mainCheckBoxName].checked;setCheckBoxes(myForm,listCheckBoxName,setValue)}
function setCheckBoxes(myForm,listCheckBoxName,setValue){if(myForm[listCheckBoxName]){if(typeof myForm[listCheckBoxName].length=="undefined"){myForm[listCheckBoxName].checked=setValue}
else{var numBox=myForm[listCheckBoxName].length;for(i=0;i<numBox;i++){myForm[listCheckBoxName][i].checked=setValue}}}}
function toggleElement(element){var target=document.getElementById(element);if(elementon=='yes'){hideElement(element);elementon='no'}
else{showElement(element);elementon='yes'}}
function clearInput(element){element.value='';element.style.color='#000'}
function setupSearchToggler(){var optionToggler=$('#optiontoggler .toggler');var cancelToggler=$('#cancel');if(optionToggler.length>0){optionToggler.click(function(){$('#searchfilters').animate({height:'toggle'},100);return!1})}
if(cancelToggler.length>0){cancelToggler.click(function(){$('#searchfilters').animate({height:'toggle'},100);return!1})}}
var targetWindow='';function openWindow(which,windowType){var width=465;var height=500;var targetWindow=window.open(which,"poppedWindow","toolbar=0,status=0,width="+width+",height="+height+",directories=0,scrollbars=1,location=0,resizable=1,menubar=0");if(window.focus){targetWindow.focus()}
return!1}
function openEmailWindow(which,windowType){var width=720;var height=660;var targetWindow=window.open(which,"poppedWindow","toolbar=0,status=0,width="+width+",height="+height+",directories=0,scrollbars=1,location=0,resizable=1,menubar=0");if(window.focus){targetWindow.focus()}
return!1}
function jumpToGroup(whichGroup){var whichGroup=document.getElementById(whichGroup);var url_add=whichGroup.value;window.location.href=url_add}
function delSpp(){var sppCode=$(this).attr("id");$("input:hidden[value='"+sppCode+"']").remove();$("li[id='li_"+sppCode+"']").remove()}
function setupBody(){if($(('#signin').length>0)||($('#forgot').length>0)){$('#userName').focus()}}
$(document).ready(function()
{$.ajaxSetup({headers:{'x-ebirdapitoken':'jfekjedvescr'}});setupSearchToggler();setupBody();var sppSearchInput=$("#speciesSearch");if(sppSearchInput.length>0){sppSearchInput.suggest("https://api.ebird.org/v2/ref/taxon/find?locale="+sppLocale,{minchars:3,imgBusy:'#busyImg1',imgBusySrc:'/reviewContent/images/busy.gif',imgBlankSrc:'/reviewContent/images/sp.gif',delay:220,onSelect:function()
{var sppName=this.value.split('|')[0];var sppCode=this.value.split('|')[1];$("#searchResults").append("<li class='lires' id='li_"+sppCode+"'>"+sppName+"[<a class='del' id='"+sppCode+"' href='#'>X</a>]</li>");$("#speciesInputs").append("<input type='hidden' name='speciesCodes' value='"+sppCode+"'/>");$("#"+sppCode).click(delSpp);this.value="";$(this).focus()}});$(".del").click(delSpp)}
$("#inp_reset").click(function()
{$(".lires").remove();$("input:hidden").remove();$(this).closest('form').find("input[type=text], textarea").val("");return!0});var token=$("meta[name='_csrf']").attr("content");if(typeof token!='undefined')
{var header=$("meta[name='_csrf_header']").attr("content");$(document).ajaxSend(function(e,xhr,options)
{if(options.type!='GET')
xhr.setRequestHeader(header,token)})}
$("form").submit(function(){$(':submit',this).click(function(){return!1})})})