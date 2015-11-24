var user = args.user;
var site = args.site;
if(site==null){
	throw("Invalid parameters!");
}
var perms = null;
if(user==null){
	perms = Packages.it.formez.formez.service.SecurityService.getPermissions(site);
} else {
	perms = Packages.it.formez.formez.service.SecurityService.getPermissions(user, site);
}

model.perms = perms;