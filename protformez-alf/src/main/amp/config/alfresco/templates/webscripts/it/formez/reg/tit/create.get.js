var parent = search.findNode(args.parent);
var name = args.name;
var type = args.type;

if(args.name && args.type){
	var folder = parent.createNode(name, type);
	Packages.it.formez.reg.service.ProtocolService.setTitolarioCounter(folder.nodeRef);
	model.success = true;
	model.folder = folder;
	// audit creation
	Packages.it.formez.reg.service.AuditService.createTit(folder.nodeRef);
} else {
	throw("Parametri non validi!");
}


