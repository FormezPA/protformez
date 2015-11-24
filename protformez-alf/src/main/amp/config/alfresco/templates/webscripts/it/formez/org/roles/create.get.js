var rolesContainer = siteService.getSite(args.site).getContainer("roles");
var name = args.name;

var role = rolesContainer.createNode(name,"org:role");

model.role = role;