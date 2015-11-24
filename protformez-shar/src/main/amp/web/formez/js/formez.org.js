/**
 * Formez @Org Module
 * @namespace Formez.Org
*/

(function(){
	
$.extend(Formez.types, {
	// aggiungo il tipo per la configurazione di legaldoc
	"org:gov":{
		name: "Impostazioni Amministrazione",
		props: [
			{name:"org:govName",type:"string",title:"Nome",mandatory:true,form:["edit"]},
			{name:"org:govCode",type:"string",title:"Codice",mandatory:true,form:["edit"]}
		]
	},
	"cfg:aoo":{
		name: "Configurazione AOO",
		props: [
			{name:"cm:title",type:"string",title:"Nome",mandatory:true,form:["edit"]},
			{name:"cfg:aooToponimo",type:"select",title:"Toponimo",choices:"Via,Viale,Vicolo,Piazza,Piazzetta,Corso,Strada,Contrada",form:["edit"]},
			{name:"cfg:aooIndirizzo",type:"string",title:"Indirizzo",form:["edit"]},
			{name:"cfg:aooCivico",type:"string",title:"Civico",form:["edit"]},
			{name:"cfg:aooComune",type:"string",title:"Comune",form:["edit"]},
			{name:"cfg:aooCAP",type:"zipcode",title:"CAP",form:["edit"]},
			{name:"cfg:aooProvincia",type:"string",title:"Provincia",form:["edit"]},
			{name:"cfg:aooEmail",type:"string",title:"Email",check:"email",form:["edit"]},
			{name:"cfg:aooTel",type:"string",title:"Telefono",form:["edit"]},
			{name:"cfg:aooFax",type:"string",title:"Fax",form:["edit"]}
		]
	}
});
	
/**
 * @Org module
 */
Formez.Org = {
	/**
	 * AOO SECTION
	 */
	// government object
	gov: null,
	// get gov details
	getGov: function(callback){
		$.getJSON(Formez.formez_url+"org/aoo/gov", function(res){
			if(res.noderef==null){
				location.reload();
			}
			Formez.Org.gov = res;
			callback(res);
		});
	},
	// list of offices
	aoos: null,
	// get account list
	getAoos: function(callback){
		$.getJSON(Formez.alf_url+"api/sites?spf=formez-site", function(res){
			Formez.Org.aoos = res;
			callback(res);
		});
	},
	createAoo: function(name, prefix, callback){
		$.getJSON(Formez.formez_url+"org/aoo/create?name="+name+"&prefix="+prefix, callback).fail(function(){callback({success:false})});
	},
	configClean: function(){
		$.getJSON("/share/page/formez/cfgcleaner?site="+Formez.site);
	},
	/**
	 * UO SECTION
	 */
	// list of uos
	uos: null,
	// get uo by noderef
	getUo: function(noderef){
		return this.uos[noderef];
	},
	// get uos list
	getUos: function(callback){
		$.getJSON(Formez.formez_url+"org/uo/list?site="+Formez.site, function(res){
			Formez.Org.uos = res.uos;
			callback(res);
		});
	},
	// create uo
	createUo: function(name, parent, callback){
		$.getJSON(Formez.formez_url+"org/uo/create?parent="+parent+"&name="+encodeURIComponent(name), callback);
	},
	// create uo
	removeUo: function(uo, callback){
		$.getJSON(Formez.formez_url+"org/uo/delete?uo="+uo, callback);
	},
	// create uo
	moveUo: function(uo, parent, callback){
		if(uo==parent){
			return;
		}
		$.getJSON(Formez.formez_url+"org/uo/move?uo="+uo+"&parent="+parent, callback);
		// clean permissions
		Formez.Org.rolesClean();
	},
	// add role to uo
	addRoleToUo: function(role, uo, callback){
		$.getJSON(Formez.formez_url+"org/uo/addrole?role="+role+"&uo="+uo, callback);
		// clean permissions
		Formez.Org.rolesClean();
	},
	// remove role from uo
	removeRoleFromUo: function(role, uo, callback){
		$.getJSON(Formez.formez_url+"org/uo/removerole?role="+role+"&uo="+uo, callback);
		// clean permissions
		Formez.Org.rolesClean();
	},
	// add user to uo
	addUserToUo: function(user, uo, callback){
		$.getJSON(Formez.formez_url+"org/uo/adduser?user="+user+"&uo="+uo, callback);
	},
	// remove user from uo
	removeUserFromUo: function(user, uo, callback){
		$.getJSON(Formez.formez_url+"org/uo/removeuser?user="+user+"&uo="+uo, callback);
		// clean permissions
		Formez.Org.rolesClean();
	},
	// set role inherit
	setUoInherit: function(uo, inherit, callback){
		$.getJSON(Formez.formez_url+"org/uo/setinherit?uo="+uo+"&inherit="+inherit, callback);
		// clean permissions
		Formez.Org.rolesClean();
	},
	// set uo alltits
	setUoAlltits: function(uo, alltits, callback){
		$.getJSON(Formez.formez_url+"org/uo/setalltits?uo="+uo+"&alltits="+alltits, callback);
	},
	// add tit to uo
	addTitsToUo: function(tits, uo, callback){
		$.getJSON(Formez.formez_url+"org/uo/addtits?uo="+uo+"&tits="+tits.toString(), callback);
	},
	// remove tit from uo
	removeTitFromUo: function(tit, uo, callback){
		$.getJSON(Formez.formez_url+"org/uo/removetit?tit="+tit+"&uo="+uo, callback);
	},
	/**
	 * ROLES SECTION
	 */
	// list of roles
	roles: null,
	// get list of roles
	getRoles: function(callback){
		if(this.roles==null){
			$.getJSON(Formez.formez_url+"org/roles/list?site="+Formez.site,function(res){
				Formez.Org.roles = res.roles;
				callback(res.roles);
			});
		} else {
			callback(this.roles);
		}
	},
	// get role by noderef
	getRole: function(noderef){
		return this.roles[noderef];
	},
	// create role
	createRole: function(name, callback){
		$.getJSON(Formez.formez_url+"org/roles/create?site="+Formez.site+"&name="+encodeURIComponent(name),function(res){
			// add role to roles array
			Formez.Org.roles[res.noderef] = res.role;
			callback(res);
		});
	},
	// delete role
	deleteRole: function(noderef, callback){
		$.getJSON(Formez.formez_url+"org/roles/delete?noderef="+noderef,callback);
	},
	// save role permission
	saveRolePermissions: function(noderef, perms, callback){
		perms.noderef = noderef;
		$.ajax({
		    type: "POST",
		    url: Formez.formez_url+"org/roles/setup",
		    data: JSON.stringify(perms),
		    success: function(res){
		    	// replace role in js array
		    	Formez.Org.roles[res.noderef] = res.role;
				// call callback
				callback(true);
				// clean permissions cache for this site
				Formez.Org.rolesClean();
		    },
		    contentType: "application/json",
		    dataType: 'json'
		});
	},
	// clean permissions for a site (to call when orgChart or roles changed)
	rolesClean: function(){
		$.getJSON("/share/page/formez/permcleaner?site="+Formez.site);
	},
	/**
	 * USER SECTION
	 */
	lastSearch: null,
	// get user
	getUser: function(username, callback){
		$.getJSON(Formez.alf_url+"api/people/"+username, callback);
	},
	// get list of user (onlyMember - search only in members group, withUo - return user uo)
	searchUsers: function(query, onlyMember, withUo, maxItems, callback){
		var uri = Formez.formez_url+"org/users/search?q="+query+"&max="+(maxItems || 10);
		if(onlyMember){
			uri += "&site="+Formez.site;
		}
		$.getJSON(uri+"&uo="+withUo,function(res){
			Formez.Org.lastSearch = res.users;
			callback(res.users);
		});
	},
	// create alfresco user
	createUser: function(params, callback){
		$.ajax({
		    type: "POST",
		    url: Formez.formez_url+"org/users/create",
		    data: params,
		    success: callback,
		    contentType: "application/x-www-form-urlencoded",
		    dataType: "json"
		});
	},
	editUser: function(username, props, callback){
		var data = {}
		for(var p in props){
			var prop = props[p];
			data[prop.name] = prop.value;
		}
		$.ajax({
			type: "PUT",
		    url: Formez.alf_url+"api/people/"+username,
		    data: JSON.stringify(data),
		    success: function(){
		    	callback(true);
		    },
		    contentType: "application/json",
		    dataType: "json"
		});
	},
	// delete alfresco user
	deleteUser: function(username, callback){
		$.ajax({
		    type: "DELETE",
		    url: Formez.alf_url+"api/people/"+username,
		    success: callback,
		    contentType: "application/json",
		    dataType: "json"
		});
	},
	// set user password
	setUserPassword: function(username, oldpw, newpw, callback){
		var data = {
			"newpw": newpw
		}
		if(oldpw!=null){
			data["oldpw"] = oldpw;
		}
		$.ajax({
			type: "POST",
		    url: Formez.alf_url+"api/person/changepassword/"+username,
		    data: JSON.stringify(data),
		    success: callback,
		    contentType: "application/json",
		    dataType: "json"
		});
	}
}
	
})();
