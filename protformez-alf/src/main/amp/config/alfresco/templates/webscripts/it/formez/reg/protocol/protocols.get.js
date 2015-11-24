// site
var site = args.site;
var protocolContainer = siteService.getSite(site).getContainer("protocol");
var perms = Packages.it.formez.formez.service.SecurityService.getPermissions(person.properties["cm:userName"], site);

if(perms["canProtocolReadEnt"] || perms["canProtocolReadUsc"] || perms["canProtocolReadIn"]){

	var query = "select cmis:objectId from reg:protocol where in_tree('"+protocolContainer.nodeRef.toString()+"')";
	
	//filters
	var state = args.state || "";
	if(state!=""){
		query += " and reg:status='"+state+"'";
	}
	
	var number = args.number || "";
	if(number!=""){
		query += " and reg:protocolNumber='*"+number+"'";
	}
	
	var subject = args.subject || "";
	if(subject!=""){
		query += " and reg:subject='*"+subject+"*'";
	}
	
	var from = args.from || "";
	if(from!=""){
		var froms = from.split("/");
		var fromParsed = froms[2] + "-" + froms[1] + "-" + froms[0];
		query += " and reg:protocolDate > TIMESTAMP '"+fromParsed+"T00:00:00.000Z'";
	}
	
	var to = args.to || "";
	if(to!=""){
		var tos = to.split("/");
		var toParsed = tos[2] + "-" + tos[1] + "-" + tos[0];
		query += " and reg:protocolDate < TIMESTAMP '"+toParsed+"T23:59:00.000Z'";
	}
	
	var dir = args.dir || "";
	if(dir!=""){
		var dirPerm = "";
		if(dir=="in"){
			dirPerm = "canProtocolReadEnt";
		} else if(dir=="out"){
			dirPerm = "canProtocolReadUsc";
		} else if(dir=="int"){
			dirPerm = "canProtocolReadIn";
		} else {
			throw("Direction not allowed!");
		}
		if(perms[dirPerm]){
			query += " and reg:directionType='"+dir+"'";
		} else {
			query += getDirectionQuery(perms);
		}
	} else {
		query += getDirectionQuery(perms);
	}
	
	query += " order by reg:protocolNumber desc";
	
	var protocols = null;
	
	// filing
	var filing = args.filing || "";
	// se devo filtrare sul fascicolo cerco l'aspect al posto dei nodi
	if(filing!=""){
		var documents = search.query({
			language: "cmis-alfresco",
			query: "select cmis:objectId from reg:recordable where in_tree('"+filing+"')",
			page: {
				maxItems: 15,
				skipCount: 15*args.page
			}
		});
		protocols = new Array();
		for(var d in documents){
			protocols.push(documents[d].assocs["reg:protocolItem"][0]);
		}
	} else {
		// altrimenti faccio la normale ricerca
		protocols = search.query({
			language: "cmis-alfresco",
			query: query,
			page: {
				maxItems: 15,
				skipCount: 15*args.page
			}
		});
	}
	
	model.results = protocols;
	model.total = protocols.length;

} else {
	
	model.results = [];
	model.total = 0;
	
}


function getDirectionQuery(perms){
	var query = " and (";
	if(perms["canProtocolReadEnt"]){
		query += "reg:directionType='in'";
	}
	if(perms["canProtocolReadUsc"]){
		if(perms["canProtocolReadEnt"]){
			query += " or";
		}
		query += " reg:directionType='out'";
	}
	if(perms["canProtocolReadIn"]){
		if(perms["canProtocolReadEnt"] || perms["canProtocolReadUsc"]){
			query += " or";
		}
		query += " reg:directionType='int'";
	}
	query += ")";
	return query;
}
