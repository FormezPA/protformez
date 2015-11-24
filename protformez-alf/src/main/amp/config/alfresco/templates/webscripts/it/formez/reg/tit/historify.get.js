var tit = search.findNode(args.noderef);
tit.addAspect("sys:hidden");

//audit historify
Packages.it.formez.reg.service.AuditService.historify(tit.nodeRef);

model.success = true;