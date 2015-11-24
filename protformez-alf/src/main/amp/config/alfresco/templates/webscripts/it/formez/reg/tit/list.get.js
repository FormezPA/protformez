var parent = search.findNode(args.noderef);

var children = [];
if(!parent.isSubType("tit:baseFolder")){
	children = parent.children;
} else if(Packages.it.formez.formez.service.SecurityService.canSeeAllTitolario(parent.getSiteShortName())){
	children = parent.children;
} else {
	var okChildren = Packages.it.formez.formez.service.SecurityService.getChildren(parent.nodeRef);
	for(var c in okChildren){
		children.push(search.findNode(okChildren[c].toString()));
	}
}

var childrenJSON = [];
for(var c in children){
	var child = children[c];
	childrenJSON.push(appUtils.toJSON(child,true));
}

var path = parent.displayPath.split("/documentLibrary");
model.path = path.length>1 ? path[1]+"/"+parent.name : "/";
model.children = childrenJSON;
