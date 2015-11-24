var users = args.users.split(",");
var node = search.findNode(args.noderef);

node.properties["reg:assignUsers"] = users;
node.properties["reg:assignState"] = "Assegnato";
node.save();
Packages.it.formez.reg.service.AuditService.auditAssign(node.nodeRef);

model.success = true;