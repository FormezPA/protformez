model.success = false;
var uo = search.findNode(args.uo);
var inherit = args.inherit;

uo.properties["org:nodeUoInherit"] = inherit;
uo.save();

model.success = true;