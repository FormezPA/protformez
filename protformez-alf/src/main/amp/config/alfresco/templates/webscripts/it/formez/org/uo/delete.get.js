model.success = false;
var uo = search.findNode(args.uo);

var children = uo.children;
var user = uo.assocs["org:usersAssoc"];
if(uo.children!=null && uo.children.length>0){
	model.errormsg = "Non puoi eliminare Unità Organizzative che ne contengono delle altre!";
} else if(user!=null && user.length>0){
	model.errormsg = "Non puoi eliminare Unità Organizzative a cui sono associati utenti!";
} else if(uo.hasAspect("st:siteContainer")){
	model.errormsg = "Non puoi eliminare l'Unità Organizzativa principale!";
} else {
	uo.remove();
	model.success = true;
}