model.success = false;
var user = people.getPerson(args.user);
var uo = search.findNode(args.uo);
var site = siteService.getSite(uo.getSiteShortName());

uo.removeAssociation(user, "org:usersAssoc");
site.removeMembership(args.user);

model.success = true;