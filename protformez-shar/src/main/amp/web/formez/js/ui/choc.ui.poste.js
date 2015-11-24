/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	/**
	 * show textarea or file
	 * mode: 'text' or 'file'
	 */
	_h2hShowChosen: function(mode){
		if(mode=="text"){
			$(".h2h-new-buttons").addClass("hide");
			$("#h2h-new-text").parents(".form-group").removeClass("hide");
		} else if(mode=="file"){
			$(".h2h-new-buttons").addClass("hide");
			var fileEl = $(".h2h-new-file");
			$(".h2h-new-file").parents(".form-group").removeClass("hide");
			$(".h2h-new-dest-tol").addClass("hide");
			$(".h2h-new-dest-tol h5").remove();
		}
	},
	// select file to send with h2h
	_h2hSelectFile: function(){
		Formez.Picker.openDoclib({
			multiple: false,
			selectable: function(n){return !n.isContainer},
			upload: true,
			callback: function(nodes){
				if(nodes.length>0){
					var node = nodes[0];
					var fileEl = $(".h2h-new-file");
					fileEl.data("noderef",node.noderef);
					fileEl.html("<i class='fa fa-file'></i> "+node.name);
					Formez._h2hShowChosen("file");
				}
			}
		});
	},
	// select contact for send
	_h2hSelectContact: function(type){
		var ulEl = $(".h2h-new-dest-"+type+" .panel-footer");
		Formez.Picker.openAdb({
			multiple: true,
			callback: function(nodes){
				if(nodes.length>0){
					for(var n=0;n<nodes.length;n++){
						var node = nodes[n];
						if(ulEl.find("h5[data-noderef='"+node.noderef+"']").length==0){
							var html = "<h5 data-noderef='"+node.noderef+"'><span class='label label-primary'>"+node.name;
							html += " <a onclick='$(this).parent().parent().remove();'><i class='fa fa-times'></i></a></span></h5>";
							ulEl.append(html);
						}
					}
				}
			}
		});
	},
	// reset buttons
	_h2hReset: function(all){
		$(".h2h-new-buttons").removeClass("hide");
		var textEl = $("#h2h-new-text");
		textEl.val("");
		textEl.parents(".form-group").addClass("hide");
		var fileEl = $(".h2h-new-file");
		fileEl.parents(".form-group").addClass("hide");
		fileEl.empty();
		$(".h2h-new-dest-tol").removeClass("hide");
		if(all){
			$("#h2h-new-name").val("");
			$(".h2h-new-dest h5").remove();
		}
	},
	// create new h2h order
	_h2hNewOrdine: function(){

		var data = {}
		data["ordineNome"] = $("#h2h-new-name").val();
		data["ordineTesto"] = $("#h2h-new-text").val();
		
		var arrDestTol = $(".h2h-new-dest-tol").find( "h5" );
		var destTol = [];
		for(var n=0;n<arrDestTol.length;n++){
			var node = arrDestTol[n];
			destTol.push($(node).attr("data-noderef"));
		}
		data.destinatariTol = destTol;
		var arrDestRol = $(".h2h-new-dest-rol").find( "h5" );
		var destRol = [];
		for(var n=0;n<arrDestRol.length;n++){
			var node = arrDestRol[n];
			destRol.push($(node).attr("data-noderef"));
		}
		data.destinatariRol = destRol;
		var arrDestLol = $(".h2h-new-dest-lol").find( "h5" );
		var destLol = [];
		for(var n=0;n<arrDestLol.length;n++){
			var node = arrDestLol[n];
			destLol.push($(node).attr("data-noderef"));
		}
		data.destinatariLol = destLol;
		var arrDestRolar = $(".h2h-new-dest-rolar").find( "h5" );
		var destRolar = [];
		for(var n=0;n<arrDestRolar.length;n++){
			var node = arrDestRolar[n];
			destRolar.push($(node).attr("data-noderef"));
		}
		data.destinatariRolar = destRolar;
		data.site = Formez.site;
		Formez.Poste.create({
			data: data,
			callback: function(res){
				if(res.success){
					location.href = "poste";
				} else {
					Formez.alert(res.message,"warning");
					location.href = "poste";
				}
			}
		});
	},
});
	
})();
