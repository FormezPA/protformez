model.success = false;
var parentUO = search.findNode(args.parent);
var name = args.name;

model.newuo = parentUO.createNode(name,"org:nodeUo");

model.success = true;