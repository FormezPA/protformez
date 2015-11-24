model.success = false;
var role = search.findNode(args.role);
var uo = search.findNode(args.uo);

//check if exists
var assocs = uo.assocs["org:rolesAssoc"];
var canAdd = true;
for(var a in assocs){
	if(assocs[a].nodeRef.toString()==args.role){
		canAdd = false;
		break;
	}
}

if(canAdd){
	uo.createAssociation(role, "org:rolesAssoc");
}

model.success = true;