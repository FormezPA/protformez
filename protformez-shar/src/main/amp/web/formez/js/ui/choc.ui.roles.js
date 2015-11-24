/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// current role
	_currentRole: null,
	// create role and draw it
	_createRole: function(event){
		if(event!=null && event.keyCode!=13){return;}
		var name = $("#formez-role-namenew").val();
		if(name.length<1){
			Formez.poptime("Non hai inserito il nome!","warning");
			return;
		} else {
			Formez.Org.createRole(name, function(res){
				var html = "<li class='list-group-item'><a data-noderef='"+res.noderef+"' onclick='Formez._setupPerm(this);'>";
				html += "<i class='fa fa-shield'></i> "+res.role.name+"<i class='fa fa-chevron-circle-right pull-right'></i></a></li>";
				$(".org-roles").append(html);
				$("#formez-role-namenew").val("");
				$("button[data-toggle='collapse']").click();
				$(".org-roles li a[data-noderef='"+res.noderef+"']").click();
			});
		}
	},
	// delete role
	_deleteRole: function(){
		Formez.Org.deleteRole(Formez._currentRole, function(res){
			if(res.success){
				location.reload();
			} else {
				Formez.alert("Impossibile eliminare il ruolo! Forse è associato a qualche UO?");
			}
		});
	},
	// get role and draw his permissions
	_setupPerm: function(el){
		// hide div during setup
		$(".org-permissions").parent().addClass("hide");
		// get noderef
		var liEl = $(el);
		$(".org-roles").children().removeClass("org-role-active");
		liEl.parent().addClass("org-role-active");
		var noderef = $(el).data("noderef");
		var role = Formez.Org.getRole(noderef);
		Formez._currentRole = noderef;
		// clear permission checkbox for previous role
		$(".org-permissions input[type='checkbox']").prop('checked', false);
		// set checkbox for current role
		for(var perm in role){
			if(perm!="name" && role[perm]){
				$(".org-permissions input[name='"+perm+"']").prop('checked', true);
			}
		}
		// update switch
		$(".col_right_container input[type='checkbox']").bootstrapSwitch('destroy');
		$(".col_right_container input[type='checkbox']").bootstrapSwitch({
			size: "small"
		});
		// show permission div
		$(".org-permissions").parent().removeClass("hide");
	},
	// save permission for role
	_savePerms: function(){
		var perms = {};
		$(".org-permissions input[type='checkbox']").each(function(){
			var box = $(this);
			perms[box.attr('name')] = box.is(":checked");
		});
		Formez.Org.saveRolePermissions(Formez._currentRole, perms, function(success){
			if(success){
				Formez.poptime("Permessi salvati!");
			} else {
				alert("Errore durante il salvataggio!");
			}
		});
	}
});
	
})();
