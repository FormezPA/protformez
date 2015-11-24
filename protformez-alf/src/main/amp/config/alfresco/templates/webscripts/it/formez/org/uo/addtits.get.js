model.success = false;
var tits = args.tits.split(",");
var uo = search.findNode(args.uo);

for(var t in tits){
	var tit = search.findNode(tits[t]);
	
	//check if exists
	var assocs = uo.assocs["org:titAssoc"];
	var canAdd = true;
	for(var a in assocs){
		if(assocs[a].nodeRef.toString()==tits[t]){
			canAdd = false;
			break;
		}
	}

	if(canAdd){
		uo.createAssociation(tit, "org:titAssoc");
	}
}

model.success = true;