var node = search.findNode(args.noderef);

var parents = [];

parents = node.parents;
var parentsJSON = [];
for(var c in parents){
	var parent = parents[c];
	parentsJSON.push(appUtils.toJSON(parent,true));
}

model.parents = parentsJSON;
