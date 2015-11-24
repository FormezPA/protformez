var homes = siteService.getSite(args.site).getContainer("homes");
var user = person.properties["cm:userName"];
var home = homes.childByNamePath(user);
if(home==null){
	home = homes.createFolder(user);
	home.addAspect("st:siteContainer");
}

model.home = home;