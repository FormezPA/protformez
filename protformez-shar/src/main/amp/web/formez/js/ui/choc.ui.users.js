/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// search users
	_searchUsers: function(event){
		if(event!=null && event.keyCode!=13){
			return;
		}
		var q = $(".users-filter").val();
		if(q.length>0){
			Formez.Org.searchUsers(q, false, true, -1, function(users){
				var tableEl = $(".users-list");
				tableEl.empty();
				if($.isEmptyObject(users)){
					tableEl.append("<tr><td><b>Nessun utente corrisponde alla tua ricerca...</b></td></tr>");
				} else {
					tableEl.append("<thead><tr><th>Username</th><th>Nome</th><th>Cognome</th><th>Email</th><th></th></tr></thead>");
					var tbody = $("<tbody></tbody>");
					tableEl.append(tbody);
					for(var u in users){
						var user = users[u];
						var rowHtml = "<tr><td>"+user.username+"</td><td>"+user.name+"</td><td>"+user.surname+"</td><td>"+user.mail+"</td>";
						rowHtml += "<td data-username='"+user.username+"'>";
						rowHtml += "<button class='btn btn-sm btn-default users-edit' data-toggle='popover'><i class='fa fa-edit'></i> Modifica</button> ";
						rowHtml += "<button class='btn btn-sm btn-default users-setpw' data-toggle='popover'><i class='fa fa-key'></i> Reset Password</button> ";
						rowHtml += "<button class='btn btn-sm btn-danger users-delete' data-toggle='popover'><i class='fa fa-times'></i> Elimina</button>";
						rowHtml += "</td></tr>";
						tbody.append(rowHtml);
					}
					// popover for edit user
					$(".users-edit").popover({
						placement: "left",
						html: true,
						container: "body",
						title: "Modifica utente",
						content: function(){
							var username = $(this).parent().data("username");
							var html = $(".users-edit-template").html();
							var user = {};
							for(var u in Formez.Org.lastSearch){
								user = Formez.Org.lastSearch[u];
								if(user.username==username){
									break;
								}
							}
							html = html.replace("$$firstName$$",user.name||"").replace("$$lastName$$",user.surname||"");
							html = html.replace("$$email$$",user.mail||"").replace("$$username$$",user.username||"");
							return html;
						}
					}).on("show.bs.popover", function(){
						$(this).data("bs.popover")["$tip"].addClass("users-edit-popover");
					}).on("shown.bs.popover", function(){
						var userPop = $(this).data("bs.popover")["$tip"];
						$(userPop).find("form.form-horizontal").bootstrapValidator({
							feedbackIcons: {
						        valid: 'glyphicon glyphicon-ok',
						        invalid: 'glyphicon glyphicon-remove',
						        validating: 'glyphicon glyphicon-refresh'
						    },
						    live: 'enabled'
						});
					});
					// popover for set password
					$(".users-setpw").popover({
						placement: "bottom",
						html: true,
						container: "body",
						content: function(){
							var username = $(this).parent().data("username");
							var html = "<b>Password:</b><br/>";
							html += "<input type='password' class='form-control users-setpw-newpw' placeholder='Password' /><br/>";
							html += "<b>Conferma password:</b><br/>";
							html += "<input type='password' class='form-control users-setpw-newpw2' placeholder='Conferma password'/><br/>";
							html += "<button class='btn btn-success' onclick='Formez._resetUserPw(\""+username+"\");'>Salva</button>";
							html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
							return html;
						}
					});
					// popover for user delete
					$(".users-delete").popover({
						placement: "right",
						html: true,
						container: "body",
						title: "Sei sicuro?",
						content: function(){
							var username = $(this).parent().data("username");
							var html = "<button class='btn btn-success' onclick='Formez._deleteUser(\""+username+"\");'>Conferma</button>";
							html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
							return html;
						}
					});
				}
			});
		} else {
			Formez.poptime("Inserisci almeno un carattere...","warning");
		}
	},
	// create user
	_createUser: function(){
		var userForm = $(".users-add-popover .form-horizontal");
		userForm.data('bootstrapValidator').validate();
		if(userForm.data('bootstrapValidator').isValid()){
			Formez.wait("Creazione utente in corso...");
			Formez.Org.createUser(userForm.serialize(), function(user){
				if(user.success){
					Formez.waitOff();
					Formez._closePopover();
					Formez.alert("Utente creato con successo!<br/>Tra pochi secondi sarà disponibile nei risultati della ricerca!");
				} else {
					Formez.alert("Errore imprevisto! Forse esiste già un utente con questo username?","danger");
				}
			});
		}
	},
	// edit user
	_editUser: function(username){
		var userForm = $(".users-edit-popover .form-horizontal");
		userForm.data('bootstrapValidator').validate();
		if(userForm.data('bootstrapValidator').isValid()){
			Formez.wait("Modifica utente in corso...");
			var username = userForm.data("username");
			Formez.Org.editUser(username, userForm.serializeArray(), function(success){
				if(success){
					Formez.waitOff();
					Formez._closePopover();
					Formez.poptime("Utente modificato con successo!");
					Formez._searchUsers();
				} else {
					alert("Errore imprevisto!");
					location.reload();
				}
			});
		}
	},
	// delete user
	_deleteUser: function(username){
		Formez.Org.deleteUser(username, function(){
			Formez._closePopover();
			Formez.poptime("Utente eliminato!");
			Formez._searchUsers();
		});
	},
	// reset user password
	_resetUserPw: function(username){
		var pass1 = $(".users-setpw-newpw").val();
		var pass2 = $(".users-setpw-newpw2").val();
		if(pass1!=pass2){
			Formez.poptime("Le password non coincidono!","danger");
		} else if(pass1.length<3){
			Formez.poptime("La password deve essere di almeno 3 caratteri!","warning");
		} else {
			Formez.Org.setUserPassword(username, null, pass1, function(res){
				Formez._closePopover();
				if(res.success){
					Formez.poptime("Password resettata con successo!");
				} else {
					alert("Errore imprevisto!!!");
					location.reload();
				}
			});
		}
	}
});
	
})();
