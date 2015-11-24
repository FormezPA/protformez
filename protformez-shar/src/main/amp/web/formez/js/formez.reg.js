/**
 * Protocol Module
 * @namespace Formez
*/
(function(){

$.extend(Formez.types, {
	// aggiungo il tipo contatto ai tipi di Formez
	"addbook:contact":{
		name: "Contatto",
		props: [
			{name:"addbook:name", type:"string",title:"Nome o Ragione Sociale",mandatory:true,form:["create","edit"]},
			{name:"addbook:address", type:"string",title:"Indirizzo",mandatory:true,form:["create","edit"]},
			{name:"addbook:city", type:"string",title:"Località",mandatory:true,form:["create","edit"]},
			{name:"addbook:cap", type:"zipcode",title:"Cap",mandatory:true,form:["create","edit"]},
			{name:"addbook:district", type:"string",title:"Provincia",mandatory:true,form:["create","edit"]},
			{name:"addbook:vatNumber", type:"string",title:"Partita IVA",help:"solo per aziende",form:["create","edit"]},
			{name:"addbook:telephone", type:"string",title:"Telefono",form:["create","edit"]},
			{name:"addbook:email", type:"string",title:"Email",check:"email",form:["create","edit"]},
			{name:"addbook:notes", type:"string",title:"Note",form:["create","edit"]}
		]
	}
});	

/**
 * @Protocol module
 */
Formez.Protocol = {
	// object with protocols nodes
	list: {},
	// current protocol
	currentProtocol: null,
	// current page
	currentPage: 0,
	// last config object for get protocol
	lastConfig: null,
	/**
	 * config object:
	 *   page: integet for paging
	 *   number: number of protocol
	 *   subject: subject of protocol
	 *	 dir: direction
	 *	 stato: state of protocol
	 *	 from: date from
	 *	 to: date to
	 *   callback (mandatory) // callback function
	 */
	get: function(config){
		this.lastConfig = config;
		var page = config.page || 0;
		this.currentPage = page;
		var url = Formez.formez_url+"reg/protocol/list?site="+Formez.site+"&page="+page;
		if(config.number!=null && config.number.length>0){
			url += "&number="+config.number;
		}
		if(config.subject!=null && config.subject.length>0){
			url += "&subject="+config.subject;
		}
		if(config.filing!=null && config.filing.length>0){
			url += "&filing="+config.filing;
		}
		if(config.dir!=null && config.dir.length>0){
			url += "&dir="+config.dir;
		}
		if(config.stato!=null && config.stato.length>0){
			url += "&state="+config.stato;
		}
		if(config.from!=null && config.from.length>0){
			url += "&from="+config.from;
		}
		if(config.to!=null && config.to.length>0){
			url += "&to="+config.to;
		}
		$.getJSON(url, function(res){
			$.extend(true, Formez.Protocol.list, res.results);
			config.callback(res);
		});
	},
	/**
	 * config object:
	 *   number: number of protocol
	 *   subject: subject of protocol
	 *	 dir: direction
	 *	 stato: state of protocol
	 *	 from: date from
	 *	 to: date to
	 */
	print: function(config){
		var url = Formez.formez_url+"reg/docs/printRegistry?site="+Formez.site;

		if(config.number!=null && config.number.length>0){
			url += "&number="+config.number;
		}
		if(config.subject!=null && config.subject.length>0){
			url += "&subject="+config.subject;
		}
		if(config.dir!=null && config.dir.length>0){
			url += "&dir="+config.dir;
		}
		if(config.stato!=null && config.stato.length>0){
			url += "&state="+config.stato;
		}
		if(config.from!=null && config.from.length>0){
			url += "&from="+config.from;
		}
		if(config.to!=null && config.to.length>0){
			url += "&to="+config.to;
		}
		if(config.daily){
			url += "&daily=true";
		}
		if(config.filing!=null && config.filing.length>0){
			url += "&filing="+config.filing;
		}
		
		window.open(url);
	},
	// create protocol
	create: function(config){
		$.ajax({
		    type: "POST",
		    url: Formez.formez_url+"reg/protocol/new",
		    data: JSON.stringify(config.data),
		    success: config.callback,
		    contentType: "application/json",
		    dataType: 'json'
		});
	},
	// add document to existing protocol
	addDoc: function(noderef, doc, callback){
		var url = Formez.formez_url+"reg/docs/add-document?noderef="+noderef+"&doc="+doc;
		$.getJSON(url, callback);
	},
	// add filing to existing protocol
	addFiling: function(protocol, noderefs, callback){
		$.ajax({
		    type: "POST",
		    url: Formez.formez_url+"reg/protocol/filings",
		    data: JSON.stringify({
		    	protocol: protocol,
		    	filings: noderefs
		    }),
		    contentType: "application/json",
		    datatype: "json",
		    success: callback
		});
	},
	// protocol prenotation
	prenotation: function(number, dir, callback){
		var url = Formez.formez_url+"reg/protocol/createMultipleProtocol?site="+Formez.site+"&number="+number+"&dir="+dir;
		$.getJSON(url, function(res){
			if(res.success){
				callback(res.items);
			}
		});
	},
	// cancel protocol
	cancel: function(noderef, reason, callback){
		$.ajax({
		    type: "POST",
		    url: Formez.formez_url+"reg/protocol/cancel-protocol",
		    data: {
		    	noderef: noderef,
		    	note: reason
		    },
		    success: callback,
		    contentType: "application/x-www-form-urlencoded"
		});
	},
	// print signature
	signature: function(noderef){
		window.open(Formez.formez_url+"reg/docs/signature?noderef="+noderef);
	},
	// print xml signature
	xmlSignature: function(noderef){
		window.open(Formez.formez_url+"reg/docs/xmlSignature?noderef="+noderef);
	},
	// print receipt
	receipt: function(noderef){
		window.open(Formez.formez_url+"reg/docs/receipt?noderef="+noderef);
	},
	// assoc docs
	assocDocs: function(noderefs, callback){
		if(noderefs==null || noderefs.length==0){
			return;
		}
		$.ajax({
		    type: "POST",
		    url: Formez.formez_url+"reg/scanner/link",
		    data: JSON.stringify({
		    	noderefs: noderefs,
		    	site: Formez.site
		    }),
		    contentType: "application/json",
		    datatype: "json",
		    success: callback
		});
	},
	// get daily registry history
	dailyHistory: function(date, callback){
		$.getJSON(Formez.formez_url+"reg/docs/dailyhistory?site="+Formez.site+"&date="+date, callback);
	},
	// get assigned to me protocol
	assignedToMe: function(callback){
		$.getJSON(Formez.formez_url+"reg/assign/list?site="+Formez.site, callback);
	},
	// assignment protocol actions
	assign: function(noderef, users, callback){
		var url = Formez.formez_url+"reg/assign/assign?noderef="+noderef+"&users="+users;
		$.getJSON(url, callback);
	},
	accept: function(noderef, callback){
		var url = Formez.formez_url+"reg/assign/step?noderef="+noderef+"&step=accept";
		$.getJSON(url, callback);
	},
	reject: function(noderef, callback){
		var url = Formez.formez_url+"reg/assign/step?noderef="+noderef+"&step=reject";
		$.getJSON(url, callback);
	},
	complete: function(noderef, callback){
		var url = Formez.formez_url+"reg/assign/step?noderef="+noderef+"&step=complete";
		$.getJSON(url, callback);
	},
	/**
	 * ADDRESS BOOK
	 */
	// list of contacts
	contacts: {},
	// current page of contacts
	contactsPage: 0,
	// get contacts folder
	getContactFolder: function(callback){
		$.getJSON(Formez.formez_url+"org/adb/path", function(res){
			callback(res.noderef);
		});
	},
	/**
	 * config
	 *	search: keyword for contacts filtering
	 *	page: page to get
	 *	callback: callback to call
	 */
	getContacts: function(config){
		var url = Formez.formez_url+"org/adb/list?page="+this.contactsPage;
		if(config.search!=null && $.trim(config.search).length>0){
			url += "&q="+config.search;
		}
		$.getJSON(url, function(res){
			$.extend(true, Formez.Protocol.contacts, res.contacts);
			config.callback(res.contacts);
		});
	},
	// delete contact
	deleteContact: function(noderef, callback){
		$.getJSON(Formez.formez_url+"org/adb/delete?noderef="+noderef, callback);
	},
	/**
	 * AUDIT
	 */
	// search audits by mode and query
	audits: function(mode, q, callback){
		$.getJSON(Formez.formez_url+"reg/audit/search?mode="+mode+"&q="+q+"&site="+Formez.site, callback);
	},
	// get specified audit for noderef
	audit: function(noderef, callback){
		$.getJSON(Formez.formez_url+"reg/audit/get?noderef="+noderef, callback);
	}
}
   
})();