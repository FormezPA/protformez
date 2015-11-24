/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// accept protocol assignment
	_acceptProtocol: function(el){
		var noderef = $(el).parents("li").data("noderef");
		Formez.Protocol.accept(noderef, function(res){
			if(res.success){
				Formez.poptime("Protocollo preso in carico!");
				Formez._assignedProtocols();
			} else {
				alert("Errore imprevisto");
				location.reload();
			}
		});
	},
	// reject protocol assignment
	_rejectProtocol: function(el){
		var noderef = $(el).parents("li").data("noderef");
		Formez.Protocol.reject(noderef, function(res){
			if(res.success){
				Formez.poptime("Protocollo rifiutato!");
				Formez._assignedProtocols();
			} else {
				alert("Errore imprevisto");
				location.reload();
			}
		});
	},
	// reject protocol assignment
	_completeProtocol: function(el){
		var noderef = $(el).parents("li").data("noderef");
		Formez.Protocol.complete(noderef, function(res){
			if(res.success){
				Formez.poptime("Attività legata all'assegnamento del protocollo completata!");
				Formez._assignedProtocols();
			} else {
				alert("Errore imprevisto");
				location.reload();
			}
		});
	},
	// function to get and draw protocols assigned
	_assignedProtocols: function(){
		Formez.Protocol.assignedToMe(function(res){
			var ulEl = $(".desktop-protocol");
			ulEl.empty();
			if(res.total>0){
				for(var p in res.results){
					var prot = res.results[p];
					var html = "<li class='list-group-item";
					if(prot.assign=="Assegnato"){
						html += " item-assigned";
					}
					html += "' data-noderef='"+p+"'>";
					html += "<div><b>Protocollo:</b> "+prot.protocol+"</div>";
					html += "<div><b>Data:</b> "+prot.date+"</div>";
					html += "<div><b>Oggetto:</b> "+prot.subject+"</div>";
					if(prot.document.length>0){
						html += "<div><b>Documento:</b> <a onclick='Formez.Picker.showPreview({noderef:\""+prot.document[0].noderef+"\"})'>";
						html += prot.document[0].name+"</a></div>";
					}
					var userOk = false;
					for(var u in prot.users){
						var user = prot.users[u].username;
						if(user==Formez.user.id){
							userOk = true;
							break;
						}
					}
					if(userOk){
						html += "<div class='pull-right'>";
						if(prot.assign=="Assegnato"){
							html += "<a class='btn btn-success' onclick='Formez._acceptProtocol(this);'>Prendi in carico</a> ";
							html += "<a class='btn btn-danger' onclick='Formez._rejectProtocol(this);'>Rifiuta</a>";
						} else if(prot.assign=="Preso in carico"){
							html += "<a class='btn btn-success' onclick='Formez._completeProtocol(this);'>Completato</a> ";
						}
						html += "</div>";
					}
					html += "</li>";
					ulEl.append(html);
				}
			} else {
				ulEl.append("<li class='list-group-item'>Nessun protocollo...</li>");
			}
		});
	},
	// draw tasks
	_assignedTasks: function(){
		var ulEl = $(".desktop-task");
		ulEl.empty();
		Formez.Flow.getTasks(function(tasks){
			if(tasks.length>0){
				for(var t in tasks){
					var task = tasks[t];
					ulEl.append("<li class='list-group-item'><div class='pull-right'><a href='flows?task="+task.id+"' class='btn btn-success'>Mostra</a></div>"+
						"<b>"+task.title+"</b><br/>"+task.description+"</li>");
				}
			} else {
				ulEl.append("<li class='list-group-item'>Nessun task assegnato...</li>");
			}
		});
	},
	// draw last email
	_lastEmails: function(){
		var ulEl = $(".desktop-mail");
		ulEl.empty();
		Formez.Pec.getLast(function(res){
			if(res.total>0){
				for(var e in res.emails){
					var email = res.emails[e];
					var html = "<li class='list-group-item' onclick='Formez._gotoEmails(this);' data-noderef='"+email.account+"' data-mail='"+email.noderef+"'>";
					html += "<div class='pull-right text-right'>";
					if(email.attachments){
						html += "<label class='badge'><i class='fa fa-paperclip' title='Con allegato/i'></i></label><br/>";
					}
					if(email.pec){
						html += "<label class='badge'>Pec</label><br/>";
					}
					if(email.protocol){
						html += "<label class='badge'>Protocollata</label><br/>";
					}
					html += "</div>";
					html += "<div><b>Da:</b> "+email.from.replace("<","&lt;").replace(">","&gt;")+"</div>";
					html += "<div><b>Oggetto:</b> "+email.subject+"</div>";
					html += "<div><b>Data:</b> "+email.date+"</div>";
					html += "<div class='clearfix'></div>";
					html += "</li>";
					ulEl.append(html);
				}
			} else {
				ulEl.append("<li class='list-group-item'>Nessuna email...</li>");
			}
		});
	},
	_gotoEmails: function(el){
		el = $(el);
		location.href = "mail?noderef="+el.data("noderef")+"&mail="+el.data("mail");
	}
});
	
})();
