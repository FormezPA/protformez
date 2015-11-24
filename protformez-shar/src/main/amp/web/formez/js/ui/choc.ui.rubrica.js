/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// function to update contacts
	_updateContacts: function(event){
		// il keydown lo accetto solo da tasto invio
		if(event!=null && event.keyCode!=13){
			return;
		}
		Formez.Protocol.getContacts({
			search: $("input.adb-filter").val(),
			page: Formez.Protocol.contactsPage,
			callback: function(contacts){
				var ulEl = $(".adb-list");
				var toEmpty = true;
				var contactCounter = 0;
				for(var c in contacts){
					contactCounter++;
					// empty if there is yet an element
					if(toEmpty){
						ulEl.empty();
						toEmpty = false;
					}
					var contact = contacts[c];
					var html = "<li class='list-group-item' data-noderef='"+c+"'><div class='adb-detail-name'>"+contact.name+"</div>";
					if(contact.piva.length>0){
						html += "<div class='adb-detail-company'>P.IVA "+contact.piva+"</div>";
					}
					if(contact.address.length>0 || contact.city.length>0 || contact.cap.length>0 || contact.district.length>0){
						html += "<div class='adb-detail-address'><i class='fa fa-building'></i> ";
						if(contact.address.length>0){
							html += ""+contact.address+", ";
						}
						html += contact.city+" "+contact.cap+" "+contact.district+"</div>";
					}
					if(contact.email.length>0){
						html += "<div class='adb-detail-email'><i class='fa fa-envelope'></i> "+contact.email;
						if(contact.tel.length>0){
							html += " <span><i class='fa fa-phone'></i> "+contact.tel+"</span>";
						}
						html += "</div>";
					}
					if(contact.note.length>0){
						html += "<div class='adb-detail-other'><div class='adb-detail-notes'><i class='fa fa-info'></i> "+contact.note+"</div>";
					}
					html += "<div class='adb-detail-actions'><button onclick='Formez._editContact(this);' class='btn adb-detail-action-edit' type='button'><i class='fa fa-edit'></i></button>";
					html += "<button class='btn adb-detail-action-del' type='button' data-toggle='popover'><i class='fa fa-times'></i></button></div></div>";
					html += "</li>";
					ulEl.append(html);
				}
				$(".adb-detail-action-del").popover({
					placement: "bottom",
					html: true,
					container: "body",
					content: function(){
						var noderef = $(this).parents("li[data-noderef]").data("noderef");
						var html = "<button class='btn btn-success' onclick='Formez._deleteContact(\""+noderef+"\");'>Conferma</button>";
						html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
						return html;
					}
				});
			}
		});
	},
	// create contact
	_createContact: function(){
		Formez.Protocol.getContactFolder(function(noderef){
			Formez.Picker.getForm({
			    type:"addbook:contact",
			    mode:"new",
			    noderef:noderef,
			    callback:function(){
			    	Formez.Protocol.contactsPage = 0;
			    	Formez._updateContacts();
			    }
			});
		});
	},
	// delete contact
	_deleteContact: function(noderef){
		Formez.Protocol.deleteContact(noderef, function(res){
			Formez._closePopover();
			if(res.success){
				Formez.poptime("Contatto eliminato correttamente!");
				Formez._updateContacts();
			} else {
				if(res.message=="protocollo"){
					Formez.alert("Impossibile eliminare il contatto perchè associato a protocollo/i!","warning");
				} else {
					Formez.alert("Impossibile eliminare questo contatto!","warning");
				}
			}
		});
	},
	// edit contact
	_editContact: function(el){
		var noderef = $(el).parents("li[data-noderef]").data("noderef");
		Formez.Picker.getForm({
		    type:"addbook:contact",
		    mode:"edit",
		    form:"edit",
		    noderef:noderef,
		    callback:function(){
		    	Formez._updateContacts();
		    }
		});
	}
});
	
})();
