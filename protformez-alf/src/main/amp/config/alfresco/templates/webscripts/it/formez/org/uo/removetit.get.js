model.success = false;
var tit = search.findNode(args.tit);
var uo = search.findNode(args.uo);

// remove role association
uo.removeAssociation(tit,"org:titAssoc");

model.success = true;