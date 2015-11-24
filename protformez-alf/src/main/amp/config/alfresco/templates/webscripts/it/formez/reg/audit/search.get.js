var mode = args.mode;
var q = args.q;
var page = args.page || 0;
var site = siteService.getSite(args.site);
var query = null;

if(mode=="reg"){
	var protContainer = site.getContainer("protocol");
	query = "select cmis:objectId from reg:protocol where in_tree('"+protContainer.nodeRef.toString()+"')";
	if(q.length>0){
		query += " and (reg:protocolNumber='*"+q+"*' or reg:subject='*"+q+"*')";
	}
	query += " order by reg:protocolNumber desc";
} else if(mode=="tit"){
	var doclib = site.getContainer("documentLibrary");
	query = "select cmis:objectId from tit:baseFolder where in_tree('"+doclib.nodeRef.toString()+"')";
	if(q.length>0){
		query += " and cmis:name='*"+q+"*'";
	}
	query += " order by cmis:lastModificationDate desc";
} else {
	throw("Not valid parameters");
}

model.mode = mode;
model.audits = search.query({
	language: "cmis-alfresco",
	query: query,
	page: {
		maxItems: 8,
		skipCount: 8*page
	}
});