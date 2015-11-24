// keyword
var q = args.q || "";
var page = args.page || 0;
var contacts = null;
if(q.length>0){
	contacts = search.query({
		query: '+TYPE:"addbook:contact" +(@addbook\\:name:"*'+q+'*" OR @addbook\\:email:"*'+q+'*")',
		language: 'lucene',
		sort: [{
			column: "cm:created"
		}],
		page: {
			maxItems: 15,
			skipCount: 0*page
		}
	});
} else {
	var contacts = search.query({
		language: "db-cmis",
		query: "select cmis:objectId from addbook:contact order by cmis:lastModificationDate desc",
		page: {
			maxItems: 15,
			skipCount: 0*page
		}
	});
}

model.contacts = contacts;
