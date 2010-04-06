/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var toggledRows = new Array();
var toggledCols = new Array();
var mouseX = 0;
var mouseY = 0;
var passvar = 0;

var browser = "";
function setBrowser() {
	browser = navigator.appName;
	if(navigator.appName == 'Netscape') {
		var regex = new RegExp('Safari');
		if(navigator.appVersion.match(regex)) {
			browser = 'Safari';
		}
	}
	else if(navigator.appName == 'Microsoft Internet Explorer') {
		browser = 'IE';
	}
}
setBrowser();

function testJS() {
	if(document.getElementById('testjavascript'))
		document.getElementById('testjavascript').value = '1';
}

function checkAllCompUtils() {
	var count = 0;
	var obj;
	while(obj = document.getElementById('comp' + count)) {
		obj.checked = true;
		document.getElementById('compid' + count).className = 'hlrow';
		toggledRows['compid' + count] = 1;
		count++;
	}
	return true;
}

function uncheckAllCompUtils() {
	var count = 0;
	var obj;
	while(obj = document.getElementById('comp' + count)) {
		obj.checked = false;
		document.getElementById('compid' + count).className = '';
		toggledRows['compid' + count] = 0;
		count++;
	}
	return true;
}

function reloadComputerSubmit() {
	var formobj = document.getElementById('utilform');
	var obj = document.getElementById('continuation');
	var contobj = document.getElementById('reloadcont');
	obj.value = contobj.value;
	formobj.submit();
}

function compStateChangeSubmit() {
	var formobj = document.getElementById('utilform');
	var obj = document.getElementById('continuation');
	var contobj = document.getElementById('statecont');
	obj.value = contobj.value;
	formobj.submit();
}

function compScheduleChangeSubmit() {
	var formobj = document.getElementById('utilform');
	var obj = document.getElementById('continuation');
	var contobj = document.getElementById('schcont');
	obj.value = contobj.value;
	formobj.submit();
}

Array.prototype.inArray = function(data) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] === data) {
			return true;
		}
	}
	return false;
}

Array.prototype.search = function(data) {
	for (var i = 0; i < this.length; i++) {
		if(this[i] === data) {
			return i;
		}
	}
	return false;
}

var genericCB = function(type, data, evt) {
	unsetLoading();
	var regex = new RegExp('^<!DOCTYPE html');
	if(data.match(regex)) {
		var mesg = 'A minor error has occurred. It is probably safe to ' +
		           'ignore. However, if you keep getting this message and ' +
		           'are unable to use VCL, you may contact the ' +
		           'administrators of this site for further assistance.';
		alert(mesg);
		var d = {mode: 'errorrpt',
		         data: data};
		RPCwrapper(d, function(type, data, evt) {});
		return;
	}
	eval(data);
}

var errorHandler = function(type, error, data) {
	if(args.dojoType == 'cancel')
		return;
	alert('error occurred' + error.message + data.responseText);
}

function errorHandler(data, ioArgs) {
	alert('Error encountered while processing AJAX callback');
}

function AJdojoCreate(objid) {
	if(dojo.byId(objid)) {
		dojo.parser.parse(document.getElementById(objid));
	}
}

function setLoading() {
   document.body.style.cursor = 'wait';
	if(dojo.widget.byId('workingDialog'))
		dojo.widget.byId('workingDialog').show();
}

function unsetLoading() {
	document.body.style.cursor = 'default';
	if(dojo.widget.byId('workingDialog'))
		dojo.widget.byId('workingDialog').hide();
}

function toggleRowSelect(id) {
	var row = document.getElementById(id);
	if(toggledRows[id] && toggledRows[id] == 1) {
		row.className = '';
		toggledRows[id] = 0;
	}
	else {
		row.className = 'hlrow';
		toggledRows[id] = 1;
	}
}

function toggleColSelect(id) {
	var col = document.getElementById(id);
	if(toggledCols[id] && toggledCols[id] == 1) {
		col.className = '';
		toggledCols[id] = 0;
	}
	else {
		col.className = 'hlcol';
		toggledCols[id] = 1;
	}
}

function updateMouseXY(e) {
	if(e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
	}
	else if(event) {
		mouseX = event.clientX + document.documentElement.scrollLeft;
		mouseY = event.clientY + document.documentElement.scrollTop;
	}
}

function findPosX(obj) {
	var curleft = 0;
	if(obj.offsetParent)
		while(1) {
			curleft += obj.offsetLeft;
			 if(!obj.offsetParent)
				break;
			obj = obj.offsetParent;
		}
	else if(obj.x)
		curleft += obj.x;
	return curleft;
}

function findPosY(obj) {
	var curtop = 0;
	if(obj.offsetParent)
		while(1) {
			curtop += obj.offsetTop;
			if(!obj.offsetParent)
				break;
			obj = obj.offsetParent;
		}
	else if(obj.y)
		curtop += obj.y;
	return curtop;
}

function showScriptOnly() {
	if(!document.styleSheets)
		return;
	var cssobj = new Array();
	if(document.styleSheets[0].cssRules)  // Standards Compliant
		cssobj = document.styleSheets[0].cssRules;
	else
		cssobj = document.styleSheets[0].rules;  // IE 
	var stop = 0;
	for(var i = 0; i < cssobj.length; i++) {
		if(cssobj[i].selectorText) {
			if(cssobj[i].selectorText.toLowerCase() == '.scriptonly') {
				//cssobj[i].style.display = "inline";
				cssobj[i].style.cssText = "display: inline;";
				stop++;
			}
			if(cssobj[i].selectorText.toLowerCase() == '.scriptoff') {
				cssobj[i].style.cssText = "display: none;";
				stop++;
			}
			if(stop > 1)
				return;
		}
	}
}

function showGroupInfo(data, ioArgs) {
   var members = data.items.members;
   var mx = data.items.x;
   var my = data.items.y;
   var text = "";
   for(var i = 0; i < members.length; i++) {
      text = text + members[i] + '<br>';
   }
   var obj = document.getElementById('content');
   var x = findPosX(obj);
   var y = findPosY(obj);
   obj = document.getElementById('listitems');
   obj.innerHTML = text;
   obj.style.left = mx - x - obj.clientWidth;
   obj.style.top = my - y - obj.clientWidth;
   obj.style.zIndex = 10;
}

function checkNewLocalPassword() {
	var pwd1 = document.getElementById('newpassword');
	var pwd2 = document.getElementById('confirmpassword');
	var stat = document.getElementById('pwdstatus');
	if(pwd1.value == "" && pwd2.value == "") {
		stat.innerHTML = '';
	}
	else if(pwd1.value == pwd2.value) {
		stat.innerHTML = '<font color="#008000">match</font>';
	}
	else {
		stat.innerHTML = '<font color="red">no match</font>';
	}
}
