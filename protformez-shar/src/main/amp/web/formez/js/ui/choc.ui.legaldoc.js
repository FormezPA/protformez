/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// current cos page
	_cosPage: 0,
	// draw list wait
	_drawCosWait: function(){
		var ulEl = $("ul.ldi-listwait");
		ulEl.empty();
		Formez.Ldi.docsWait = {}
		Formez.Ldi.listWait(function(docs, types){
			for(var d in docs){
				var doc = docs[d];
				Formez.Ldi.docsWait[doc.noderef] = doc;
				var html = "<li class='list-group-item' data-noderef='"+doc.noderef+"'>";
				html += "<span><a class='ldi-list-name' onclick='Formez.Picker.showPreview({noderef:\""+doc.noderef+"\"});'>";
				html += Formez.Docs.icon(doc.name)+doc.name+"</a></span>";
				html += "<a class='pull-right btn btn-xs btn-danger ldi-doc-remove' data-toggle='popover'><i class='fa fa-times'></i></a>";
				if(doc.type!=""){
					html += "<a class='pull-right btn btn-xs btn-default' onclick='Formez._editCosType(\""+doc.noderef+"\");'><i class='fa fa-edit'></i></a>";
				}
				html += "<a class='pull-right btn btn-xs btn-default ldi-doc-type"+(doc.type==""?" ldi-nottype":"")+"' data-toggle='popover'>";
				html += "<i class='fa fa-clipboard'></i>";
				if(doc.type!=""){
					html += " <span>"+Formez.types[doc.type].name+"</span>";
				} else {
					html += " <span>Nessun tipo</span>";
				}
				html += "</a></li>";
				ulEl.append(html);
			}
			if(ulEl.find("li").length==0){
				ulEl.append("<li class='list-group-item'>Nessun documento...</li>");
			}
			$(".ldi-doc-type").popover({
				placement: "right",
				html: true,
				container: "body",
				content: function(){
					var liEl = $(this).parents("li[data-noderef]");
					var noderef = liEl.data("noderef");
					var type = Formez.Ldi.docsWait[noderef].type;
					var html = "";
					if(type!=""){
						html += "<b>Modifica il tipo di documento</b><br/>";
					} else {
						html += "<b>Scegli il tipo di documento</b><br/>";
					}
					html += "<div class='input-group ldi-doc-change-div'><select data-noderef='"+noderef+"' class='form-control ldi-doc-change'>";
					for(var t in types){
						var lditype = types[t];
						if(type!=lditype){
							html += "<option value='"+lditype+"'>"+Formez.types[lditype].name+"</option>";
						}
					}
					html += "</select><span class='input-group-btn'><button onclick='Formez._specializeCos(\""+noderef+"\");' class='btn btn-success'>";
					html += "<i class='fa fa-clipboard'></i> Conferma</button></span></div>";
					return html;
				}
			});
			$(".ldi-doc-remove").popover({
				placement: "right",
				html: true,
				container: "body",
				content: function(){
					var noderef = $(this).parents("li[data-noderef]").data("noderef");
					var html = "<button data-remove='"+noderef+"' class='btn btn-success' onclick='Formez._removeFromCos(this);'>Rimuovi</button>";
					html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
					return html;
				}
			});
		});
	},
	// draw cos list
	_drawCosList: function(){
		var ulEl = $("ul.ldi-list");
		ulEl.empty();
		var from = $(".ldi-list-date-from").val();
		var to = $(".ldi-list-date-to").val();
		Formez.Ldi.list({
			page: this._cosPage,
			from: from.length>0 ? from : null,
			to: to.length>0 ? to : null,
			callback: function(docs){
				for(var d in docs){
					var doc = docs[d];
					Formez.Ldi.docs[doc.noderef] = doc;
					var html = "<li class='list-group-item' data-noderef='"+doc.noderef+"'>";
					html += "<span><a onclick='Formez.Picker.showPreview({noderef:\""+doc.noderef+"\"});'>"+Formez.Docs.icon(doc.name)+doc.name+"</a></span>";
					// badge data conservazione
					html += "<span class='pull-right ldi-list-date'>Conservato il: <b>"+doc.date+"</b></span>";
					// esibizione server infocert
					html += "<span class='pull-right ldi-list-down'><a onclick='Formez.Ldi.exhibition(\""+doc.noderef+"\")'>";
					html += "<i class='fa fa-download'></i></a></span>";
					// badge tipo documento
					html += "<span class='pull-right badge ldi-list-type'>"+Formez.types[doc.type].name+"</span>";
					html += "</li>";
					ulEl.append(html);
				}
				var liLength = ulEl.find("li").length;
				// se questa pagina non ha risultati torno indietro
				if(liLength==0 && Formez._cosPage>0){
					Formez._prevCos();
				} else if(liLength==0){
					ulEl.append("<li class='list-group-item'>Nessun elemento...</li>");
				}
			}
		});
	},
	// draw cos list (prev page)
	_prevCos: function(){
		if(this._cosPage==0){
			return;
		} else {
			this._cosPage--;
			this._drawCosList();
		}
	},
	// draw cos list (next page)
	_nextCos: function(){
		this._cosPage++;
		this._drawCosList();
	},
	// add docs to cos from cos page
	_addCosDocs: function(){
		Formez.Picker.openDoclib({
			multiple: false,
			selectable: function(n){return !n.isContainer && n.aspects.indexOf("ldi:fileProLdoc")==-1},
			upload: true,
			callback: function(nodes){
				if(nodes.length>0){
					var node = nodes[0];
					Formez.Ldi.add(node.noderef, function(res){
						if(res.success){
							Formez.poptime("Documento aggiunto con successo!");
							Formez._drawCosWait();
						} else {
							Formez.alert(res.message, "warning");
						}
					});
				}
			}
		});
	},
	// choose type for cos
	_specializeCos: function(noderef){
		var selectEl = $("select[data-noderef='"+noderef+"']");
		var type = selectEl.val();
		var oldType = Formez.Ldi.docsWait[noderef].type;
		if(oldType==""){
			oldType==null;
		}
		Formez.Ldi.specialize(noderef, type, oldType, function(res){
			Formez.poptime("Tipo del documento modificato con successo!");
			Formez._drawCosWait();
		});
		Formez._closePopover();
	},
	// edit type for cos
	_editCosType: function(noderef){
		Formez.Picker.getForm({
		    type:Formez.Ldi.docsWait[noderef].type,
		    mode:"edit",
		    form:"edit",
		    noderef:noderef,
		    callback:function(){}
		});
	},
	// remove from cos
	_removeFromCos: function(el){
		var noderef = $(el).data("remove");
		Formez.Ldi.remove(noderef, function(res){
			if(res.success){
				Formez._closePopover();
				Formez.poptime("Documento rimosso dalla lista di conservazione!");
				Formez._drawCosWait();
			}
		});
	},
	// function to start cos
	_goCos: function(){
		var noderefs = new Array();
		// check type for all
		for(var d in Formez.Ldi.docsWait){
			noderefs.push(d);
			var doc = Formez.Ldi.docsWait[d];
			if(doc.type==""){
				Formez.poptime("Tutti i documenti devono essere associati ad un tipo!");
				return;
			}
		}
		if(noderefs.length==0){
			Formez.poptime("Nessun documento da conservare!", "warning");
			return;
		}
		Formez.wait("Conservazione dei documenti in corso... Attendere...");
		// if all ok, conserva!
		Formez.Ldi.conserva(noderefs, function(res){
			if(res.success){
				var ok = 0, ko = 0, errors = "<br/>";
				for(var n in res.noderefs){
					if(res.noderefs[n]){
						ok++;
					} else {
						ko++;
						errors += "<br/><b>"+Formez.Ldi.docsWait[n].name+"</b>: "+res.errors[n];
					}
				}
				Formez.alert(ok+" documento/i conservato/i con successo!<br/>"+ko+" documento/i non conservato/i!"+errors);
				Formez._drawCosWait();
				Formez._cosPage = 0;
				Formez._drawCosList();
			} else {
				Formez.alert("Impossibile collegarsi ai server di conservazione!","danger");
			}
			Formez.waitOff();
		});
	}
});
	
})();
