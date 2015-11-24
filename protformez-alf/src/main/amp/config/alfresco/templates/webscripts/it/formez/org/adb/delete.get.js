var node = search.findNode(args.noderef);

var mittAssocs = node.sourceAssocs["reg:sender"];
var destAssocs = node.sourceAssocs["reg:receiver"];
var protOk = false;
if(mittAssocs!=null && mittAssocs.length>0){
	protOk = true;
}
if(destAssocs!=null && destAssocs.length>0){
	protOk = true;
}

if(protOk){
	model.success = false;
	model.errormsg = "protocollo";
} else {
	node.remove();
	model.success = true;
}