/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// selected uo
	_currentUO: null,
	// boolean for move active
	_isMoveActive: false,
	// create new uo and draw
	_createUO: function(event){
		if(event!=null && event.keyCode!=13){return;}
		var name = $("#formez-uo-create").val();
		if(name.length<1){
			Formez.poptime("Non hai inserito il nome!","warning");
			return;
		}
		Formez.Org.createUo(name, Formez._currentUO, function(res){
			if(res.success){
				$("#formez-uo-create").val("");
				Formez.poptime("Nuova UO creata!");
				Formez._setupChart(res.newuo);
			}
		});
	},
	// remove uo and redraw
	_removeUO: function(){
		Formez.Org.removeUo(Formez._currentUO, function(res){
			if(res.success){
				Formez.poptime("UO eliminata!");
				Formez._setupChart($(".orgChart .level0").data("noderef"));
			} else {
				Formez.alert(res.message, "warning");
				Formez._closePopover();
			}
		});
	},
	// remove uo and redraw
	_renameUO: function(){
		var newname = $.trim($(".org-uo-rename-value").val());
		if(newname.length>0){
			Formez.Docs.Actions.rename(Formez._currentUO, newname, function(success){
				if(success){
					Formez._closePopover();
					Formez.poptime("UO rinominata con successo!");
					Formez._setupChart(Formez._currentUO);
				} else {
					Formez.alert("Impossibile rinominare l'UO!", "danger");
					Formez._closePopover();
				}
			});
		}
	},
	// assign role to uo
	_assignRole: function(){
		var roleref = $("#formez-role-assign").val();
		if(roleref==""){
			return;
		}
		var uoRoles = Formez.Org.getUo(Formez._currentUO).roles;
		for(var r in uoRoles){
			if(uoRoles[r].noderef==roleref){
				Formez.poptime("Ruolo già assegnato a questo UO!","warning");
				return;
			}
		}
		Formez.Org.addRoleToUo(roleref, Formez._currentUO, function(success){
			if(success){
				Formez.poptime("Ruolo assegnato con successo!");
				Formez._setupChart(Formez._currentUO);
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
			$("#formez-role-assign").val("");
		});
	},
	_removeRole: function(el){
		Formez.Org.removeRoleFromUo($(el).data("remove"), Formez._currentUO, function(success){
			if(success){
				Formez.poptime("Ruolo rimosso con successo!");
				Formez._closePopover();
				Formez._setupChart(Formez._currentUO);
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	// set inherit
	_setInherit: function(){
		var inherit = $(this).prop("checked");
		Formez.Org.setUoInherit(Formez._currentUO, inherit, function(success){
			if(success){
				Formez.poptime("Impostazione salvata!");
				Formez._setupChart(Formez._currentUO);
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	_setAlltits: function(){
		var alltits = $(this).prop("checked");
		Formez.Org.setUoAlltits(Formez._currentUO, alltits, function(success){
			if(success){
				Formez.poptime("Impostazione salvata!");
				Formez._setupChart(Formez._currentUO);
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	// search user
	_searchUsers: function(isenter, event){
		if(isenter){
			if(event.keyCode!=13) return;
		}
		var q = $.trim($("#org-user-q").val());
		if(q=="" || q=="*"){
			Formez.poptime("Inserisci almeno un carattere!","warning");
			return;
		}
		Formez.Org.searchUsers(q, false, true, 10, function(users){
			var resultUl = $(".org-users-result");
			resultUl.empty();
			for(var u in users){
				var user = users[u];
				if(user.username!="guest"){
					var html = "<li class='list-group-item' data-username='"+user.username+"'>";
					var uo = user.uo[Formez.site];
					if(uo){
						html += "<span><i class='fa fa-user'></i> "+user.name+" "+user.surname+"</span> <a onclick='Formez._uoSelect(\""+uo+"\")'><span class='badge'><i class='fa fa-sitemap'></i> ";
						html += Formez.Org.getUo(uo).name+"</span></a>";
					} else {
						html += "<button type='button' class='btn action' onclick='Formez._addUser($(this).parent());'><i class='fa fa-plus-circle'></i></button> ";
						html += "<span><i class='fa fa-user'></i> "+user.name+" "+user.surname+"</span>";
					}
					html += "</li>";
					resultUl.append(html);
				}
			}
			if(users.length==0){
				resultUl.append("<li class='list-group-item'>Nessun risultato...</li>");
			}
		});
	},
	// add user to uo
	_addUser: function(li){
		var user = li.data("username");
		Formez.Org.addUserToUo(user, Formez._currentUO, function(success){
			if(success){
				Formez.poptime("Utente aggiunto all'UO!");
				Formez._setupChart(Formez._currentUO);
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	_removeUser: function(el){
		Formez.Org.removeUserFromUo($(el).data("remove"), Formez._currentUO, function(success){
			if(success){
				Formez.poptime("Utente rimosso con successo!");
				Formez._closePopover();
				Formez._setupChart(Formez._currentUO);
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	// show user permissions
	_userPermix: function(el, event){
		var target = $(event.target);
		if(target.prop("tagName").toLowerCase()=="button"){
			return;
		}
		var permsDiv = $(".org-uo-user-perms");
		var el = $(el);
		if(el.hasClass("org-user-active")){
			// reclick on same user
			$(el).removeClass("org-user-active");
			permsDiv.addClass("hide");
		} else {
			// clean perms
			$(".org-uo-user-perms-ul span.badge").remove();
			$(".org-uo-user-perms-ul i.fa-check").removeClass("fa-check").addClass("fa-minus");
			// click on other user
			$(".org-uo-users .org-user-active").removeClass("org-user-active");
			$(el).addClass("org-user-active");
			// show perms
			var uo = Formez.Org.getUo(Formez._currentUO);
			var username = $(el).data("username");
			for(var u in uo.users){
				var user = uo.users[u];
				if(user.username==username){
					$(".org-uo-user-perms-name").html("Riepilogo permessi <i class='fa fa-user'></i> <b>"+user.name+"</b>");
					break;
				}
			}
			var roles = new Array();
			$(".org-uo-roles li[data-noderef]").each(function(){
				roles.push($(this).data("noderef"));
			});
			for(var r in roles){
				var role = Formez.Org.getRole(roles[r]);
				for(var p in role){
					if(p!="name"){
						var value = role[p];
						if(value){
							var permLi = permsDiv.find("li."+p);
							permLi.children("i").removeClass("fa-minus").addClass("fa-check");
							var html = "<span class='badge'><i class='fa fa-shield'></i> "+role.name+"</span>";
							permLi.find("span").last().after(html);
						}
					}
				}
			}
			$(el).addClass("org-user-active");
			permsDiv.removeClass("hide");
		}
	},
	// add tits to uo
	_addTitsToUO: function(){
		Formez.Picker.openDoclib({
			multiple: true,
			selectable: function(n){return n.type=="tit:titolo"||n.type=="tit:classe"||n.type=="tit:fascicolo"},
			upload: false,
			callback: function(nodes){
				if(nodes.length>0){
					var tits = [];
					for(var n in nodes){
						var node = nodes[n];
						// controllo se non è già associata la voce
						if(Formez.Org.uos[Formez._currentUO].tits.indexOf(node.noderef)==-1){
							tits.push(node.noderef);
						}
					}
					Formez.Org.addTitsToUo(tits, Formez._currentUO, function(res){
						if(res.success){
							Formez.alert("Voci di titolario associate con successo!");
							Formez._setupChart(Formez._currentUO);
						} else {
							alert("Errore imprevisto");
							location.reload();
						}
					});
				}
			}
		});
	},
	// remove tit from uo
	_removeTit: function(el){
		Formez.Org.removeTitFromUo($(el).data("remove"), Formez._currentUO, function(success){
			if(success){
				Formez.alert("Voce di titolario rimossa con successo!");
				Formez._closePopover();
				Formez._setupChart(Formez._currentUO);
			} else {
				alert("Errore imprevisto!");
				location.reload();
			}
		});
	},
	// variable for chart html
	_drawHtml: "",
	// recursive function for chart drawing
	_drawChart: function(uoref){
		var uo = Formez.Org.getUo(uoref);
		Formez._drawHtml += "<li data-noderef='"+uoref+"'>"+uo.name;
		if(uo.children.length>0){
			Formez._drawHtml += "<ul>";
			for(var c in uo.children){
				Formez._drawChart(uo.children[c]);
			}
			Formez._drawHtml += "</ul>";
		}
		Formez._drawHtml += "</li>";
	},
	// setup chart function
	_setupChart: function(noderef){
		Formez.Org.getUos(function(res){
			var chartUl = $("#formez-org-chart");
			chartUl.empty();
			Formez._drawChart(res.root);
			chartUl.html(Formez._drawHtml);
			chartUl.orgChart({
				container : $('#formez-org-chart-container')
			});
			Formez._drawHtml = "";
			var uos = $("#formez-org-chart-container .orgChart div");
			uos.click(Formez._uoSelect);
			if(noderef!=null){
				Formez._uoSelect(noderef);
			}
		});
	},
	// load uo and draw chart
	_uoSelect: function(noderef){
		// CASO SPECIALE: è attivo lo spostamento degli UO
		if(Formez._isMoveActive){
			Formez.Org.moveUo(Formez._currentUO, $(this).data("noderef"), function(res){
				Formez._isMoveActive = false;
				Formez._closePopover();
				if(res.success){
					Formez.alert("UO spostata con successo!");
					Formez._setupChart(Formez._currentUO);
				} else {
					Formez.alert(res.message, "danger");
				}
			});
			return;
		}
		// caso normale: sto selezionando un UO
		if($(".col_center_container").hasClass("hide")){
			$("#formez-org-div").removeClass("col-md-12");
			$("#formez-org-div").addClass("col-md-8");
			$(".col_center_container").removeClass("hide");
		}
		$("#formez-org-chart-container .active").removeClass("active");
		if(typeof noderef == "object"){
			Formez._currentUO = $(this).data("noderef");
			$(this).addClass("active");
		} else {
			Formez._currentUO = noderef;
			$("#formez-org-chart-container .orgChart div").each(function(){
				var element = $(this);
				if(element.data("noderef")==noderef){
					element.addClass("active");
					return false;
				}
			});
		}
		// close all open collapse
		$(".collapse.in").collapse('hide');
		// close all popover
		Formez._closePopover();
		var uo = Formez.Org.getUo(Formez._currentUO);
		// set uo name
		$(".org-uo-name > span").html(" "+uo.name);
		// check inherit box
		var box = $("#formez-uo-inherit");
		if(uo.inherit){
			box.prop("checked", true);
		} else {
			box.prop("checked", false);
		}
		box.bootstrapSwitch('destroy');
		box.bootstrapSwitch({
			size: "small",
			onSwitchChange: Formez._setInherit
		});
		// check alltits box
		box = $("#formez-uo-alltits");
		if(uo.alltits){
			box.prop("checked", true);
			$(".org-uo-tits").parent().addClass("hide");
		} else {
			box.prop("checked", false);
			$(".org-uo-tits").parent().removeClass("hide");
		}
		box.bootstrapSwitch('destroy');
		box.bootstrapSwitch({
			size: "small",
			onSwitchChange: Formez._setAlltits
		});
		// show role
		var rolesUl = $(".org-uo-roles");
		rolesUl.find("[data-toggle='popover']").popover("destroy");
		rolesUl.empty();
		for(var r in uo.roles){
			var role = uo.roles[r];
			var html = "<li class='list-group-item' data-noderef='"+role.noderef+"'><i class='fa fa-shield'></i> "+role.name;
			html += " <button class='btn' data-container='body' data-toggle='popover'><i class='fa fa-times-circle'></i></button></li>";
			rolesUl.append(html);
		}
		// add popover to role
		rolesUl.find("button").each(function(){
			var apop = $(this);
			var noderef = apop.parent().data("noderef");
			apop.popover({
				placement: "bottom",
				html: true,
				content: function(){
					var html = "<button data-remove='"+noderef+"' class='btn btn-success' onclick='Formez._removeRole(this);'>Rimuovi da UO</button>";
					html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
					return html;
				}
			});
		});
		// show inherit roles if inherit is active
		if(uo.inherit){
			var inheritRoles = new Array();
			// function to get inherit role
			var getInheritRoles = function(current){
				for(var c in current.children){
					var childRef = current.children[c];
					var child = Formez.Org.getUo(childRef);
					for(var r in child.roles){
						var role = child.roles[r].noderef;
						if(inheritRoles.indexOf(role)==-1){
							inheritRoles.push(role);
						}
					}
					getInheritRoles(child);
				}
			}
			getInheritRoles(uo);
			// display inherit role
			for(var r in inheritRoles){
				var roleRef = inheritRoles[r];
				if(rolesUl.find("li[data-noderef='"+roleRef+"']").length==0){
					var role = Formez.Org.getRole(roleRef);
					rolesUl.append("<li class='list-group-item org-inherit-role' data-noderef='"+roleRef+"'><i class='fa fa-shield'></i> "+role.name+"</li>");
				}
			}
		}
		// empty search result
		$("#org-user-q").val("");
		$(".org-users-result").empty();
		// close user permissions
		$(".org-uo-user-perms").addClass("hide");
		// show user
		var usersUl = $(".org-uo-users");
		usersUl.find("[data-toggle='popover']").popover("destroy");
		usersUl.empty();
		for(var u in uo.users){
			var user = uo.users[u];
			var html = "<li onclick='Formez._userPermix(this, event);' class='list-group-item' data-username='"+user.username+"'><i class='fa fa-user'></i> ";
			html += user.name+" <button class='btn' data-container='body' data-toggle='popover'><i class='fa fa-times-circle'></i></button></li>";
			usersUl.append(html);
		}
		usersUl.find("button").each(function(){
			var apop = $(this);
			var username = apop.parent().data("username");
			apop.popover({
				placement: "bottom",
				html: true,
				content: function(){
					var html = "<button data-remove='"+username+"' class='btn btn-success' onclick='Formez._removeUser(this);'>Rimuovi da UO</button>";
					html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
					return html;
				}
			});
		});
		// show tits
		var titsUl = $(".org-uo-tits");
		titsUl.find("[data-toggle='popover']").popover("destroy");
		titsUl.empty();
		for(var u in uo.tits){
			var tit = uo.tits[u];
			var html = "<li class='list-group-item' data-noderef='"+tit.noderef+"'><i class='fa fa-folder'></i> ";
			html += tit.name+" <button class='btn' data-toggle='popover'><i class='fa fa-times-circle'></i></button></li>";
			titsUl.append(html);
		}
		// add popover to tits
		titsUl.find("button").each(function(){
			var apop = $(this);
			var tit = apop.parent().data("noderef");
			apop.popover({
				container: "body",
				placement: "bottom",
				html: true,
				content: function(){
					var html = "<button data-remove='"+tit+"' class='btn btn-success' onclick='Formez._removeTit(this);'>Disassocia da UO</button>";
					html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
					return html;
				}
			});
		});
		// show inherit tits if inherit is active
		if(uo.inherit){
			var inheritTits = new Array();
			var inheritTitsObj = {}
			// function to get inherit tits
			var getInheritTits = function(current){
				for(var c in current.children){
					var childRef = current.children[c];
					var child = Formez.Org.getUo(childRef);
					for(var t in child.tits){
						var tit = child.tits[t];
						var titRef = tit.noderef;
						if(inheritTits.indexOf(titRef)==-1){
							inheritTits.push(titRef);
							inheritTitsObj[titRef] = tit;
						}
					}
					getInheritTits(child);
				}
			}
			getInheritTits(uo);
			// display inherit tits
			for(var t in inheritTits){
				var titRef = inheritTits[t];
				if(titsUl.find("li[data-noderef='"+titRef+"']").length==0){
					var tit = inheritTitsObj[titRef];
					titsUl.append("<li class='list-group-item org-inherit-tit' data-noderef='"+titRef+"'><i class='fa fa-folder'></i> "+tit.name+"</li>");
				}
			}
		}
	}
});
	
})();
