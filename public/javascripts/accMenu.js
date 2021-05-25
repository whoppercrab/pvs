//var url = require('url');
              // Accordion
function accFunction(parameter) {
    var x = document.getElementById(parameter);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

function menu(data) {
    for (var i=0;  i<data.length; i++) {
        var x = document.getElementById("pvs1Btn");
        x.innerHTML = data[i];
        x.className += " w3-show";
    }
}
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

function clicked(e) {
    return confirm(e);
}

function create_menu(location, index,list,data,obj) {
	var nav = document.getElementById("mySidebar");
	//<div class="w3-padding-64 w3-large w3-text-grey" style="font-weight:bold">==
	var div = document.getElementById("root");
	var loc_index=index;
	var loc_list=list;
	//var test=obj;
	// if (data) {
	// 	loc_index=index;
	// } else {
	// 	loc_index = false;
	// }
	var url = 'location_num=' + index.toString() + '&query=' + list;
	//new URLSearchParams({ location_num: index, query: list })

	top_1 = a_tag(location, location + "home_btn", location, true, false, location);
	top_2 = div_menu_tag(location, false, data);

	top_2_1 = a_tag("home", "home_btn", location + "_Homemenu", true, false, "Home");
	top_2_2 = div_menu_tag(location + "_Homemenu", false);
	//var url = new URLSearchParams({ location_num: index, query: test });//'location_num=' + index + '&query=' + list; //new URLSearchParams({ location_num: index, query: test }); //'location_num='+index+'&query='+list;
	top_2_2_1 = a_tag('/home/11n/?', false, false, false, url, "11n");
	top_2_2_2 = a_tag('/home/11ac/?', false, false, false, url, "11ac");
	top_2_2.appendChild(top_2_2_1);
	top_2_2.appendChild(top_2_2_2);



	top_2_3 = a_tag("Device", "Device_1btn", location + '_Device', true, false,"Device");

	top_2_4 = div_menu_tag(location + '_Device', false);
	top_2_4_1 = a_tag("11N", "11N_1btn", location + '_11N', true, false,"11N");
	top_2_4_2 = div_menu_tag(location + '_11N', false);
	top_2_4_2_1 = a_tag('/device/11n/router/?', false, false, false,url,"router");
	top_2_4_2_2 = a_tag('/ap/11n/?', false, false, false, url,"ap");
	top_2_4_2.appendChild(top_2_4_2_1);
	top_2_4_2.appendChild(top_2_4_2_2);

	top_2_4_3 = a_tag("11AC", "11AC_1btn", location + '_11AC', true, false,"11AC");
	top_2_4_4 = div_menu_tag(location + '_11AC', false);
	top_2_4_4_1 = a_tag('/device/11ac/router/?', false, false, false, url,"router");
	top_2_4_4_2 = a_tag('/ap/11ac/?', false, false, false, url,"ap");
	top_2_4_4.appendChild(top_2_4_4_1);
	top_2_4_4.appendChild(top_2_4_4_2);


	top_2_4.appendChild(top_2_4_1);
	top_2_4.appendChild(top_2_4_2);
	top_2_4.appendChild(top_2_4_3);
	top_2_4.appendChild(top_2_4_4);



	top_2_5 = a_tag("setting", "setting_1btn", location + '_setting', true, false,"Setting");

	top_2_6 = div_menu_tag(location + '_setting', false);
	top_2_6_1 = a_tag('/setting/?', false, false, false,url,"Setting");
	top_2_6_2 = a_tag("11N_setting", "11N_set_1btn", location + '_11N_set', true, false,"11N_Setting");
	top_2_6_3 = div_menu_tag(location + '_11N_set', false);
	top_2_6_3_1 = a_tag('/device/11n/router/?' , false, false, false, url,"router");
	top_2_6_3_2 = a_tag('/ap/11n/setting/?' , false, false, false, url,"ap");
	top_2_6_3.appendChild(top_2_6_3_1);
	top_2_6_3.appendChild(top_2_6_3_2);


	top_2_6_4 = a_tag("11ac_setting", "11ac_set_1btn", location + '_11ac_set', true, false,"11ac_Setting");
	top_2_6_5 = div_menu_tag(location + '_11ac_set', false);
	top_2_6_5_1 = a_tag('/device/11ac/setting/?', false, false, false,  url,"router");
	top_2_6_5_2 = a_tag('/ap/11ac/setting/?', false, false, false,  url,"ap");
	top_2_6_5.appendChild(top_2_6_5_1);
	top_2_6_5.appendChild(top_2_6_5_2);


	top_2_6.appendChild(top_2_6_1);
	top_2_6.appendChild(top_2_6_2);
	top_2_6.appendChild(top_2_6_3);
	top_2_6.appendChild(top_2_6_4);
	top_2_6.appendChild(top_2_6_5);



	top_2.appendChild(top_2_1);
	top_2.appendChild(top_2_2);
	top_2.appendChild(top_2_3);
	top_2.appendChild(top_2_4);
	top_2.appendChild(top_2_5);
	top_2.appendChild(top_2_6);


	div.appendChild(top_1);
	div.appendChild(top_2);
	
	nav.appendChild(div);

	document.body.appendChild(nav);
}


function a_tag(location_index, id, click, i,href,inner_name) {
	//<a class="w3-bar-item w3-button w3-show" id="pvs1Btn" onclick="accFunction(&quot;pvs1Menu&quot;)" href="javascript:void(0)">busan</a>
	var a = document.createElement("a");
	var a_class = document.createAttribute("class");  // class 속성 생성
	a_class.value = "w3-bar-item w3-button w3-show";

	a.setAttributeNode(a_class);
	if (id) {
		a_id = document.createAttribute("id");  // id 속성 생성
		a_id.value = id; //location  입력받아야함
		a.setAttributeNode(a_id);

	}
	if (click) {
		a_onclick = document.createAttribute("onclick");  // onclick 속성 생성
		a_onclick.value = 'accFunction("' +click.toString() + '")'; // location index 받아야함
		a.setAttributeNode(a_onclick);
	}
	a_href = document.createAttribute("href");  // href 속성 생성.
	//	a_href.value = "javascript:void(0)";
	if (href){
		a_href.value = location_index+href;
	}	else {
		a_href.value = "javascript:void(0)";
	}
	//	a_href.value =url;
	//}
	a.setAttributeNode(a_href);
	a.innerText = inner_name; // location 입력
	if (i) {
		//var tt = i_tag(i);
		var	i_tag = document.createElement("i");
		var i_class = document.createAttribute("class");
		i_class.value = "fa fa-caret-down";
		i_tag.setAttributeNode(i_class);
		a.appendChild(i_tag);
	}


	return a;

}

function div_menu_tag(location ,i,index) {
	//<div class="w3-bar-block w3-hide w3-padding-large w3-medium w3-show" id="pvs1Menu">

	var div = document.createElement("div");
	var div_class = document.createAttribute("class");
	var div_id = document.createAttribute("id");
	if(index)  {
		div_class.value = "w3-bar-block w3-hide w3-padding-large w3-medium w3-show";
	} else {
		div_class.value = "w3-bar-block w3-hide w3-padding-large w3-medium";
	}
	 
	div_id.value =location;


	div.setAttributeNode(div_class);
	div.setAttributeNode(div_id);
	if (i) {
		var tt=i_tag(i);
		// var	i_tag = document.createElement("i");
		// var i_class = document.createAttribute("class");
		// i_class.value = "fa fa-caret-down";
		// i_tag.setAttributeNode(i_class);
		div.appendChild(tt);
	}

	
	return div;

}

function i_tag(data){
	if (data) {
		var i_tag = document.createElement("i");
		var i_class = document.createAttribute("class");
		i_class.value = "fa fa-caret-down";
		i_tag.setAttributeNode(i_class);
		//a.appendChild(i_tag);
		return i_tag;
	}
}



