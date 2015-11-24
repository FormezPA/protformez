/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// get government details
	_govDetails: function(){
		Formez.Org.getGov(function(gov){
			$(".formez-gov").html('"'+gov.name+'"');
		});
	},
	// edit gov
	_editGov: function(){
		Formez.Picker.getForm({
		    type:"org:gov",
		    mode:"edit",
		    form:"edit",
		    noderef:Formez.Org.gov.noderef,
		    callback:function(noderef){
		    	Formez._govDetails();
		    }
		});
	},
	// draw aoo list
	_listAoo: function(){
		Formez.Org.getAoos(function(offices){
			var ul = $(".list-group.org-aoo");
			ul.empty();
			if($.isEmptyObject(offices)){
				ul.append('<li class="list-group-item"><a>Nessuna AOO disponibile</a></li>');
			} else {
				for(var o in offices){
					var office = offices[o];
					ul.append('<li class="list-group-item"><a href="/share/page/site/'+office.shortName+'/desktop"><i class="fa fa-sitemap"></i> '+office.title+'</a></li>');
				}
			}
		});
	},
	// add aoo
	_addAoo: function(){
		var name = $.trim($("#aoo-name").val());
		var prefix = $.trim($("#aoo-prefix").val());
		if(name.length==0 || prefix.length==0){
			Formez.poptime("Specifica nome e prefisso!", "warning");
			return;
		} else {
			Formez.wait("Creazione AOO in corso...");
			Formez.Org.createAoo(name, prefix, function(res){
				if(res.success){
					Formez._listAoo();
					Formez.alert("L'AOO '"+name+"' è stato creato con successo");
					$(".collapse.in input").val("");
					$(".collapse.in").collapse('hide');
				} else {
					Formez.alert("Errore durante la creazione dell'AOO! Codice già utilizzato?","danger");
				}
				Formez.waitOff();
			});
		}
	}
});
	
})();
