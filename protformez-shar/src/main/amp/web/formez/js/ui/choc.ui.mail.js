/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// boolean to set if is in sent mode
	_inSentMode: false,
	// boolean to set if is in starred mode
	_inStarredMode: false,
	// current mail page,
	_emailPage: 0,
	// mail param
	_mailParam: null,
	// function to retrieve mail (with pagination)
	_getEmails: function(){
		Formez.Pec.getEmails({
			callback: Formez._drawEmails,
			sent: this._inSentMode ? "on" : "",
			starred: this._inStarredMode ? "on" : "",
			page: this._emailPage
		});
	},
	// show prev email page
	_prevEmail: function(){
		if(this._emailPage>0){
			this._emailPage--;
			this._getEmails();
		}
	},
	// show next email page
	_nextEmail: function(){
		this._emailPage++;
		this._getEmails();
	},
	// function to draw email list
	_drawEmails: function(res){
		var pecTable = $("#pec-list");
		// controllo se ci sono risultati
		if(res.total==0){
			if(Formez._emailPage==0){
				pecTable.empty();
				pecTable.append("<tr><td></td><td>Nessuna mail...</td></tr>");
			} else {
				Formez._emailPage--;
			}
			return;
		}
		pecTable.empty();
		var emails = res.emails;
		for(var e in emails){
			var email = emails[e];
			var tr = $("<tr/>");
			tr.attr("data-noderef",e);
			if(!email.read){
				tr.addClass("pec-email-notread");
			}
			tr.append("<td><input type='checkbox' class='form-control'></td>");
			tr.append("<td><a"+(email.starred=="starred"?" class='pec-list-starred'":"")+"><i class='fa fa-star'></i></a></td>");
			var from = $("<td/>");
			from.addClass("pec-list-from");
			if(Formez._inSentMode){
				from.text("A: "+email.to.join(","));
			} else {
				from.text("Da: "+email.from);
			}
			tr.append(from);
			var text = $("<td/>");
			text.addClass("pec-list-text");
			text.text($.trim(email.subject));
			tr.append(text);
			var detail = $("<td/>");
			detail.addClass("pec-list-detail text-right");
			if(email.attachments.length>0){
				detail.append("<i class='fa fa-paperclip' title='Con allegato/i'></i>");
			}
			if(email.pec){
				detail.append(" <i class='badge pec'>PEC</i>");
			}
			if(email.protocol){
				detail.append(" <i class='badge protocol'>Protocollata</i>");
			}
			if(email.receiptType){
				var firstC = email.receiptType[0];
				detail.append(" <i class='badge receipt'>"+email.receiptType.replace(firstC, firstC.toUpperCase())+"</i>");
			}
			if(email.receipts!=null && email.receipts.length>0){
				var toolt = "";
				for(var r in email.receipts){
					var receipt = email.receipts[r];
					toolt += "- <b>" + receipt.type + "</b> da <i>" + receipt.address + "</i><br/>";
				}
				detail.append(" <i class='badge receiptsent' data-toggle='tooltip' title='"+toolt+"'><i class='fa fa-search'></i> Ricevute</i>");
			}
			if(Formez._inStarredMode){
				var type;
				if(email.type=="pec:mailSent"){
					detail.append(" <i class='fa fa-arrow-circle-right'></i>");
				} else {
					detail.append(" <i class='fa fa-arrow-circle-left'></i>");
				}
			}
			tr.append(detail);
			tr.append("<td class='pec-list-date'>"+email.date+"</td>");
			tr.click(e, Formez._showEmail);
			pecTable.append(tr);
			tr.find(".badge.receiptsent").tooltip({
				placement: "left",
				html: true
			});
		}
		// if have a mail param, open email directly
		if(Formez._mailParam!=null){
			$("#pec-list tr[data-noderef='"+Formez._mailParam+"']").click();
			Formez._mailParam = null;
		}
	},
	// draw accounts lists
	_drawPecAccounts: function(){
		$(".pec-accounts").empty();
		for(var a in Formez.Pec.accounts){
			var account = Formez.Pec.accounts[a];
			var html = "<li class='list-group-item'><a href='mail?noderef="+a+"'><span class='pec-account-name'>"+account.name+"</span><br/>";
			html += "<span class='pec-account-mail'>"+account.username+"</span>";
			html += "<i class='fa fa-chevron-circle-right pull-right'></i></a></li>";
			$(".pec-accounts").append(html);
		}
	},
	// show email body
	_showEmail: function(event){
		if($(event.target).prop("tagName").toLowerCase()=="input"){
			return;
		}
		var email = Formez.Pec.emails[event.data];
		Formez.Pec.email = event.data;
		// ### caso particolare, ho cliccato sulla stella
		if($(event.target).prop("class").toLowerCase()=="fa fa-star"){
			var aEl = $(event.target).parent();
			if(aEl.hasClass("pec-list-starred")){
				// is starred, i must remove starring
				Formez.Pec.starring(Formez.Pec.email, false, function(res){
					if(res.success){
						aEl.removeClass("pec-list-starred");
					}
				});
			} else {
				// isn't starred, i must add starring
				Formez.Pec.starring(Formez.Pec.email, true, function(res){
					if(res.success){
						aEl.addClass("pec-list-starred");
					}
				});
			}
			return;
		}
		// riempio i campi della mail da visualizzare
		$("#mail-headers-subject").html(email.subject);
		$("#mail-headers-from").text(email.from);
		$("#mail-headers-to").text(email.to.toString().replace(",",", "));
		$("#mail-headers-cc").text(email.cc.toString().replace(",",", "));
		$("#mail-headers-bcc").text(email.bcc.toString().replace(",",", "));
		$("#mail-date").text(email.date);
		// fix per eventuali a capo di email solo testo
		var text = email.text.replace(/\n\r/g, '<br/>');
		// fix per eventuali css globali aggiunti con il tag style
		text = text.replace("*{", "#mail-body *{").replace("* {", "#mail-body * {");
		$("#mail-body").html(text);
		var attachsUl = $("#mail-attachs ul"); 
		attachsUl.empty();
		for(var a in email.attachments){
			var attach = email.attachments[a];
			var html = "<li><span><i class='fa fa-paperclip'></i>"+attach.name;
			html += " <a onclick='Formez.Picker.showPreview({noderef:\""+attach.noderef+"\"});' class='btn btn-xs btn-default btn-first'><i class='fa fa-eye'></i>Anteprima</a> ";
			html += "<a onclick='Formez._saveAttach(\""+attach.noderef+"\");' class='btn btn-xs btn-default'><i class='fa fa-download'></i>Salva</a></span></li>";
			attachsUl.append(html);
		}
		// nascondo la lista
		$(".pec-mail-list").hide();
		// mostro la mail
		$(".pec-mail-body").slideDown(300);
		// setto la mail come letta
		Formez.Pec.setRead(event.data);
		$(event.target).parents(".pec-email-notread").removeClass("pec-email-notread");
	},
	// hide mail body
	_hideEmail: function(){
		Formez.Pec.email = null;
		Formez._closePopover();
		$(".pec-mail-body").hide();
		$(".pec-mail-list").show();
	},
	// send an email
	_sendMail: function(mode){
		var config = {}
		config.account = Formez.Pec.account;
		config.mode = mode;
		if(mode=="reply" || mode=="replyall" || mode=="forward"){
			config.email = Formez.Pec.email;
		}
		config.callback = Formez._getEmails;
		Formez.Picker.sendMail(config);
	},
	// goto posta in arrivo
	_gotoInbox: function(){
		location.href = "mail?noderef="+Formez.Pec.account;
	},
	// goto posta inviata
	_gotoSent: function(){
		location.href = "mail?sent=on&noderef="+Formez.Pec.account;
	},
	// goto posta inviata
	_gotoStarred: function(){
		location.href = "mail?starred=on&noderef="+Formez.Pec.account;
	},
	// delete email
	_deleteEmails: function(){
		Formez.wait("Attendere...");
		Formez._closePopover();
		var noderefs = [];
		$("#pec-list input:checked").each(function(){
			noderefs.push($(this).parents("tr").data("noderef"));
		});
		Formez.Pec.remove(noderefs, function(res){
			Formez.waitOff();
			if(res.success){
				Formez.alert("Email rimossa/e!<br/>Ricorda che non è possibile rimuovere pec (o email protocollate)!");
				Formez._getEmails();
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	// save attachs
	_saveAttach: function(noderef){
		Formez.Pec.saveAttach(noderef, function(success){
			if(success){
				Formez.poptime("Allegato salvato nei documenti personali!");
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	// protocol mail
	_protocolMail: function(){
		Formez._closePopover();
		Formez.wait("Protocollazione in corso...");
		Formez.Pec.protocol(Formez.Pec.email, function(res){
			Formez.waitOff();
			if(res.success){
				Formez.alert("Email/PEC protocollata con successo!<br/>Numero di protocollo: "+res.number);
				Formez._getEmails();
			} else {
				if(res.message=="already"){
					Formez.poptime("Email/PEC già protocollata!", "warning");
				} else {
					Formez.alert("ERRORE! Impossibile protocollare!!", "danger");
				}
			}
		});
	}
});
	
})();
