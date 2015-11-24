var step = args.step;
var node = search.findNode(args.noderef);
var user = person.properties["cm:userName"];

if(step=="accept"){
	node.properties["reg:assignUsers"] = [user];
	node.properties["reg:assignState"] = "Preso in carico";
} else if(step=="reject"){
	var oldUser = node.properties["reg:assignUsers"];
	if(oldUser.length>1){
		// remove only the rejecter user
		oldUser.splice(oldUser.indexOf(user), 1);
		node.properties["reg:assignUsers"] = oldUser;
	} else {
		// reject totally
		node.properties["reg:assignUsers"] = null;
		node.properties["reg:assignState"] = null;
	}
} else if(step=="complete"){
	node.properties["reg:assignState"] = "Completato";
}

node.save();
Packages.it.formez.reg.service.AuditService.auditStepAssign(node.nodeRef, step);

model.success = true;