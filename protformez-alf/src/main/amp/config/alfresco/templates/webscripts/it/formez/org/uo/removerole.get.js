model.success = false;
var role = search.findNode(args.role);
var uo = search.findNode(args.uo);

// remove role association
uo.removeAssociation(role,"org:rolesAssoc");

model.success = true;