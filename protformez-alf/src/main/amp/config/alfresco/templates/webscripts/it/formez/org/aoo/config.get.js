if(!companyhome.hasAspect("cfg:module")){
	companyhome.addAspect("cfg:module");
}

var site = siteService.getSite(args.site);

// ldi
var types = site.node.properties["cfg:ldiTypes"] || [];
var ldiUser = site.node.properties["cfg:ldiUser"] || "";
model.ldi = site.node.properties["cfg:ldiActive"] && types.length>0 && ldiUser.length>0;
// h2h
var h2hUser = site.node.properties["cfg:h2hUser"] || "";
model.h2h = site.node.properties["cfg:h2hActive"] && h2hUser.length>0;
// pec
model.pec = 0;
var accounts = site.getContainer("pec").children;
for(var a in accounts){
	if(!accounts[a].hasAspect("sys:hidden")){
		model.pec++;
	}
}
