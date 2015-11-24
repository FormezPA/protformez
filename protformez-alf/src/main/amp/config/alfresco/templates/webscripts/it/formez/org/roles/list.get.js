var site = siteService.getSite(args.site);
var rolesContainer = site.getContainer("roles");
model.roles = rolesContainer.children;