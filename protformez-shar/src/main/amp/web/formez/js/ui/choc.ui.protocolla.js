/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// create protocol
	_newProtocol: function(){
		var disabledInput = $("#collapseProt input:disabled");
		disabledInput.removeProp("disabled");
		var formdata = $("#formez-reg-new").serializeArray();
		disabledInput.prop('disabled', true);
		var data = {}
		for(var i=0;i<formdata.length;i++){
			var el = formdata[i];
			if(data[el.name]){
				data[el.name] = data[el.name]+", "+el.value;
			} else {
				data[el.name] = el.value;
			}
		}
		if($.trim(data.subject)==""){
			Formez.poptime("L'oggetto è obbligatorio!","warning");
			return;
		}
		if(data.direction=="in" && $.trim(data.sender)==""){
			Formez.poptime("Il mittente è obbligatorio per i protocolli in entrata!","warning");
			return;
		}
		if(data.direction=="out" && $.trim(data.doc)==""){
			Formez.poptime("Il documento è obbligatorio per i protocolli in uscita!","warning");
			return;
		}
		if(data.direction=="out" && $.trim(data.receiver)==""){
			Formez.poptime("Il destinatario è obbligatorio per i protocolli in uscita!","warning");
			return;
		}
		if(($.trim(data.sosprot).length>0 && $.trim(data.sosdate).length==0) || ($.trim(data.sosprot).length==0 && $.trim(data.sosdate).length>0)){
			Formez.poptime("Per il protocollo di emergenza entrambi i campi devono essere compilati!","warning");
			return;
		}
		if(($.trim(data.mittenteprot).length>0 && $.trim(data.mittentedate).length==0) || ($.trim(data.mittenteprot).length==0 && $.trim(data.mittentedate).length>0)){
			Formez.poptime("Per il protocollo mittente entrambi i campi devono essere compilati!","warning");
			return;
		}
		data["site"] = Formez.site;
		Formez.Protocol.create({
			data: data,
			callback: function(res){
				if(res.success){
					location.href = "protocollo";
				} else {
					alert("Errore durante la protocollazione");
					location.href = "protocollo";
				}
			}
		});
	},
	// assign document for protocollation
	_addDoc: function(){
		Formez.Picker.openDoclib({
			multiple: false,
			selectable: function(n){return !n.isContainer && n.aspects.indexOf("reg:recordable")==-1},
			upload: true,
			callback: function(nodes){
				if(nodes.length>0){
					var input = $("input[name='doc']");
					var node = nodes[0];
					input.val(node.noderef);
					var body = input.parent();
					body.find("h4").remove();
					body.append("<h4 data-noderef='"+node.noderef+"'><span class='label label-primary'>"+node.name+
						" <i onclick='Formez._removeElement(this);' class='fa fa-times'></i></span></h4>");
				}
			}
		});
	},
	// choose classification
	_addFascicoli: function(){
		Formez.Picker.openDoclib({
			multiple: true,
			selectable: function(n){return n.type=="tit:fascicolo" && n.properties["tit:fascicoloStato"]=="Aperto"},
			upload: false,
			callback: function(nodes){
				if(nodes.length>0){
					var input = $("input[name='fascicolo']");
					var body = input.parent();
					var startLi = body.find("h4 span.label-info");
					if(startLi.length>0){
						startLi.parent().remove();
						input.val("");
					}
					for(var n=0;n<nodes.length;n++){
						var node = nodes[n];
						if(input.val().indexOf(node.noderef)==-1){
							body.append("<h4 data-noderef='"+node.noderef+"'><span class='label label-primary'>"+node.name+
								" <i onclick='Formez._removeElement(this);' class='fa fa-times'></i></span></h4>");
							if(input.val().length>0){
								input.val(input.val()+","+node.noderef);
							} else {
								input.val(node.noderef);
							}
						}
					}
				}
			}
		});
	},
	// choose attachments
	_addAttachs: function(){
		Formez.Picker.openDoclib({
			multiple: true,
			selectable: function(n){return !n.isContainer},
			upload: true,
			callback: function(nodes){
				if(nodes.length>0){
					var input = $("input[name='attachs']");
					var body = input.parent();
					var startLi = body.find("h4 span.label-info");
					if(startLi.length>0){
						startLi.parent().remove();
						input.val("");
					}
					for(var n=0;n<nodes.length;n++){
						var node = nodes[n];
						if(input.val().indexOf(node.noderef)==-1){
							body.append("<h4 data-noderef='"+node.noderef+"'><span class='label label-primary'>"+node.name+
								" <i onclick='Formez._removeElement(this);' class='fa fa-times'></i></span></h4>");
							if(input.val().length>0){
								input.val(input.val()+","+node.noderef);
							} else {
								input.val(node.noderef);
							}
						}
					}
				}
			}
		});
	},
	// choose senders
	_addSender: function(){
		Formez.Picker.openAdb({
			multiple: true,
			callback: function(nodes){
				if(nodes.length>0){
					var input = $("input[name='sender']");
					var body = input.parent();
					var startLi = body.find("h4 span.label-info");
					if(startLi.length>0){
						startLi.parent().remove();
						input.val("");
					}
					for(var n=0;n<nodes.length;n++){
						var node = nodes[n];
						if(input.val().indexOf(node.noderef)==-1){
							body.append("<h4 data-noderef='"+node.noderef+"'><span class='label label-primary'>"+node.name+
								" <i onclick='Formez._removeElement(this);' class='fa fa-times'></i></span></h4>");
							if(input.val().length>0){
								input.val(input.val()+","+node.noderef);
							} else {
								input.val(node.noderef);
							}
						}
					}
				}
			}
		});
	},
	// choose senders
	_addRecipient: function(){
		Formez.Picker.openAdb({
			multiple: true,
			callback: function(nodes){
				if(nodes.length>0){
					var input = $("input[name='receiver']");
					var body = input.parent();
					var startLi = body.find("h4 span.label-info");
					if(startLi.length>0){
						startLi.parent().remove();
						input.val("");
					}
					for(var n=0;n<nodes.length;n++){
						var node = nodes[n];
						if(input.val().indexOf(node.noderef)==-1){
							body.append("<h4 data-noderef='"+node.noderef+"'><span class='label label-primary'>"+node.name+
								" <i onclick='Formez._removeElement(this);' class='fa fa-times'></i></span></h4>");
							if(input.val().length>0){
								input.val(input.val()+","+node.noderef);
							} else {
								input.val(node.noderef);
							}
						}
					}
				}
			}
		});
	},
	// remove element
	_removeElement: function(xEl){
		var h4El = $(xEl).parent().parent();
		var input = h4El.parent().children("input");
		var noderef = h4El.data("noderef");
		var refs = input.val().split(",");
		input.val($.grep(refs, function(ref, i){
			return ref!=noderef;
		}).join(","));
		h4El.remove();
	}
});
	
})();
