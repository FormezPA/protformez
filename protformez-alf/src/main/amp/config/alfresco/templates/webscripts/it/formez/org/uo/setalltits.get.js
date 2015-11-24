model.success = false;
var uo = search.findNode(args.uo);
var alltits = args.alltits;

uo.properties["org:nodeUoAlltits"] = alltits;
uo.save();

if(alltits=="true"){
	var tits = uo.assocs["org:titAssoc"];
	if(tits!=null && tits.length>0){
		for(var t in tits){
			var tit = tits[t];
			uo.removeAssociation(tit, "org:titAssoc");
		}
	}
}

model.success = true;