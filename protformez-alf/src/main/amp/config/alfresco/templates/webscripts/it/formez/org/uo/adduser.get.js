model.success = false;
var user = people.getPerson(args.user);
var uo = search.findNode(args.uo);
var site = siteService.getSite(uo.getSiteShortName());

if(!site.isMember(args.user)){
	site.setMembership(args.user, "SiteManager");
	uo.createAssociation(user, "org:usersAssoc");
}

model.success = true;