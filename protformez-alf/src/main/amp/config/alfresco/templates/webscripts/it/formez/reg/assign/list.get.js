var protocolContainer = siteService.getSite(args.site).getContainer("protocol");
var query = "select cmis:objectId from reg:protocol where in_tree('"+protocolContainer.nodeRef.toString()+"')";
query += " and '"+person.properties["cm:userName"]+"' = ANY reg:assignUsers and reg:assignState <> 'Completato'";
query += " order by reg:protocolNumber desc";

model.results = search.query({
	language: "cmis-alfresco",
	query: query
});