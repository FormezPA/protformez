/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// function to render row of doclib
	_renderRow: function(node){
		var type = "content";
		if(node.type=="tit:titolo"){
			type="titolo";
		} else if(node.type=="tit:classe"){
			type="classe";
		} else if(node.type=="tit:fascicolo"){
			type="fascicolo";
		} else if(node.type=="cm:folder"){
			type="folder";
		} else if(node.type=="cos:classe" || node.type=="cos:sez" || node.type=="cos:lotto"){
			type="cos";
		}
		var html = "<li class='list-group-item type-"+type+"' data-noderef='"+node.nodeRef+"' onclick='Formez._doclibNext(this);'>";
		if(type=="content"){
			html += Formez.Docs.icon(node.properties["cm:name"]);
		} else if(type=="cos"){
			html += "<i class='fa fa-book'></i> ";
		} else {
			html += "<i class='fa fa-folder-open'></i> ";
		}
		html += node.properties["cm:name"];
		html += "</li>";
		return html;
	},
	// function to render actions
	_renderActions: function(node){
		Formez._closePopover();
		$(".tit-actions .tit-action").addClass("hide");
		var fascicoloChiuso = false, lottoChiuso = false, parentLotto = false;
		if(node.parent!=null){
			var parent = Formez.Docs.docs[node.parent];
			if(parent.type=="tit:fascicolo" && parent.properties["tit:fascicoloStato"]=="Chiuso"){
				fascicoloChiuso = true;
			}
			if(parent.type=="cos:lotto"){
				parentLotto = true;
			}
			if(parent.type=="cos:lotto" && parent.properties["cos:lottoStatus"]=="chiuso"){
				lottoChiuso = true;
			}
		}
		var showActs = [];
		switch(node.type){
		case "pec:mailReceived":
		case "pec:mailSent":
		case "cm:content":
			showActs.push("download");
			showActs.push("preview");
			showActs.push("startwf");
			if(node.aspects.indexOf("sign:ispdfa")==-1 && node.aspects.indexOf("reg:recordable")==-1 && !fascicoloChiuso && !lottoChiuso){
				showActs.push("topdfa");
			}
			if(node.mimetype==Formez.mime.PDF && node.aspects.indexOf("sign:signed")==-1 && node.aspects.indexOf("reg:recordable")==-1 && !fascicoloChiuso && !lottoChiuso){
				showActs.push("sign");
			}
			if(node.aspects.indexOf("cos:pin")==-1){
				showActs.push("ldi");
			}
			if(node.aspects.indexOf("reg:recordable")==-1 && !fascicoloChiuso && !lottoChiuso){
				showActs.push("rename");
			}
			showActs.push("copy");
			if(node.aspects.indexOf("reg:recordable")==-1 && !fascicoloChiuso && !lottoChiuso){
				showActs.push("move");
				showActs.push("delete");
			}
			if(parentLotto && !lottoChiuso){
				showActs.push("coscount");
			}
			break;
		case "cm:folder":
			showActs.push("upload");
			showActs.push("newfolder");
			if(node.aspects.indexOf("st:siteContainer")==-1){
				showActs.push("rename");
				showActs.push("delete");
			}
			break;
		case "tit:baseFolder":
			showActs.push("newtitolo");
			showActs.push("importtit");
			break;
		case "tit:titolo":
			showActs.push("newclasse");
			if(Formez.user.can("canTitolario")){
				showActs.push("renametit");
				showActs.push("historify");
			}
			break;
		case "tit:classe":
			showActs.push("newclasse");
			showActs.push("newfascic");
			if(Formez.user.can("canTitolario")){
				showActs.push("renametit");
				showActs.push("historify");
			}
			break;
		case "tit:fascicolo":
			if(node.properties["tit:fascicoloStato"]=="Aperto"){
				if(Formez.user.can("canFascicoli")){
					showActs.push("upload");
				}
				showActs.push("newfascic");
				showActs.push("closefasc");
				if(Formez.user.can("canFascicoli")){
					showActs.push("renametit");
					showActs.push("historify");
				}
			} else {
				showActs.push("openfasc");
			}
			break;
		case "cos:base":
			showActs.push("addclasse");
			break;
		case "cos:classe":
			showActs.push("newsez");
			break;
		case "cos:sez":
			if(node.properties["cos:sezLock"]=="false"){
				showActs.push("newlotto");
			}
			showActs.push("rename");
			break;
		case "cos:lotto":
			if(node.properties["cos:lottoStatus"]=="aperto"){
				showActs.push("upload");
				showActs.push("rename");
				showActs.push("closelotto");
			}
			break;
		default:
			break;
		}
		for(var a in showActs){
			$(".tit-action.tit-action-"+showActs[a]).removeClass("hide");
		}
		if($(".tit-breadcrumb").hasClass("hide")){
			$(".tit-action.tit-action-gotonode").removeClass("hide");
		}
	},
	// function to render detail
	_renderDetail: function(node){
		var details = $(".tit-details");
		details.prev().text("Dettagli di \""+node.properties["cm:name"]+"\"");
		details.empty();
		switch(node.type){
		case "tit:titolo":
			details.append("<li class='list-group-item'>Livello titolario: <strong>Titolo</strong></li>");
			details.append("<li class='list-group-item'>Numerazione titolo: <strong>"+node.properties["tit:baseFolderNumber"]+"</strong></li>");
			break;
		case "tit:classe":
			details.append("<li class='list-group-item'>Livello titolario: <strong>Classe</strong></li>");
			details.append("<li class='list-group-item'>Numerazione classe: <strong>"+node.properties["tit:baseFolderNumber"]+"</strong></li>");
			break;
		case "tit:fascicolo":
			details.append("<li class='list-group-item'>Livello titolario: <strong>Fascicolo</strong></li>");
			details.append("<li class='list-group-item'>Numerazione fascicolo: <strong>"+node.properties["tit:baseFolderNumber"]+"</strong></li>");
			details.append("<li class='list-group-item'>Stato fascicolo: <strong>"+node.properties["tit:fascicoloStato"]+"</strong></li>");
			if(node.properties["tit:fascicoloStato"]=="Chiuso"){
				details.append("<li class='list-group-item'>Fascicolo chiuso il "+Formez.formatIsoDate(node.properties["tit:fascicoloDataChiusura"])+"</li>");
			}
			break;
		case "cm:content":
			if(node.aspects.indexOf("reg:recordable")>-1){
				details.append("<li class='list-group-item'>Protocollo: <strong>"+node.properties["reg:protocolNumberRecordable"]+"</strong></li>");
			}
			if(node.aspects.indexOf("sign:ispdfa")>-1){
				details.append("<li class='list-group-item'><i class='fa fa-file-pdf-o'></i> Documento <strong>PDF/A</strong> compliant</li>");
			}
			if(node.aspects.indexOf("sign:signed")>-1){
				details.append("<li class='list-group-item'><i class='fa fa-pencil'></i> Documento <strong>firmato</strong> digitalmente</li>");
			}
			if(node.aspects.indexOf("cos:pin")>-1){
				var html = "<li class='list-group-item'><i class='fa fa-university'></i> Una <b>copia</b> di questo documento";
				if(node.properties["cos:pinState"]=="true"){
					html += " è stato";
				} else {
					html += " è in <strong>attesa</strong> di essere";
				}
				details.append(html + " <strong>conservato</strong> su <strong>Legaldoc</strong></li>");
			}
			if(node.aspects.indexOf("cos:counter")>-1){
				var counter = node.properties["cos:counterNumber"] || "Non settato";
				details.append("<li class='list-group-item'><i class='fa fa-university'></i> Progressivo conservazione: <strong>"+counter+"</strong></li>");
			}
			details.append("<li class='list-group-item'>Dimensione: "+Formez.bytesToSize(node.size)+"</li>");
			break;
		case "cos:classe":
			var classeN = node.properties["cm:name"].replace(/[A-Z]/g, " $&");
			details.append("<li class='list-group-item'>Classe documentale:<strong>"+classeN+"</strong></li>");
			break;
		case "cos:sez":
			var classeN = Formez.Docs.docs[node.parent].properties["cm:name"].replace(/[A-Z]/g, " $&");
			details.append("<li class='list-group-item'>Classe documentale:<strong>"+classeN+"</strong></li>");
			var counter = node.properties["cos:sezCounter"] - 1;
			details.append("<li class='list-group-item'>Contatore ultimo documento congelato: <strong>"+counter+"</strong></li>");
			break;
		case "cos:lotto":
			var sezionale = Formez.Docs.docs[node.parent];
			var sezionaleN = sezionale.properties["cm:name"];
			var classeN = Formez.Docs.docs[sezionale.parent].properties["cm:name"].replace(/[A-Z]/g, " $&");
			details.append("<li class='list-group-item'>Classe documentale:<strong>"+classeN+"</strong></li>");
			details.append("<li class='list-group-item'>Sezionale: <strong>"+sezionaleN+"</strong></li>");
			if(node.properties["cos:lottoStatus"]=="chiuso"){
				details.append("<li class='list-group-item'><i class='fa fa-university'></i> Lotto <strong>chiuso</strong>, contiene i documenti dal <strong>"+
						node.properties["cos:lottoFrom"]+"</strong> al <strong>"+node.properties["cos:lottoTo"]+"</strong></li>");
			}
			break;
		default:
			break;
		}
		var li = "<li class='list-group-item'>";
		li += "Creato il "+Formez.formatIsoDate(node.properties["cm:created"])+" da "+node.properties["cm:creator"].displayName;
		li += "</li>";
		details.append(li);
		li = "<li class='list-group-item'>";
		li += "Modificato il "+Formez.formatIsoDate(node.properties["cm:modified"])+" da "+node.properties["cm:modifier"].displayName;
		li += "</li>";
		details.append(li);
	},
	// function to setup doclib
	_renderDoclib: function(nodes){
		var dl = $(".tit-doclib");
		dl.empty();
		var parent = Formez.Docs.docs[Formez.Docs.currentParent];
		dl.append("<li class='list-group-item tit-parent tit-active'>Sei in \""+parent.properties["cm:name"]+"\":</li>");
		if($.isEmptyObject(nodes)){
			dl.append("<li class='list-group-item'>Vuoto...</li>");
		} else {
			for(var n in nodes){
				nochild = false;
				var node = nodes[n];
				if(node.aspects.indexOf("sys:hidden")==-1){
					dl.append(Formez._renderRow(node));
				}
			}
		}
	},
	// function to add a level to breadcrump
	_addBread: function(node){
		var bc = $(".tit-breadcrumb");
		var type = "content";
		var icon = "folder-open";
		if(node.type=="tit:titolo"){
			type="titolo";
		} else if(node.type=="tit:classe"){
			type="classe";
		} else if(node.type=="tit:fascicolo"){
			type="fascicolo";
		} else if(node.type=="cm:folder"){
			type="folder";
		} else if(node.type=="tit:baseFolder"){
			type="folder";
			icon="archive";
		} else if(node.type=="cos:base"){
			type="folder";
			icon="university";
		} else if(node.type=="cos:classe" || node.type=="cos:sez" || node.type=="cos:lotto"){
			type="cos";
			icon="book";
		}
		var html = "<li class='list-group-item type-"+type+"' data-noderef='"+node.nodeRef+"' onclick='Formez._breadNext(this);'>";
		html += "<i class='fa fa-"+icon+"'></i> "+node.properties["cm:name"]+"</li>";
		bc.append(html);
	},
	// function for click on doclib row
	_doclibNext: function(li){
		var node = Formez.Docs.docs[$(li).data("noderef")];
		if(node.isContainer){
			Formez.Docs.currentParent = node.nodeRef;
			Formez.Docs.currentDoc = null;
			Formez._addBread(node);
			Formez.Docs.children(node.nodeRef, Formez._renderDoclib);
			Formez._renderActions(node);
			Formez._renderDetail(node);
		} else {
			Formez.Docs.currentDoc = node.nodeRef;
			var doclib = $(".tit-doclib li").removeClass("tit-active");
			$(li).addClass("tit-active");
			Formez._renderActions(node);
			Formez._renderDetail(node);
		}
	},
	// function for click on breadcrumb row
	_breadNext: function(li){
		li = $(li);
		var noderef = li.data("noderef");
		li.nextAll().remove();
		li.remove();
		Formez._doclibNext("<span data-noderef='"+noderef+"'></span>");
	},
	// function to change fascicolo state
	_fascState: function(){
		Formez.Docs.Actions.changeFascicoloState(Formez.Docs.currentParent, function(res){
			if(res.success){
				Formez.poptime("Fascicolo "+res.state.toLowerCase());
				$(".tit-breadcrumb li").last().click();
			}
		});
	},
	// function to go in specified node
	_gotoNode: function(noderef){
		if(noderef==null){
			noderef = $(".tit-doclib li.tit-active").data("noderef");
			$(".tit-breadcrumb").removeClass("hide");
		}
		var tree = [];
		var seeTree = function(ref){
			var seeTreeInternal = function(node){
				tree.push(node.nodeRef);
				if(node.aspects.indexOf("st:siteContainer")==-1){
					seeTree(node.parent);
				} else {
					// draw
					$(".tit-breadcrumb").empty();
					while(tree.length>0){
						var treeNode = Formez.Docs.docs[tree.pop()];
						var lastParent = treeNode.parent;
						// se è una cartella la aggiungo al bread
						if(treeNode.isContainer){
							Formez._addBread(treeNode);
							// se l'ultimo nodo del tree è una cartella ci clicco
							if(tree.length==0){
								Formez.Docs.currentParent = treeNode.nodeRef;
								$("li[data-noderef='"+treeNode.nodeRef+"']").click();
							}
						} else {
							// se è un documento vuol dire che sto all'ultimo nodo, e ci clicco
							Formez.Docs.currentParent = lastParent;
							Formez.Docs.children(lastParent, function(nodes){
								Formez._renderDoclib(nodes);
								$("li[data-noderef='"+treeNode.nodeRef+"']").click();									
							});
						}
					}
				}
			}
			Formez.Docs.get(ref, function(item){
				if(Formez.Docs.mode=="doclib" && !item.isContainer){
					var parent = Formez.Docs.docs[item.nodeRef];
					if(parent==null || parent.type.indexOf("tit:")==-1){
						Formez.Docs.parents(item.nodeRef, function(parents){
							for(var p in parents){
								var par = parents[p];
								if(par.type.indexOf("tit:")>-1){
									item.parent = par.nodeRef;
									break;
								}
							}
							seeTreeInternal(item);
						});
					} else {
						seeTreeInternal(item);
					}
				} else {
					seeTreeInternal(item);
				}
			});
		}
		seeTree(noderef);
	},
	// function to call when a search result clicked
	_searchSelect: function(el){
		var doclib = $(".tit-doclib li").removeClass("tit-active");
		var liEl = $(el);
		liEl.addClass("tit-active");
		var noderef = liEl.data("noderef");
		var node = Formez.Docs.docs[noderef];
		if(node==null){
			Formez.Docs.get(noderef, Formez._searchSelectRender);
		} else {
			Formez._searchSelectRender(node);
		}
	},
	_searchSelectRender: function(node){
		if(node.isContainer){
			Formez.Docs.currentParent = node.nodeRef;
			Formez.Docs.currentDoc = null;
		} else {
			Formez.Docs.currentDoc = node.nodeRef;
			Formez.Docs.currentParent = node.parent || null;
		}
		Formez._renderActions(node);
		Formez._renderDetail(node);
	},
	// function to create folder
	_folderCreate: function(){
		var name = $(".tit-create-folder").val();
		if($.trim(name).length>0){
			Formez.Docs.Actions.createFolder({
				name: name,
				parent: Formez.Docs.currentParent,
				callback: function(){
					$(".tit-create-folder").val("");
					Formez._closePopover();
					Formez.poptime("Creata nuova cartella!");
					$(".tit-breadcrumb li").last().click();
				}
			});
		}
	},
	// function to create tit folder
	_titCreate: function(classes){
		var name = $(".tit-create-tit").val();
		var type = "";
		if($.trim(name).length>0){
			if(classes.indexOf("newtitolo")>-1){
				type = "tit:titolo";
			} else if(classes.indexOf("newclasse")>-1){
				type = "tit:classe";
			} else if(classes.indexOf("newfascic")>-1){
				type = "tit:fascicolo";
			}
			Formez.Docs.Actions.createTitolarioFolder({
				name: name,
				type: type,
				parent: Formez.Docs.currentParent,
				callback: function(res){
					Formez._closePopover();
					if(res==null){
						Formez.alert("Impossibile creare la voce di titolario! Caratteri non consentiti o elemento con stesso nome...", "danger");
					} else {
						$(".tit-create-tit").val("");
						Formez.poptime("Creata nuova voce di titolario di tipo "+type.split(":")[1]+": "+name);
						$(".tit-breadcrumb li").last().click();
					}
				}
			});
		}
	},
	// function to delete doc or generic folder
	_nodeDelete: function(){
		var noderef, isDoc;
		if(Formez.Docs.currentDoc){
			noderef = Formez.Docs.currentDoc;
			isDoc = true;
		} else {
			noderef = Formez.Docs.currentParent;
			isDoc = false;
		}
		Formez.Docs.Actions.deleteNode(noderef, function(res){
			if(res){
				Formez.poptime("Cancellazione effettuata con successo!");
				if(isDoc){
					$(".tit-breadcrumb li").last().click();
				} else {
					$(".tit-breadcrumb li").last().prev().click();
				}
			} else {
				Formez.alert("Errore durante la cancellazione!","danger");
				Formez._closePopover();
			}
		});
	},
	// function to delete titolario folder
	_titDelete: function(){
		Formez.Docs.Actions.deleteTitolarioFolder(Formez.Docs.currentParent, function(res){
			if(res.success){
				Formez.poptime("Storicizzazione effettuata con successo!");
				$(".tit-breadcrumb li").last().prev().click();
			} else {
				Formez.alert("Impossibile cancellare la cartella! Forse non è vuota?","danger");
				Formez._closePopover();
			}
		});
	},
	// setup actions
	_setupActions: function(){
		// setup upload action
		if(navigator.appVersion.indexOf("MSIE 9.0")>-1 || navigator.appVersion.indexOf("MSIE 8.0")>-1){
			var buttonEl = $(".tit-actions .tit-action-upload i.fa-upload").parent();
			buttonEl.attr("onclick","");
			buttonEl.attr("data-toggle","popover");
			buttonEl.popover({
				container: "body",
				placement: "left",
				html: true,
				content: function(){
					var html = "<div class='tit-action-upload-ie'><span class='btn btn-success'>Seleziona file</span></div>";
					return html;
				}
			}).on("shown.bs.popover",function(){
				$(".tit-action-upload-ie").uploadFile({
					url: Formez.alf_url+"api/upload.html",
					multiple: true,
					fileName: "filedata",
					returnType: null,
					dragDrop: false,
					showCancel: false,
					showAbort: false,
					showDone: false,
					showError: false,
					showFileCounter: false,
					showStatusAfterSuccess: false,
					dynamicFormData: function(){
						Formez.wait("Upload in corso...");
						return {destination:Formez.Docs.currentParent,overwrite:false};
					},
					onSuccess: function(){
						Formez.waitOff();
						Formez._closePopover();
						Formez.poptime("Upload effettuato con successo");
						$(".tit-breadcrumb li").last().click();
					},
					onError: function(){
						Formez.waitOff();
						Formez._closePopover();
						Formez.alert("Errore durante l'upload del file","danger");
					}
				});
			});
		} else {
			$(".tit-action-input-ajax").uploadFile({
				url: Formez.alf_url+"api/upload",
				multiple: true,
				fileName: "filedata",
				returnType: "json",
				dragDrop: false,
				showCancel: false,
				showAbort: false,
				showDone: false,
				showError: false,
				showFileCounter: false,
				showStatusAfterSuccess: false,
				dynamicFormData: function(){
					Formez.wait("Upload in corso...");
					return {destination:Formez.Docs.currentParent,overwrite:false};
				},
				onSuccess: function(){
					Formez.waitOff();
					Formez.poptime("Upload effettuato con successo");
					$(".tit-breadcrumb li").last().click();
					// remove hidden form (bug uploader)
					$(".tit-action-input form").first().remove();
				},
				onError: function(){
					Formez.waitOff();
					Formez.alert("Errore durante l'upload del file","danger");
				}
			});
		}
		// setup popover for tit creation
		$(".tit-action-newtitolo,.tit-action-newclasse,.tit-action-newfascic").popover({
			container: "body",
			placement: "bottom",
			html: true,
			content: function(){
				var classes = $(this).prop("class");
				var html = "<div class='input-group'><input placeholder='Inserisci nome...' type='text' class='form-control tit-create-tit' /><span class='input-group-btn'>";
				html += "<button class='btn btn-success' type='button' onclick='Formez._titCreate(\""+classes+"\");'>Crea</button></span></div>";
				return html;
			}
		});
		// setup popover for tit creation
		$(".tit-action-newfolder").popover({
			container: "body",
			placement: "bottom",
			html: true,
			content: function(){
				var html = "<div class='input-group'><input placeholder='Inserisci nome...' type='text' class='form-control tit-create-folder' /><span class='input-group-btn'>";
				html += "<button class='btn btn-success' type='button' onclick='Formez._folderCreate();'>Crea</button></span></div>";
				return html;
			}
		});
		// setup popover for delete document or generic folder
		$(".tit-action-delete").popover({
			container: "body",
			placement: "bottom",
			html: true,
			content: function(){
				var html = "";
				if(Formez.Docs.currentDoc){
					html += "<b>Attenzione! Il documento verrà eliminato definitivamente!</b><br/><br/>";
				} else {
					html += "<b>Attenzione! La cartella verrà eliminata definitivamente!</b><br/><br/>";
				}
				html += "<button class='btn btn-success' onclick='Formez._nodeDelete();'>Conferma</button>";
				html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
				return html;
			}
		});
		// setup popover for delete titolario folder
		$(".tit-action-historify").popover({
			container: "body",
			placement: "bottom",
			html: true,
			content: function(){
				var html = "<b>Attenzione! La voce di titolario non sarà più visibile!</b><br/><br/>";
				html += "<button class='btn btn-success' onclick='Formez._titDelete();'>Conferma</button>";
				html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
				return html;
			}
		});
		// setup popover for rename action
		$(".tit-action-rename, .tit-action-renametit").popover({
			container: "body",
			placement: "bottom",
			html: true,
			content: function(){
				var noderef = Formez.Docs.currentDoc || Formez.Docs.currentParent;
				var oldname = Formez.Docs.docs[noderef].properties["cm:name"];
				var html = "<div class='input-group'><input placeholder='Nuovo nome...' type='text' class='form-control tit-rename' value=\""+oldname+"\" />";
				html += "<span class='input-group-btn'><button class='btn btn-success' type='button' onclick='Formez._renameDoc();'>Rinomina</button></span></div>";
				return html;
			}
		});
		$(".tit-action-startwf").popover({
			placement: "bottom",
			html: true,
			container: "body",
			title: "Scegli Processo",
			content: function(){
				var html = "<select class='form-control tit-action-startwf-flows'>";
				html += "<option value=''>Caricamento in corso...</option>";
				html += "</select><br/>";
				html += "<button class='btn btn-success' onclick='Formez._startDocFlow();'>Avvia</button>";
				html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
				Formez.Flow.getWorkflows(function(flows){
					var selectEl = $(".tit-action-startwf-flows");
					selectEl.empty();
					if(flows.length>0){
						selectEl.append("<option selected value=''>Seleziona un workflow...</option>");
						for(var f in flows){
							var flow = flows[f];
							selectEl.append("<option value='"+flow.id+"'>"+flow.title+"</option>");
						}
					} else {
						selectEl.append("<option value=''>Nessun workflow disponibile</option>");
					}
				});
				return html;
			}
		});
		// COS Section
		// setup popover for add classe
		$(".tit-action-addclasse").popover({
			placement: "bottom",
			html: true,
			container: "body",
			title: "Scegli Classe documentale",
			content: function(){
				var html = "<select class='form-control cos-classes'>";
				html += "<option value=''>Seleziona classe documentale</option>";
				for(var c in Formez.Cos.classi){
					html += "<option value='"+c+"'>"+Formez.Cos.classi[c]+"</option>";
				}
				html += "</select><br/>";
				html += "<button class='btn btn-success' onclick='Formez._addCosClasse();'>Aggiungi</button>";
				html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
				return html;
			}
		});
		// setup popover for add sezionale
		$(".tit-action-newsez").popover({
			container: "body",
			placement: "bottom",
			html: true,
			title: "Creazione Sezionale",
			content: function(){
				var html = "<div class='form-horizontal'>";
				html += "<div class='form-group'><label class='control-label col-sm-3'>Nome</label><div class='col-sm-9'>";
				html += "<input type='text' placeholder='Inserisci nome...' class='form-control input-sm tit-create-sez' /></div></div>";
				html += "<div class='form-group'><label class='control-label col-sm-3'>Numero iniziale</label><div class='col-sm-9'>";
				html += "<input type='text' placeholder='Inserisci numero iniziale...' class='form-control input-sm tit-create-sez-num' value='1' /></div></div>";
				html += "<div class='form-group'><label class='control-label col-sm-3'></label><div class='col-sm-9'>";
				html += "<button class='btn btn-success' type='button' onclick='Formez._sezCreate();'>Crea</button></div></div>";
				html += "</div>";
				return html;
			}
		});
		// setup popover for add lotto
		$(".tit-action-newlotto").popover({
			container: "body",
			placement: "bottom",
			html: true,
			title: "Creazione Lotto",
			content: function(){
				var html = "<div class='input-group'><input placeholder='Inserisci nome...' type='text' class='form-control tit-create-lotto' /><span class='input-group-btn'>";
				html += "<button class='btn btn-success' type='button' onclick='Formez._lottoCreate();'>Crea</button></span></div>";
				return html;
			}
		});
	},
	// setup scan
	_setupScan: function(){
		Formez.Picker.scan({
			destination: Formez.Docs.currentParent,
			direct: true,
			callback: function(){
				$(".tit-breadcrumb li").last().click();
			}
		});
	},
	// search full text
	_searchFts: function(isenter, event){
		if(isenter){
			if(event.keyCode!=13) return;
		}
		var q = $("#tit-fts-q").val();
		if(q==""){
			Formez.poptime("Inserisci almeno un carattere!","warning");
			return;
		}
		Formez.wait("Ricerca in corso...");
		// clean div page
		$(".tit-breadcrumb").addClass("hide");
		var details = $(".tit-details");
		details.prev().text("Dettagli");
		details.empty();
		$(".tit-actions .tit-action").addClass("hide");
		// go to search
		Formez.Docs.search(q, function(res){
			Formez.waitOff();
			var ulEl = $(".tit-doclib");
			ulEl.empty();
			ulEl.append("<li class='list-group-item tit-parent tit-active'>Risultati della ricerca:</li>");
			if(res.total==0){
				ulEl.append("<li class='list-group-item'>Nessun risultato...</li>");
			} else {
				for(var i in res.items){
					var item = res.items[i];
					var type = "content";
					if(item.isContainer){
						type="folder";
					}
					var html = "<li class='list-group-item type-"+type+"' data-noderef='"+item.nodeRef+"' onclick='Formez._searchSelect(this);'>";
					if(type=="content"){
						html += Formez.Docs.icon(item.name);
					} else {
						html += "<i class='fa fa-folder-open'></i> ";
					}
					html += item.name;
					html += "</li>";
					ulEl.append(html);
				}
			}
		});
	},
	// reset search
	_resetSearch: function(){
		$('#tit-fts-q').val('');
		$(".tit-breadcrumb").removeClass("hide");
		Formez._gotoNode(Formez.Docs.currentParent);
	},
	// import titolario
	_titImport: function(){
		if($(".tit-doclib > li").length<3){
			Formez.wait("Importazione del titolario in corso...");
			Formez.Docs.Actions.importTitolario(null, function(res){
				if(res.success){
					$(".tit-breadcrumb li").last().click();
					Formez.poptime("Titolario importato con successo!");
				} else {
					alert("Errore imprevisto!");
					location.reload();
				}
				Formez.waitOff();
			});
		} else {
			Formez.poptime("Hai già importato un titolario!", "warning");
		}
	},
	// function for sign doc
	_signDoc: function(){
		Formez.Docs.Actions.sign(Formez.Docs.currentDoc, function(){
			$(".tit-breadcrumb li").last().click();
		});
	},
	// function for add doc to conservazione tail
	_conservaDocLdi: function(){
		Formez.Ldi.add(Formez.Docs.currentDoc, function(res){
			if(res.success){
				Formez.poptime("Documento aggiunto con successo!");
				$(".tit-breadcrumb li").last().click();
			} else {
				Formez.alert(res.message, "warning");
			}
		});
	},
	// function to rename doc
	_renameDoc: function(){
		Formez.Docs.Actions.rename(Formez.Docs.currentDoc || Formez.Docs.currentParent, $(".tit-rename").val(), function(success){
			if(success){
				Formez._closePopover();
				if(Formez.Docs.currentDoc){
					$(".tit-breadcrumb li").last().click();
				} else {
					$(".tit-breadcrumb li").last().prev().click();
				}
			} else {
				Formez.alert("Impossibile rinominare! Caratteri non consentiti o elemento con lo stesso nome...", "danger");
			}
		});
	},
	// show preview of a doc
	_showDoc: function(){
		Formez.Picker.showPreview({
			noderef: Formez.Docs.currentDoc
		});
	},
	// convert pdf to pdfa
	_nodeToPdfa: function(){
		Formez.wait("Operazione in corso...");
		Formez.Docs.Actions.topdfa(Formez.Docs.currentDoc, function(res){
			$(".tit-breadcrumb li").last().click();
			Formez.waitOff();
			if(res.success){
				Formez.poptime("File convertito in PDF/A!");
			} else {
				Formez.alert("Impossibile convertire questo file in PDF/A", "warning");
			}
		});
	},
	// copy node
	_copyNode: function(){
		Formez.Picker.openDoclib({
			multiple: false,
			selectable: function(n){return (n.type=="tit:fascicolo" && n.properties["tit:fascicoloStato"]=="Aperto") || n.type=="cm:folder" || n.type=="cos:lotto"},
			upload: false,
			callback: function(nodes){
				if(nodes.length>0){
					var node = nodes[0];
					Formez.Docs.copy([Formez.Docs.currentDoc], node.noderef, function(success){
						if(success){
							$(".tit-breadcrumb li").last().click();
							Formez.poptime("Documento copiato con successo!");
						} else {
							alert("Errore imprevisto!");
							location.reload();
						}
					});
				}
			}
		});
	},
	// move node
	_moveNode: function(){
		Formez.Picker.openDoclib({
			multiple: false,
			selectable: function(n){return (n.type=="tit:fascicolo" && n.properties["tit:fascicoloStato"]=="Aperto") || n.type=="cm:folder" || n.type=="cos:lotto"},
			upload: false,
			callback: function(nodes){
				if(nodes.length>0){
					var node = nodes[0];
					Formez.Docs.move([Formez.Docs.currentDoc], node.noderef, function(success){
						if(success){
							$(".tit-breadcrumb li").last().click();
							Formez.poptime("Documento spostato con successo!");
						} else {
							alert("Errore imprevisto!");
							location.reload();
						}
					});
				}
			}
		});
	},
	_startDocFlow: function(){
		var wf = $(".tit-action-startwf-flows").val();
		if(wf.length>0){
			location.href="flows?flow="+wf+"&noderef="+Formez.Docs.currentDoc;
		} else {
			Formez.poptime("Seleziona un processo...", "warning");
		}
	},
	// COS Section
	_cosMode: false,
	// function to add classe for COS
	_addCosClasse: function(){
		var classe = $(".cos-classes").val();
		Formez._closePopover();
		if(classe!=null && classe!=""){
			Formez.Cos.addClasse(classe, Formez.Cos.classi[classe], function(res){
				if(res.success){
					Formez.poptime("Classe aggiunta con successo");
					$(".tit-breadcrumb li").last().click();
				} else {
					Formez.alert(res.message, "warning");
				}
			});
		}
	},
	// function to create sezionale for COS
	_sezCreate: function(){
		var name = $(".tit-create-sez").val();
		if($.trim(name).length>0){
			var initValue = $(".tit-create-sez-num").val();
			if(initValue.length>0 && $.isNumeric(initValue)){
				Formez.Docs.Actions.createFolder({
					type: "cos:sez",
					name: name,
					props: {
						"cos:sezCounter": initValue
					},
					parent: Formez.Docs.currentParent,
					callback: function(){
						$(".tit-create-sez").val("");
						Formez._closePopover();
						Formez.poptime("Creato nuovo sezionale!");
						$(".tit-breadcrumb li").last().click();
					}
				});
			} else {
				Formez.poptime("Valore iniziale non valido!","warning");
			}
		} else {
			Formez.poptime("Inserisci il nome!","warning");
		}
	},
	// function to create sezionale for COS
	_lottoCreate: function(){
		var name = $(".tit-create-lotto").val();
		if($.trim(name).length>0){
			Formez._closePopover();
			Formez.wait("Operazione in corso...");
			Formez.Docs.Actions.createFolder({
				type: "cos:lotto",
				name: name,
				parent: Formez.Docs.currentParent,
				callback: function(){
					Formez.Cos.lockSez(Formez.Docs.currentParent, function(){
						Formez.Docs.get(Formez.Docs.currentParent, function(){
							Formez.waitOff();
							$(".tit-create-lotto").val("");
							Formez.poptime("Creato nuovo lotto!");
							$(".tit-breadcrumb li").last().click();
						});
					});
				}
			});
		} else {
			Formez.poptime("Inserisci il nome!","warning");
		}
	},
	// function to close lotto for COS
	_closeLotto: function(){
		Formez.wait("Operazione in corso...");
		Formez.Docs.children(Formez.Docs.currentParent, function(nodes){
			// to sign
			if($.isEmptyObject(nodes)){
				Formez.waitOff();
				Formez.poptime("Lotto vuoto!","warning");
				return;
			} else {
				var toSign = new Array();
				for(var n in nodes){
					var node = nodes[n];
					if(node.aspects.indexOf("sign:signed")==-1 && node.properties["cm:name"].split(".").pop()!="p7m"){
						toSign.push(n);
					}
				}
				if(toSign.length>0){
					Formez.waitOff();
					Formez.alert("Alcuni documenti non sono firmati!", "warning");
				} else {
					Formez.Cos.closeLotto(Formez.Docs.currentParent, function(res){
						Formez.waitOff();
						if(res.success){
							Formez.poptime("Lotto chiuso con successo!");
							$(".tit-breadcrumb li").last().prev().click();
						} else {
							if(res.message=="zero"){
								Formez.alert("Nessun documento presente nel lotto!","warning");
							} else if(res.message=="disorder"){
								Formez.alert("La numerazione progressiva dei documenti all'interno del lotto non è corretta!","warning");
							}
						}
					});
				}
			}
		});
	},
	// function to set cos counter
	_setCosCounter: function(){
		var node = Formez.Docs.docs[Formez.Docs.currentDoc];
		if(node.aspects.indexOf("cos:counter")==-1){
			// add aspect
			Formez.Cos.addCounter(node.nodeRef, function(){
				Formez._setCosCounter();
			});
		} else {
			// open form
			Formez.Picker.getForm({
			    type:"cos:counter",
			    mode:"edit",
			    form:"edit",
			    noderef:node.nodeRef,
			    callback:function(){
			    	$(".tit-breadcrumb li").last().click();
			    }
			});
		}
	}
});
	
})();
