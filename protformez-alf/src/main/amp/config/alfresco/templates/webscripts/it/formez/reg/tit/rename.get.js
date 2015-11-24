var tit = search.findNode(args.noderef);

tit.properties["cm:name"] = args.name;
tit.save();

if(tit.isContainer){
	//audit historify
	Packages.it.formez.reg.service.AuditService.rename(tit.nodeRef);
}

model.success = true;