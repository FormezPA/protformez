/**
 * Formez @Docs Module
 * @namespace Formez.Docs
*/
(function(){
	
/**
 * @Docs module
 */
Formez.Docs = {
	// current parent
	currentParent: null,
	// current parent
	currentDoc: null,
	// root noderef for this view
	root: null,
	rootName: null,
	mode: null,
	// list of docs yet retrieved
	docs: {},
	// function to get node detail
	get: function(noderef, callback){
		$.getJSON(Formez.doclib2_url+"node/"+noderef.replace(":/",""), function(res){
			var item = res.item.node;
			if(res.item.parent){
				var parent = res.item.parent;
				item.parent = parent.nodeRef;
				if(parent.aspects.indexOf("st:siteContainer")>-1){
					parent.properties["cm:name"] = Formez.Docs.rootName;
				}
				if(Formez.Docs.docs[parent.nodeRef]){
					parent.parent = Formez.Docs.docs[parent.nodeRef].parent; 
				}
				Formez.Docs.docs[parent.nodeRef] = parent;
			}
			if(item.aspects.indexOf("st:siteContainer")>-1){
				item.properties["cm:name"] = Formez.Docs.rootName;
			}
			Formez.Docs.docs[noderef] = item;
			callback(item);
		});
	},
	// function to get children
	children: function(noderef, callback){
		$.getJSON(Formez.formez_url+"reg/tit/list?noderef="+noderef, function(res){
			// build all nodes
			var nodes = {}
			for(var i in res.items){
				var item = res.items[i].node;
				item.parent = noderef;
				item.path = res.items[i].path; 
				nodes[item.nodeRef] = item;
			}
			$.extend(true, Formez.Docs.docs, nodes);
			// call callback
			callback(nodes);
		});
	},
	// function to get parents
	parents: function(noderef, callback){
		$.getJSON(Formez.formez_url+"reg/tit/parents?noderef="+noderef, function(res){
			// build all nodes
			var nodes = {}
			for(var i in res.items){
				var item = res.items[i];
				item.parent = noderef;
				item.path = res.items[i].path; 
				nodes[item.nodeRef] = item;
			}
			$.extend(true, Formez.Docs.docs, nodes);
			// call callback
			callback(nodes);
		});
	},
	// function to get container
	getContainer: function(name, callback){
		$.getJSON(Formez.doclib_url+"container/"+Formez.site+"/"+name, function(res){
			Formez.Docs.get(res.container.nodeRef, callback);
		});
	},
	// function to get user home for this site
	getUserHome: function(callback){
		$.getJSON(Formez.formez_url+"org/users/home?site="+Formez.site, function(res){
			Formez.Docs.get(res.home, callback);
		});
	},
	// function for search in current root
	search: function(q, callback){
		$.getJSON(Formez.formez_url+"reg/tit/search?rootNode="+Formez.Docs.root+"&term="+q, callback);
	},
	// function to copy node
	copy: function(noderefs, destination, callback){
		$.ajax({
		    type: "POST",
		    url: Formez.alf_url+"slingshot/doclib/action/copy-to/node/"+destination.replace(":/",""),
		    data: JSON.stringify({nodeRefs: noderefs}),
		    success: function(res){
		    	callback(res.overallSuccess);
		    },
		    contentType: "application/json",
		    dataType: 'json'
		});
	},
	// function to copy node
	move: function(noderefs, destination, callback){
		$.ajax({
		    type: "POST",
		    url: Formez.alf_url+"slingshot/doclib/action/move-to/node/"+destination.replace(":/",""),
		    data: JSON.stringify({nodeRefs: noderefs}),
		    success: function(res){
		    	callback(res.overallSuccess);
		    },
		    contentType: "application/json",
		    dataType: 'json'
		});
	},
	// icon html
	icon: function(name){
		if(name.indexOf(".")>-1){
			var ext = name.substring(name.lastIndexOf(".")+1).toLowerCase();
			if(ext=="pdf"){
				return "<i class='fa fa-file-pdf-o'></i> ";
			} else if(ext=="png" || ext=="jpg" || ext=="jpeg" || ext=="gif" || ext=="tif" || ext=="tiff" || ext=="bmp"){
				return "<i class='fa fa-file-image-o'></i> ";
			} else if(ext=="txt"){
				return "<i class='fa fa-file-text-o'></i> ";
			} else if(ext=="xml"){
				return "<i class='fa fa-file-code-o'></i> ";
			} else if(ext=="zip"){
				return "<i class='fa fa-file-archive-o'></i> ";
			} else {
				return "<i class='fa fa-file-o'></i> ";
			}
		} else {
			return "";
		}
	},
	// object for actions
	Actions: {
		/**
		 * Actions for DOCUMENTS
		 */
		// delete document (or generic folder)
		deleteNode: function(noderef, callback){
			var doc = Formez.Docs.docs[noderef];
			if(doc.aspects.indexOf("reg:recordable")>-1){
				Formez.alert("Non puoi cancellare documenti protocollati","warning");
				return;
			}
			$.ajax({
				url: Formez.alf_url+"slingshot/doclib/action/file/node/"+noderef.replace(":/",""),
				type: "DELETE",
				success: function(res){
					if(res.overallSuccess){
						callback(true);
					} else {
						callback(false);
					}
				}
			});
		},
		// download action
		download: function(noderef){
			var name = Formez.Docs.docs[noderef].properties["cm:name"];
			var uri = Formez.alf_url+"/api/node/content/"+noderef.replace(":/","")+"/"+name+"?a=true";
			window.open(uri);
		},
		// sign action
		sign: function(noderef, callback){
			Formez.Picker.sign({
				noderefs: [noderef],
				callback: callback
			});
		},
		// topdfa action
		topdfa: function(noderef, callback){
			$.getJSON(Formez.formez_url+"sign/topdfa?noderef="+noderef, callback);
		},
		// rename actions
		rename: function(noderef, newname, callback){
			if(newname!=null && newname.length>0){
				$.ajax({
					url: Formez.formez_url+"reg/tit/rename?noderef="+noderef+"&name="+newname,
					type: "GET",
					success: function(){callback(true);},
					error: function(){callback(false);}
				});
			}
		},
		/**
		 * Actions for FOLDER
		 */
		// actions for change fascicolo state
		changeFascicoloState: function(noderef, callback){
			$.getJSON(Formez.formez_url+"reg/util/fascicoloState?noderef="+noderef, function(res){
				Formez.Docs.get(noderef, function(node){
					res.state = node.properties["tit:fascicoloStato"];
					callback(res);
				});
			});
		},
		/**
		 * actions for create folder state
		 * config: {
		 * 	parent: noderef of parent folder
		 *  name: name of new folder
		 *  callback: function to call back
		 * }
		 */
		createFolder: function(config){
			var ftype = config.type || "cm:folder";
			var url = Formez.alf_url+"api/type/"+ftype+"/formprocessor";
			var data = {
		    	alf_destination: config.parent,
		    	prop_cm_name: config.name
		    }
			for(var p in config.props){
				data["prop_"+p.replace(":","_")] = config.props[p];
			}
			$.ajax({
			    type: "POST",
			    url: url,
			    data: JSON.stringify(data),
			    success: config.callback,
			    contentType: "application/json",
			    dataType: 'json'
			});
		},
		/**
		 * actions for create folder state
		 * config: {
		 * 	parent: noderef of parent folder
		 *  name: name of new folder
		 *  type: type of new folder
		 *  callback: function to call back
		 * }
		 */
		createTitolarioFolder: function(config){
			var url = Formez.formez_url+"reg/tit/create?name="+config.name;
			url += "&type="+config.type;
			url += "&parent="+config.parent;
			$.getJSON(url, function(res){
				if(res.success){
					config.callback(res.noderef);
				} else {
					config.callback(null);
				}
			}).fail(function(){
				config.callback(null);
			});
		},
		// delete titolario folder
		deleteTitolarioFolder: function(noderef, callback){
			$.getJSON(Formez.formez_url+"reg/tit/historify?noderef="+noderef, callback);
		},
		// bootstrap titolario
		importTitolario: function(type, callback){
			$.getJSON(Formez.formez_url+"reg/util/bootstrapTitolarioData?site="+Formez.site, callback);
		}
	}
}
	
})();
