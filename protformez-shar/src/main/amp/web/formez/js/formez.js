/**
 * Formez generic Module
 * @namespace Formez
*/

(function(){
	
Formez = {
	// constants
	alf_url: "/share/proxy/alfresco/",
	formez_url: "/share/proxy/alfresco/formez/",
	doclib_url: "/share/proxy/alfresco/slingshot/doclib/",
	doclib2_url: "/share/proxy/alfresco/slingshot/doclib2/",
	page: null,
	site: null,
	title: null,
	node: null,
	// user id and permissions
	user: {
		id: null,
		permissions: null,
		can: function(perm){
			return this.permissions[perm];
		}
	},
	// cfg object
	cfg: null,
	// mimetypes
	mime: {
		// immagini
		JPG:"image/jpeg",JPEG:"image/jpeg",
		GIF:"image/gif",
		TIF:"image/tiff",TIFF:"image/tiff",
		PNG:"image/png",
		BMP:"image/bmp",
		// documenti
		TXT:"text/plain",TEXT:"text/plain",
		XML:"text/xml",
		PDF:"application/pdf",
		// altri
		PKCS7:"application/pkcs7",
		ZIP:"application/zip"
	},
	// show or hide a link to alfresco share
	enableShare: false, 
	// docs and folder types
	/**
	 * properties structure:
	 * 	name: qname of properties
	 * 	type: type of properties (string, number, boolean, date, password)
	 * 	title: display name of properties
	 * 	mandatory: boolean for mandatory
	 * 	range: range for number properties
	 * 	check: specified check (email)
	 * 	form: form where properties is visible (create, edit, or custom name form)
	 */
	types: {},
	// function for alert
	alert: function(message, type){
		var popup = $("#formez_popup");
		popup.empty();
		var html = "<div class='alert alert-"+(type||"success")+"'><h4>"+message+"</h4><br/>";
		html += "<button class='btn btn-"+(type||"success")+" formez_popup_close'>Ok</button></div>";
		popup.html(html);
		popup.popup("show");
	},
	// function for alert with time
	poptimeI: null,
	poptime: function(message, type){
		window.clearTimeout(Formez.poptimeI);
		var popup = $("#formez_poptime");
		popup.empty();
		var html = "<div class='alert alert-"+(type||"success")+"'><h4>"+message+"</h4></div>";
		popup.html(html);
		popup.popup("show");
		Formez.poptimeI = setTimeout(function(){
			$("#formez_poptime").popup("hide");
		}, 2000);
	},
	// function for start wait
	wait: function(message){
		var popup = $("#formez_wait");
		popup.empty();
		var html = "<div class='alert alert-success alert-wait'><h4><i class='fa fa-spinner fa-spin'></i><br/><br/>"+message+"</h4></div>";
		popup.html(html);
		popup.popup("show");
	},
	// function for stop wait
	waitOff: function(){
		$("#formez_wait").popup("hide");
	},
	// function for format iso date (like 2014-01-07T09:52:36.830Z )
	formatIsoDate: function(isodate){
		var dt = isodate.iso8601.split("T");
		var year = dt[0].split("-")
		var milli = isodate.value.split(" ")[3];
		var hour = milli.split(":");
		//var date = new Date(year[0], year[1]-1, year[2], hour[0], hour[1], hour[2], 0);
		return year[2]+"/"+year[1]+"/"+year[0]+" "+hour[0]+":"+hour[1];
	},
	// function for format bytes size
	bytesToSize: function(bytes){
		if(bytes <= 0) return '0 Byte';
		var k = 1024;
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		var i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	},	
	// like formatIsoDate
	formatIsoDateWithoutHour: function(isodate){
		var dt = isodate.iso8601.split("T");
		var year = dt[0].split("-")

		return year[2]+"/"+year[1]+"/"+year[0];
	},
	// function for wrapper width
	wrapperResizer: function(){
		var wrapper = $('#wrapper');
		if(wrapper.hasClass('sidebar-mini')){
			wrapper.removeClass('sidebar-mini');
			wrapper.find(".main-menu li a span.pull-right-backup").removeClass("pull-right-backup").addClass("pull-right");
			$(".main-menu a[href='cos']").html("<i class='fa fa-university'></i> Conservazione");
			$(".main-menu a[href='org']").html("<i class='fa fa-sitemap'></i> Organigramma");
			sessionStorage.setItem("mopen", true);
		} else {
			wrapper.addClass('sidebar-mini');
			wrapper.find(".main-menu li a span.pull-right").removeClass("pull-right").addClass("pull-right-backup");
			$(".main-menu a[href='cos']").html("<i class='fa fa-university'></i> Conserv...");
			$(".main-menu a[href='org']").html("<i class='fa fa-sitemap'></i> Organig...");
			sessionStorage.setItem("mopen", false);
		}
	}
}
	
})();

// javascript gestione moduli, commentato per non essere visibile in produzione
// eseguire nella home di mDM
/*
	Formez.types["cfg:module"] = {
		name: "Moduli",
		props: [
			{name:"cfg:modulePec",type:"boolean",title:"Pec",form:["edit"]},
			{name:"cfg:moduleCos",type:"boolean",title:"Cos",form:["edit"]},
			{name:"cfg:moduleFlow",type:"boolean",title:"Flow",form:["edit"]},
			{name:"cfg:moduleInv",type:"boolean",title:"Invoice",form:["edit"]},
			{name:"cfg:moduleLdi",type:"boolean",title:"Legaldoc",form:["edit"]},
			{name:"cfg:moduleH2h",type:"boolean",title:"H2H",form:["edit"]}
		]
	}
	Formez.Org.getAoos(function(aoos){
		for(var a in aoos){
			$.getJSON("/share/page/formez/cfgcleaner?site="+aoos[a].shortName);
		}
	});
	Formez.Picker.getForm({
		type:"cfg:module",
		mode:"edit",
		form:"edit",
		noderef:Formez.Org.gov.noderef,
		callback:function(){
			alert("ok");
			location.reload();
		}
	});
*/
