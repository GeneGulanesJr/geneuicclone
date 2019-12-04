var iisApp = angular.module("iisApp", ['ngRoute', 'angularUtils.directives.dirPagination']);
var url = "";

if(window.location.port!=""){
	url = window.location.protocol+"//"+ window.location.hostname+":8500/";
}
else{
	url = window.location.protocol+"//"+ window.location.hostname+"/";
}

if(window.location.pathname.includes("iis")){
	url = url + "iis/index.cfm";
}
else{
	url = url + "index.cfm";
}