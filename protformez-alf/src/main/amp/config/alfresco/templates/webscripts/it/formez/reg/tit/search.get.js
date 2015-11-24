var ftsQuery = '((PATH:"'+search.findNode(args.rootNode).qnamePath+'//*" AND ('+args.term+'  AND (+TYPE:"cm:content" +TYPE:"cm:folder"))) ';
ftsQuery += 'AND -TYPE:"cm:thumbnail" AND -TYPE:"cm:failedThumbnail" AND -TYPE:"cm:rating") AND NOT ASPECT:"sys:hidden"';
var queryDef = {
	query: ftsQuery,
	language: "fts-alfresco",
	page: {maxItems: 250},
	defaultField: "keywords",
    onerror: "no-results",
	templates: [{
		field: "keywords",
		template: "%(cm:name cm:title cm:description ia:whatEvent ia:descriptionEvent lnk:title lnk:description TEXT TAG)"
	 }]
};
var node = search.findNode(args.rootNode);
var items = search.query(queryDef);

if (!node.isSubType("tit:baseFolder") || Packages.it.formez.formez.service.SecurityService.canSeeAllTitolario(node.siteShortName)) {
	model.items = items;
} else {
	var itemsUserCanSee = [];
	for(var i in items){
		if(Packages.it.formez.formez.service.SecurityService.canUserSeeTitolarioNode(items[i].nodeRef)){
			itemsUserCanSee.push(items[i]);
		}
	}
	model.items = itemsUserCanSee;
}
