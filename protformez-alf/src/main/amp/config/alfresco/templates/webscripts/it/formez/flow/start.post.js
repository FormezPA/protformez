var wid, noderefs, users = null;
var parameters = {}
var props = {}
for(var a in args){
	if(a=="wid"){
		wid = args[a];
	} else if(a=="bpm:package"){
		noderefs = [];
		var arg = args[a].split(";");
		for(var aa in arg){
			var noderef = arg[aa];
			if(noderef!=""){
				noderefs.push(noderef);
			}
		}
	} else if(a=="bpm:assignee"){
		parameters["bpm:assignee"] = people.getPerson(args[a]);
	} else if(a=="bpm:assignees"){
		var users = args[a];
		var usersRef = [];
		var userSplit = users.split(";");
		for(var u in userSplit){
			var user = userSplit[u];
			if(user!=""){
				usersRef.push(people.getPerson(user));
			}
		}
		parameters["bpm:assignees"] = usersRef;
	} else if(a!="alf_ticket"){
		props[a] = args[a];
	}
}

for(var p in props){
	if(p.indexOf("|")>-1){
		var value = props[p];
		var propSplit = p.split("|");
		var propName = propSplit[0].replace(" ","");
		var datatype = propSplit[1].replace(" ","");
		if(value!=null){
			if(datatype=="boolean"){
				parameters[propName] = value=="true"?true:false;
			} else if(datatype=="date"){
				if(value!=""){
					valueSplit = value.split("/");
					parameters[propName] = new Date(valueSplit[2],valueSplit[1]-1,valueSplit[0],"12","0","0");
				} else {
					parameters[propName] = null;
				}
			} else if(datatype=="number"){
				if(value!=""){
					parameters[propName] = value;
				} else {
					parameters[propName] = null;
				}
			} else {
				parameters[propName] = value;
			}
		}
	}
}

var workflowAction = workflow.getDefinitionByName(wid);
var pkg = workflow.createPackage();
for(var n in noderefs){
	pkg.addNode(search.findNode(noderefs[n]));
}
workflowAction.startWorkflow(pkg, parameters);

model.success = true;
