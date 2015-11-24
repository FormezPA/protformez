/**
 * Formez draw Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
// generic functions
$.extend(Formez, {
	// function for popover closing
	_closePopover: function(){
		$("[data-toggle='popover']").popover("hide");
	},
	// function for user settings (logout, edit)
	_userSettingPopover: function(){
		$("#top-nav .formez-user").popover({
			placement: "bottom",
			html: true,
			container: "body",
			content: function(){
				var html = "<ul class='formez-user-actions list-group'>";
				html += "<li class='list-group-item'><a target=_blank href='"+Formez.formez_url+"exec'><i class='fa fa-cube'></i> Scarica eseguibile</a></li>";
				html += "<li class='list-group-item'><a onclick='Formez._changeUserPw(this);' data-toggle='popover'><i class='fa fa-key'></i> Cambia Password</a></li>";
				if (Formez.enableShare) {
					html += "<li class='list-group-item'><a href='/share/page/user/" + Formez.user.id + "/dashboard'><i class='fa fa-empire'></i> Vai a share</a></li>";
				}
				html += "<li class='list-group-item'><a href='/share/page/dologout'><i class='fa fa-sign-out'></i> Logout</a></li>";
				html += "<li class='list-group-item'>2014.08 - Ver. 1.3</li>";
				html += "</ul>";
				return html;
			}
		}).on("show.bs.popover", function(){
			$(this).data("bs.popover")["$tip"].addClass("formez-user-popover");
		});
	},
	// function for change user password
	_changeUserPw: function(el){
		if(el==null){
			var oldpass = $(".user-setpw-oldpw").val();
			var pass1 = $(".user-setpw-newpw").val();
			var pass2 = $(".user-setpw-newpw2").val();
			if(oldpass.length<3){
				Formez.poptime("Inserisci la password corrente!","warning");
			} else if(pass1!=pass2){
				Formez.poptime("Le password non coincidono!","danger");
			} else if(pass1.length<3){
				Formez.poptime("La password deve essere di almeno 3 caratteri!","warning");
			} else {
				Formez.Org.setUserPassword(Formez.user.id, oldpass, pass1, function(res){
					Formez._closePopover();
					if(res.success){
						Formez.poptime("Password resettata con successo!");
					} else {
						Formez.alert("Impossibile modificare la password!<br/>Inserisci correttamente la password corrente!","danger");
					}
				});
			}
		} else {
			// popover for set password
			$(el).popover({
				placement: "left",
				html: true,
				container: "body",
				content: function(){
					var html = "<b>Vecchia password:</b><br/>";
					html += "<input type='password' class='form-control user-setpw-oldpw' placeholder='Vecchia password' /><br/>";
					html += "<b>Nuova password:</b><br/>";
					html += "<input type='password' class='form-control user-setpw-newpw' placeholder='Nuova password' /><br/>";
					html += "<b>Conferma password:</b><br/>";
					html += "<input type='password' class='form-control user-setpw-newpw2' placeholder='Conferma password'/><br/>";
					html += "<button class='btn btn-success' onclick='Formez._changeUserPw();'>Salva</button>";
					html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
					return html;
				}
			});
			$(el).popover("show");
		}
	}
});
	
})();
