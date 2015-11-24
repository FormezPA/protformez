/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// draw all protocol in a table
	_drawProtocols: function(res){
		var table = $("#reg-list");
		table.empty();
		if(res.total>0){
			table.append("<thead><tr><th></th><th>Numero</th><th>Data</th><th>Stato</th><th>Oggetto</th><th></tr></thead>");
			var tbody = $("<tbody></tbody>");
			table.append(tbody);
			// draw every row
			for(var i in res.results){
				var row = res.results[i];
				var protNumber = row.protocol.split("-")[2];
				var rowhtml = "<tr class='reg-row";
				if(row.status=="Annullato"){
					rowhtml += " reg-row-cancel";
				}
				rowhtml += "' data-noderef='"+i+"'>";
				rowhtml += "<td class='reg-direction'>";
				var dir = "";
				var dirPerm = "";
				if(row.direction=="in"){
					dir = "left";
					dirPerm = "canProtocolCreateEnt";
				} else if(row.direction=="out"){
					dir = "right";
					dirPerm = "canProtocolCreateUsc";
				} else if(row.direction=="int"){
					dir = "down";
					dirPerm = "canProtocolCreateIn";
				}
				rowhtml += "<i class='reg-dir fa fa-arrow-circle-"+dir+"'></i>";
				rowhtml += "</td>";
				rowhtml += "<td>"+protNumber+"</td>";
				rowhtml += "<td>"+row.date+"</td>";
				rowhtml += "<td>"+row.status+"</td>";
				rowhtml += "<td>"+$("<div/>").text(row.subject).html()+"</td>";
				rowhtml += "<td class='reg-assocs'>";
				var tooltip = "";
				if(row.document.length>0){
					rowhtml += "<i class='fa fa-file-text hasdoc' data-toggle='popover' title='Documento'></i> ";
				} else {
					rowhtml += "<i class='fa fa-file-text'></i> ";
				}
				if(row.classification.length>0){
					rowhtml += "<i class='fa fa-archive hasdoc' data-toggle='popover' title='Fascicoli'></i> ";
				} else {
					rowhtml += "<i class='fa fa-archive'></i> ";
				}
				if(row.assign.length>0){
					rowhtml += "<i class='fa fa-user hasdoc' data-toggle='popover' title='Assegnamento'></i>";
				} else {
					rowhtml += "<i class='fa fa-user'></i>";
				}
				rowhtml += "</td></tr><tr data-details='"+i+"' class='hide reg-details'><td colspan='5'>";
				rowhtml += "<div class='row'>";
				// mittenti/destinatari
				rowhtml += "<div class='col-md-3'><div class='panel panel-default'>";
				// mittenti
				rowhtml += "<div class='panel-heading'>Mittenti</div><ul class='list-group'>";
				if(row.senders.length==0){
					rowhtml += "<li class='list-group-item'>Nessuno</li>";
				}
				for(var s in row.senders){
					var sender = row.senders[s];
					rowhtml += "<li class='list-group-item'>"+sender.name+"</li>";
				}
				rowhtml += "</ul>";
				// destinatari
				rowhtml += "<div class='panel-heading'>Destinatari</div><ul class='list-group'>";
				if(row.receivers.length==0){
					rowhtml += "<li class='list-group-item'>Nessuno</li>";
				}
				for(var s in row.receivers){
					var receiver = row.receivers[s];
					rowhtml += "<li class='list-group-item'>"+receiver.name+"</li>";
				}
				rowhtml += "</ul>";
				rowhtml += "</div></div>";
				// allegati
				rowhtml += "<div class='col-md-3'><div class='panel panel-default'>";
				rowhtml += "<div class='panel-heading'>Allegati</div><ul class='list-group reg-details-attachs'>";
				if(row.attachs.length==0){
					rowhtml += "<li class='list-group-item'>Nessuno</li>";
				}
				for(var s in row.attachs){
					var attach = row.attachs[s];
					rowhtml += "<li class='list-group-item' onclick='Formez.Picker.showPreview({noderef:\""+attach.noderef+"\"});'>";
					rowhtml += Formez.Docs.icon(attach.name)+attach.name+"</li>";
				}
				rowhtml += "</ul></div></div>";
				// deliverymode e note
				rowhtml += "<div class='col-md-3'><div class='panel panel-default'><div class='panel-heading'>Consegna/Recapito</div>";
				rowhtml += "<ul class='list-group'><li class='list-group-item'>"+row.deliverymode+"</li></ul>";
				rowhtml += "<div class='panel-heading'>Note</div><ul class='list-group'><li class='list-group-item'>";
				if(row.notes.length>0){
					rowhtml += row.notes+"</li></ul></div></div>";
				} else {
					rowhtml += "Nessuna Nota</li></ul></div></div>";
				}
				// protocollo mittente e protocollo emergenza
				rowhtml += "<div class='col-md-3'><div class='panel panel-default'>";
				rowhtml += "<div class='panel-heading'>Protocollo Mittente</div><ul class='list-group'>";
				rowhtml += "<li class='list-group-item'>Protocollo: "+(row.senderprot.number || "")+"</li>";
				rowhtml += "<li class='list-group-item'>Data: "+(row.senderprot.date || "")+"</li></ul>";
				rowhtml += "<div class='panel-heading'>Protocollo di Emergenza</div><ul class='list-group'>";
				rowhtml += "<li class='list-group-item'>Protocollo: "+(row.emergency.number || "")+"</li>";
				rowhtml += "<li class='list-group-item'>Data: "+(row.emergency.date || "")+"</li></ul>";
				rowhtml += "</div></div>";
				// chiudo class "row"
				rowhtml += "</div></td><td class='reg-actions-td'><ul class='reg-actions'>";
				if(row.status=="Prenotato"){
					if(Formez.user.can(dirPerm)){
						rowhtml += "<li onclick='Formez._completeProtocol();'><a><i class='fa fa-tag'></i> Completa</a></li>";
					}
				} else if(row.status!="Annullato" && Formez.user.can("canProtocolEdit")){
					if(row.document.length==0){
						rowhtml += "<li onclick='Formez._addProtocolDoc();'><a><i class='fa fa-file-text'></i> Documento</a></li>";
					}
					rowhtml += "<li onclick='Formez._addFilings();'><a><i class='fa fa-archive'></i> Classificazione</a></li>";
					rowhtml += "<li onclick='Formez._assignProtocol();'><a><i class='fa fa-user'></i> Assegna</a></li>";
				}
				if(row.status!="Annullato" && Formez.user.can("canProtocolCancel")){
					rowhtml += "<li data-toggle='popover' class='reg-delete-protocol'><a><i class='fa fa-times-circle'></i> Annulla Protocollo</a></li>";
				}
				if(Formez.user.can("canProtocolAudit")){
					rowhtml += "<li><a href='audit?noderef="+i+"'><i class='fa fa-eye'></i> Audit</a></li>";
				}
				rowhtml += "</ul>";
				if(row.status!="Annullato" && Formez.user.can("canProtocolReport")){
					rowhtml += "<i class='fa fa-download'></i> Scarica:<ul class='reg-actions'>";
					rowhtml += "<li onclick='Formez.Protocol.signature(Formez.Protocol.currentProtocol);'><a>Etichetta</a></li>";
					rowhtml += "<li onclick='Formez.Protocol.receipt(Formez.Protocol.currentProtocol);'><a>Ricevuta</a></li>";
					rowhtml += "<li onclick='Formez.Protocol.xmlSignature(Formez.Protocol.currentProtocol);'><a>XML Interoperabilità</a></li>";
				}
				rowhtml += "</ul></td></tr>";
				tbody.append(rowhtml);
			}
			// popover for document
			$("#reg-list .reg-assocs i[data-toggle='popover']").popover({
				placement: "left",
				html: true,
				container: "body",
				content: function(){
					var iEl = $(this);
					var noderef = iEl.parent().parent().data("noderef");
					var html = "";
					if(iEl.hasClass("fa-file-text")){
						var doc = Formez.Protocol.list[noderef].document[0];
						html += "<a href='#' onclick='Formez._closePopover();Formez.Picker.showPreview({noderef:\""+doc.noderef+"\"})'>";
						html += Formez.Docs.icon(doc.name)+doc.name+"</a>";
						html += "<p><br/><b>Hash SHA-256:</b><br/>"+Formez.Protocol.list[noderef].hash.match(/.{1,32}/g).join(" ")+"</p>";
					} else if(iEl.hasClass("fa-archive")){
						html += "<ul class='list-group'>";
						var classification = Formez.Protocol.list[noderef].classification;
						for(var c in classification){
							var filings = classification[c].name.split("documentLibrary/")[1].replace("'"," ").split("/");
							html += "<li class='list-group-item'>";
							for(var f in filings){
								html += "<i class='fa fa-folder-open'></i> "+filings[f]+"<br/>";
							}
							html += "</li>";
						}
						html += "</ul>";
					} else if(iEl.hasClass("fa-user")){
						html += "<b>Stato:</b> "+Formez.Protocol.list[noderef].assign+"<br/>";
						html += "<b>Utenti:</b> ";
						var users = Formez.Protocol.list[noderef].users;
						var usersA = []
						for(var u in users){
							usersA.push(users[u].name);
						}
						html += usersA.join(", ")+"<br/>";
					}
					return html;
				}
			}).on("show.bs.popover", function(){
				$(this).data("bs.popover")["$tip"].addClass("reg-details-popover");
			});
			// popover for delete protocol
			$("#reg-list .reg-details .reg-delete-protocol").popover({
				placement: "left",
				html: true,
				container: "body",
				content: function(){
					var html = "<div class='input-group'><input placeholder='Motivo...' type='text' class='form-control reg-cancel-reason' /><span class='input-group-btn'>";
					html += "<button class='btn btn-success' type='button' onclick='Formez._cancelProtocol();'>Conferma</button></span></div>";
					return html;
				}
			});
			// add listener to all rows
			$("#reg-list tbody tr.reg-row").click(function(event){
				var target = $(event.target); 
				if(target.prop("tagName").toLowerCase()=="i"){
					return;
				}
				Formez._closePopover();
				var tr = $(this);
				if(tr.hasClass("info")){
					Formez.Protocol.currentProtocol = null;
					tr.removeClass("info");
					$("tr[data-details='"+tr.data("noderef")+"']").addClass("hide");
					return;
				}
				Formez.Protocol.currentProtocol = tr.data("noderef");
				// clean class
				$("#reg-list tbody tr.reg-row").removeClass("info");
				$("#reg-list tbody tr.reg-details").addClass("hide");
				// show clicked tr (and details)
				$(this).addClass("info");
				$("tr[data-details='"+tr.data("noderef")+"']").removeClass("hide");
			});
			$(".pager").show();
		} else {
			table.append("<tr><th>Nessun protocollo</th></tr>");
			$(".pager").hide();
		}
	},
	// next page protocol,
	_nextProtocols: function(){
		var config = Formez.Protocol.lastConfig;
		config.page = Formez.Protocol.currentPage + 1;
		config.callback = function(res){
			if(res.total>0){
				Formez._drawProtocols(res);
			} else {
				Formez.Protocol.currentPage -= 1;
			}
		} 
		Formez.Protocol.get(config);
	},
	// next page protocol,
	_prevProtocols: function(){
		if(Formez.Protocol.currentPage>0){
			var config = Formez.Protocol.lastConfig;
			Formez.Protocol.currentPage -= 1;
			config.page = Formez.Protocol.currentPage;
			config.callback = Formez._drawProtocols;
			Formez.Protocol.get(config);
		}
	},
	// update current page
	_updateProtocols: function(){
		var number = $(".reg-search-number").val();
		var subject = $(".reg-search-subject").val();
		var filing = $(".reg-search-filing").val();
		var dir = $(".reg-search-dir .active");
		var stato = $(".reg-search-stato").val();
		var from = $(".reg-search-from").val();
		var to = $(".reg-search-to").val();
		Formez.Protocol.get({
			page: Formez.Protocol.currentPage,
			number: number,
			subject: subject,
			filing: filing,
			dir: (dir.length>0 ? dir.data("dir") : ""),
			stato: stato,
			from: from,
			to: to,
			callback: Formez._drawProtocols
		});
	},
	// create new protocol
	_newProtocol: function(dir, noderef){
		var html = "<form method='POST' class='hide' action='protocolla'><input type='hidden' name='type' value='"+dir+"' />";
		if(noderef){
			html += "<input type='hidden' name='number' value='"+noderef+"' />";
			var docprot = Formez.Protocol.list[noderef].document;
			if(docprot.length>0){
				html += "<input type='hidden' name='docprot' value='"+docprot[0].noderef+"' />";
			}
		}
		html += "</form>";
		$(html).appendTo($("body")).submit();
	},
	// protocol prenotation
	_protPrenotation: function(event){
		if(event!=null && event.keyCode!=13){return;}
		var val = $(".reg-prenotation-number").val();
		if($.trim(val).length>0){
			var number = parseInt(val);
			var activeDir = $(".reg-prenotation-dir .active");
			if(activeDir.length==0){
				Formez.poptime("Scegli la direzione del protocollo","warning");
				return;
			}
			var dir = activeDir.data("dir");
			if(number>1 && number<6){
				Formez.Protocol.prenotation(number, dir, function(){
					Formez._closePopover();
					Formez.alert("Prenotati "+number+" protocolli con successo!");
					Formez.Protocol.currentPage = 0;
					Formez._updateProtocols();
				});
			} else {
				Formez.poptime("Puoi prenotare da 2 a 5 protocolli","warning");
			}
		} else {
			Formez.poptime("Inserisci il numero di protocolli da prenotare...","warning");
		}
	},
	// complete protocol prenotation
	_completeProtocol: function(){
		this._newProtocol(Formez.Protocol.list[Formez.Protocol.currentProtocol].direction, Formez.Protocol.currentProtocol);
	},
	// cancel protocol
	_cancelProtocol: function(){
		var val = $(".reg-cancel-reason").val();
		if($.trim(val).length>0){
			Formez.Protocol.cancel(Formez.Protocol.currentProtocol, val, function(){
				Formez._closePopover();
				Formez.alert("Protocollo annullato con successo!");
				Formez._updateProtocols();
			});
		}
	},
	// assocs documents
	_assocsProt: function(){
		Formez._closePopover();
		Formez.Docs.getUserHome(function(item){
			Formez.Picker.scan({
				direct: true,
				destination: item.nodeRef,
				callback: function(nodes){
					var refs = [];
					for(var n in nodes){
						refs.push(nodes[n].noderef);
					}
					Formez.Protocol.assocDocs(refs, function(res){
						if(res.success){
							Formez.alert("Collegati "+res.found+" documenti su "+refs.length);
						} else {
							Formez.alert("Errore durante il tentativo di associazione", "danger");
						}
					});
				}
			});
		});
	},
	// add document to existing protocol
	_addProtocolDoc: function(){
		Formez.Picker.openDoclib({
			multiple: false,
			selectable: function(n){return !n.isContainer && n.aspects.indexOf("reg:recordable")==-1},
			upload: true,
			callback: function(nodes){
				if(nodes.length>0){
					var node = nodes[0];
					Formez.Protocol.addDoc(Formez.Protocol.currentProtocol, node.noderef, function(res){
						if(res.success){
							Formez.poptime("Documento collegato correttamente!");
							Formez._updateProtocols();
						} else {
							alert("Errore imprevisto!","danger");
							location.reload();
						}
					});
				}
			}
		});
	},
	// add filings to existing protocol
	_addFilings: function(){
		Formez.Picker.openDoclib({
			multiple: true,
			selectable: function(n){return n.type=="tit:fascicolo" && n.properties["tit:fascicoloStato"]=="Aperto"},
			upload: false,
			callback: function(nodes){
				if(nodes.length>0){
					var filings = [];
					for(var n in nodes){
						filings.push(nodes[n].noderef);
					}
					Formez.Protocol.addFiling(Formez.Protocol.currentProtocol, filings, function(res){
						if(res.success){
							Formez.poptime("Riclassificazione effettuata correttamente!");
							Formez._updateProtocols();
						} else {
							Formez.alert("Errore imprevisto!","danger");
						}
					});
				}
			}
		});
	},
	// assign protocol to one or more users
	_assignProtocol: function(){
		Formez.Picker.searchUsers({
			multiple: true,
			callback: function(users){
				if(users.length>0){
					Formez.wait("Assegnamento in corso...");
					var usersParam = [];
					for(var u in users){
						usersParam.push(users[u].username);
					}
					// call service
					Formez.Protocol.assign(Formez.Protocol.currentProtocol, usersParam.join(","), function(res){
						Formez.waitOff();
						if(res.success){
							Formez.poptime("Protocollo assegnato con successo!");
							Formez._updateProtocols();
						} else {
							alert("Errore imprevisto!");
							location.reload();
						}
					});
				}
			}
		});
	},
	// show or hide filters
	_regFilters: function(){
		var filters = $(".reg-advsearch");
		if(filters.hasClass("hide")){
			filters.removeClass("hide");
		} else {
			filters.addClass("hide");
			this._resetFilters();
		} 
	},
	// reset filters
	_resetFilters: function(){
		$(".reg-search-number").val("");
		$(".reg-search-subject").val("");
		$(".reg-search-filing").val("");
		$(".reg-search-filing").parent().find("a").html("Nessuno");
		$(".reg-search-dir .active").removeClass("active");
		$(".reg-search-stato option").first().prop("selected", true);
		$(".reg-search-from").val("");
		$(".reg-search-to").val("");
		Formez.Protocol.currentPage = 0;
		this._updateProtocols();
	},
	// select filing in filter area
	_filterFiling: function(anchor){
		Formez.Picker.openDoclib({
			multiple: false,
			selectable: function(n){return n.type=="tit:titolo"||n.type=="tit:classe"||n.type=="tit:fascicolo"},
			upload: false,
			callback: function(nodes){
				if(nodes.length>0){
					var filing = nodes[0];
					var filter = $(anchor);
					$(".reg-search-filing").val(filing.noderef);
					filter.html("<i class='fa fa-archive'></i> "+filing.name);
				}
			}
		});
	},
	// print protocol registry
	_printProtocol: function(){
		if(Formez.Protocol.lastConfig){
			Formez.Protocol.print(Formez.Protocol.lastConfig);
		}
	},
	// print daily protocol registry
	_printDailyProtocol: function(){
		var date = $('.reg-dailyregistry-cal input').val();
		if($.trim(date)==""){
			Formez.poptime("Seleziona una data!","warning");
		} else {
			var config = {}
			config.from = date;
			config.to = date;
			config.daily = true;
			Formez._closePopover();
			Formez.Protocol.print(config);
		}
	}
});
	
})();
