var type, noderef, mode = null;
var props = {}
for(var a in args){
	if(a=="type"){
		type = args[a];
	} else if(a=="mode"){
		mode = args[a];
	} else if(a=="noderef"){
		noderef = args[a];
	} else {
		props[a] = args[a];
	}
}

var node = null;
if(mode=="new"){
	var name = props["cm:name"];
	if(name=="" || name==undefined){
		name=null;
	}
	node = search.findNode(noderef).createNode(name, type);
} else if(mode=="edit"){
	node = search.findNode(noderef);
} else {
	throw("mode not supported!");
}

for(var p in props){
	if(p.indexOf("|")>-1){
		var value = props[p];
		var propSplit = p.split("|");
		var propName = propSplit[0].replace(" ","");
		var datatype = propSplit[1].replace(" ","");
		if(value!=null){
			if(datatype=="boolean"){
				node.properties[propName] = value=="true"?true:false;
			} else if(datatype=="date"){
				if(value!=""){
					valueSplit = value.split("/");
					node.properties[propName] = new Date(valueSplit[2],valueSplit[1]-1,valueSplit[0],"12","0","0");
				} else {
					node.properties[propName] = null;
				}
			} else if(datatype=="number"){
				if(value!=""){
					node.properties[propName] = value;
				} else {
					node.properties[propName] = null;
				}
			} else {
				node.properties[propName] = value;
			}
		}
	}
}
node.save();
model.success = true;
model.node = node;