var container = siteService.getSite(args.site).getContainer("daily");
var dates = args.date.split("/");
var name = dates[2]+"-"+dates[1]+"-"+dates[0];

var query = "select cmis:objectId from cmis:document where in_tree('"+container.nodeRef.toString()+"')";
query += " and cmis:name='"+name+"*' order by cmis:creationDate desc";

model.docs = search.query({
	language: "cmis-alfresco",
	query: query
});
