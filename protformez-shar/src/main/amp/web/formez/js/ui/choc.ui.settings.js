/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// draw pec configuration
	_drawPecConfiguration: function(){
		Formez.Pec.getAccounts(function(){
			var pecUl = $(".cfg-pec-accounts");
			pecUl.empty();
			for(var a in Formez.Pec.accounts){
				var account = Formez.Pec.accounts[a];
				var html = "<li data-noderef='"+a+"' class='list-group-item'>";
				if(account.active){
					html += "<a onclick='Formez._stopPecAccount(this);' class='pull-right btn btn-success' title='Disattiva'><i class='fa fa-stop'></i></a>";
				} else {
					html += "<a class='pull-right btn btn-danger' data-toggle='popover'><i class='fa fa-times'></i></a>";
					html += "<a onclick='Formez._editPecAccount(this);' class='pull-right btn btn-success' title='Modifica'><i class='fa fa-edit'></i></a>";
					html += "<a onclick='Formez._startPecAccount(this);' class='pull-right btn btn-success' title='Attiva'><i class='fa fa-play'></i></a>";
				}
				html += "<span class='pec-account-name'><b>"+account.name+"</b></span><br/>";
				html += "<span class='pec-account-mail'>"+account.username+"</span>";
				html += "</li>"
				pecUl.append(html);
			}
			pecUl.find("a[data-toggle='popover']").popover({
				placement: "right",
				html: true,
				container: "body",
				content: function(){
					var noderef = $(this).parent().data("noderef");
					var html = "<b>Attenzione! L'account non potrà più essere utilizzato!</b><br/>";
					html += "<button class='btn btn-danger' onclick='Formez._deletePecAccount(\""+noderef+"\");'>Elimina</button>";
					html += " <button class='btn btn-success' onclick='Formez._closePopover();'>Annulla</button>";
					return html;
				}
			});
		});
	},
	// draw h2h configuration
	_drawH2hConfiguration: function(){
		$(".cfg-h2h-panel input[type='checkbox']").bootstrapSwitch({
			size: "small",
			onSwitchChange: Formez._h2hActive
		});
	},
	// draw ldi configuration 
	_drawLdiConfiguration: function(){
		$(".cfg-ldi-panel input[type='checkbox']").bootstrapSwitch({
			size: "small",
			onSwitchChange: Formez._ldiActive
		});
	},
	// draw ldi types configuration
	_drawLdiTypesConfiguration: function(){
		Formez.Ldi.types(function(res){
			var typesUl = $(".cfg-ldi-nowtypes");
			typesUl.empty();
			typesUl.append("<b>Attivati:</b>");
			for(var t in res.types){
				var type = res.types[t].split("|");
				if(type[1].length>0){
					typesUl.append("<a class='badge'>"+Formez.types[type[0]].name+"</a>");
				}
			}
		});
	},
	// draw aoo config
	_drawAooConfiguration: function(){
		var addressPanel = $(".cfg-aoo-panel .panel-footer");
		addressPanel.empty();
		if(Formez.node){
			Formez.Docs.get(Formez.node, function(item){
				var html = "<span><b><i>"+item.properties["cm:title"]+"</i></b></span><br/>";
				html += "<b>Indirizzo:</b><br/>";
				var address = item.properties["cfg:aooToponimo"]+" "+item.properties["cfg:aooIndirizzo"]+" "+item.properties["cfg:aooCivico"];
				if($.trim(address).length>0){
					html += address+"<br/>";
				}
				var city = item.properties["cfg:aooComune"];
				if($.trim(city).length>0){
					html += city+"<br/>";
				}
				html += item.properties["cfg:aooCAP"]+" "+item.properties["cfg:aooProvincia"];
				html += "<br/><b>Recapiti:</b><br/>";
				var tel = item.properties["cfg:aooTel"];
				var fax = item.properties["cfg:aooFax"];
				var email = item.properties["cfg:aooEmail"];
				if(tel.length>0){
					html += "<i>Tel.</i> "+tel+"<br/>";
				}
				if(fax.length>0){
					html += "<i>Fax.</i> "+fax+"<br/>";
				}
				if(email.length>0){
					html += "<i>Email.</i> "+email;
				}
				addressPanel.append(html);
				// call Cos configuration (beacause use same item)
				Formez._drawCosConfiguration(item);
			});
		} else {
			setTimeout(Formez._drawAooConfiguration, 100);
		}
	},
	// function to draw cos configuration (called from aooConfiguration)
	_drawCosConfiguration: function(item){
		var username = item.properties["cfg:cosResp"];
		if(username!=null && username.length>0){
			Formez.Org.getUser(username, function(user){
				$(".cfg-cos-resp").text(user.firstName+" "+user.lastName);
			});
		} else {
			$(".cfg-cos-resp").text("Nessuno");
		}
	},
	// edit aoo details
	_editAOO: function(){
		Formez.Picker.getForm({
		    type:"cfg:aoo",
		    mode:"edit",
		    form:"edit",
		    noderef:Formez.node,
		    callback:function(noderef){
		    	Formez._drawAooConfiguration();
		    }
		});
	},
	// create pec account
	_createPecAccount: function(){
		Formez.Docs.getContainer("pec", function(container){
			Formez.Picker.getForm({
			    type:"pec:account",
			    mode:"new",
			    noderef:container.nodeRef,
			    callback:function(noderef){
			    	Formez._drawPecConfiguration();
			    	// clean share cache for config
					Formez.Org.configClean();
			    }
			});
		});
	},
	// start pec account
	_startPecAccount: function(el){
		var noderef = $(el).parent().data("noderef");
		Formez.wait("Avvio dell'account in corso...");
		Formez.Pec.startAccount(noderef, function(res){
			Formez.waitOff();
			if(res.success){
				Formez._drawPecConfiguration();
				Formez.poptime("Account attivato!");
			} else {
				alert("Impossibile attivare l'account!");
				location.reload();
			}
		});
	},
	// stop pec account
	_stopPecAccount: function(el){
		var noderef = $(el).parent().data("noderef");
		Formez.wait("Arresto dell'account in corso...");
		Formez.Pec.stopAccount(noderef, function(res){
			Formez.waitOff();
			if(res.success){
				Formez._drawPecConfiguration();
				Formez.poptime("Account disattivato!");
			} else {
				alert("Impossibile disattivare l'account!");
				location.reload();
			}
		});
	},
	// edit pec account
	_editPecAccount: function(el){
		Formez.Picker.getForm({
		    type:"pec:account",
		    mode:"edit",
		    form:"edit",
		    noderef:$(el).parent().data("noderef"),
		    callback:function(noderef){
		    	// nothing for now
		    }
		});
	},
	// delete pec account
	_deletePecAccount: function(noderef){
		Formez.Pec.deleteAccount(noderef, function(res){
	    	if(res.success){
	    		Formez._drawPecConfiguration();
	    		Formez.poptime("Account eliminato con successo!");
	    	}
	    	Formez._closePopover();
	    });
	},
	// function for active and disactive h2h service
	_h2hActive: function(){
		var active = $(this).prop("checked");
		Formez.Poste.active(active, function(res){
			if(res.success){
				if(active){
					Formez.poptime("Servizi postali attivati!");
				} else {
					Formez.poptime("Servizi postali disattivati...");
				}
				// clean share cache for config
				Formez.Org.configClean();
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	// function to configure h2h service
	_h2hSettings: function(){
		var active = $(".cfg-h2h-panel input[type='checkbox']").prop("checked");
		if(active){
			Formez.Picker.getForm({
			    type:"cfg:h2h",
			    mode:"edit",
			    form:"edit",
			    noderef:Formez.node,
			    callback:function(){
			    	//
			    }
			});
		} else {
			Formez.poptime("Servizi postali H2H non attivi!","warning");
		}
	},
	// function for active and disactive ldi service
	_ldiActive: function(){
		var active = $(this).prop("checked");
		Formez.Ldi.active(active, function(res){
			if(res.success){
				if(active){
					Formez.poptime("Infocert Legaldoc attivato!");
				} else {
					Formez.poptime("Infocert Legaldoc disattivato...");
					$(".cfg-ldi-types").addClass("hide");
				}
				// clean share cache for config
				Formez.Org.configClean();
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	// function to configure ldi service
	_ldiSettings: function(){
		var active = $(".cfg-ldi-panel input[type='checkbox']").prop("checked");
		if(active){
			Formez.Picker.getForm({
			    type:"cfg:ldi",
			    mode:"edit",
			    form:"edit",
			    noderef:Formez.node,
			    callback:function(){
			    	//
			    }
			});
		} else {
			Formez.poptime("Servizio Infocert LegalDoc non attivo!","warning");
		}
	},
	// function to configure ldi types settings
	_ldiTypeSettings: function(){
		var active = $(".cfg-ldi-panel input[type='checkbox']").prop("checked");
		if(active){
			Formez.Ldi.types(function(res){
				var typesUl = $(".cfg-ldi-types");
				typesUl.find("input[type='checkbox']").bootstrapSwitch('destroy');
				typesUl.empty();
				typesUl.removeClass("hide");
				var formEl = $("<form/>");
				typesUl.append(formEl);
				for(var t in res.types){
					var typeSplit = res.types[t].split("|");
					var type = typeSplit[0];
					var policy = typeSplit[1];
					var html = "<li class='list-group-item'><b>"+Formez.types[type].name+"</b> ";
					html += "<input type='checkbox' class='form-control' name='on_"+type+"' ";
					if(policy.length>0){
						html += "checked='checked' ";
					}
					html += "/> <input type='text' class='form-control' name='policy_"+type+"' value='"+policy+"' ";
					html += "placeholder='Policy Id (fornito da infocert)...' /></li>";
					formEl.append(html);
				}
				var html = "<li class='list-group-item'>";
				html += "<a class='btn btn-success' onclick='Formez._ldiTypeSettingsSave();'>Salva</a> ";
				html += "<a class='btn btn-danger' onclick='$(\".cfg-ldi-types\").addClass(\"hide\");'>Chiudi</a></li>";
				formEl.append(html);
				formEl.find("input[type='checkbox']").bootstrapSwitch({
					size: "small"
				});
			});
		} else {
			Formez.poptime("Servizio Infocert LegalDoc non attivo!","warning");
		}
	},
	// function to save ldi types settings
	_ldiTypeSettingsSave: function(){
		var formSer = $(".cfg-ldi-types > form").serialize();
		Formez.Ldi.savetypes(formSer, function(res){
			if(res.success){
				Formez._drawLdiTypesConfiguration();
				Formez.poptime("Impostazioni salvate con successo!");
				$(".cfg-ldi-types").addClass("hide");
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	// function to set mark provider
	_cosMarkSettings: function(){
		// set provider for mark
		Formez.Picker.getForm({
		    type:"cfg:cos",
		    mode:"edit",
		    form:"edit",
		    noderef:Formez.node,
		    callback:function(){
		    	//
		    }
		});
	},
	// function to set director for conservation
	_cosRespChoose: function(){
		// choose user from picker
		Formez.Picker.searchUsers({
			multiple: false,
			callback: function(users){
				if(users.length>0){
					Formez.Cos.setResp(users[0].username, function(){
						Formez.poptime("Responsabile della conservazione salvato!");
						Formez._drawAooConfiguration();
					});
				}
			}
		});
	} 
});
	
})();
