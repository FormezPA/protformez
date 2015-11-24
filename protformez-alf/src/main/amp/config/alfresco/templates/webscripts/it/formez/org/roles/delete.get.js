var role = search.findNode(args.noderef);
var uos = role.sourceAssocs["org:rolesAssoc"];

if(uos!=null && uos.length>0){
	model.success = false;
} else {
	role.remove();
	model.success = true;
}
