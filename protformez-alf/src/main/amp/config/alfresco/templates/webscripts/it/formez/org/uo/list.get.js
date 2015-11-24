var site = siteService.getSite(args.site);
var orgContainer = site.getContainer("org");

var uos = new Array();
uos.push(orgContainer);

// function to recurse uos (I cannot use search!)
var orgRecurse = function(uo){
	var children = uo.children;
	if(children && children.length>0){
		for(var c in children){
			var child = children[c];
			if(child.typeShort=="org:nodeUo"){
				uos.push(child);
				orgRecurse(child);
			}
		}
	}
}
orgRecurse(orgContainer);

model.uos = uos;
model.root = orgContainer.nodeRef.toString();
model.title = site.title;

