/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// get reg audit
	_auditReg: function(){
		var q = $("#audit-reg-filter").val();
		Formez.Protocol.audits("reg", q, function(res){
			$(".audit-tit-results").empty();
			var auditUl = $(".audit-reg-results");
			auditUl.empty();
			if(res.audits.length>0){
				for(var a in res.audits){
					var audit = res.audits[a];
					var number = audit.name.split("-");
					var dir = "";
					if(audit.dir=="in"){
						dir="left";
					} else if(audit.dir=="out"){
						dir="right";
					} else {
						dir="down";
					}
					var html = "<li onclick='Formez._showAudit(this);' data-noderef='"+audit.noderef+"' class='list-group-item'>";
					html += "<i class='reg-dir fa fa-arrow-circle-"+dir+"'></i> "+number[2]+" ("+number[1]+")</li>";
					auditUl.append(html);
				}
			} else {
				auditUl.append("<li class='list-group-item'>Nessun risultato...</li>");
			}
		});
	},
	// get tit audit
	_auditTit: function(){
		var q = $("#audit-tit-filter").val();
		Formez.Protocol.audits("tit", q, function(res){
			$(".audit-reg-results").empty();
			var auditUl = $(".audit-tit-results");
			auditUl.empty();
			if(res.audits.length>0){
				for(var a in res.audits){
					var audit = res.audits[a];
					var type = audit.type.split(":")[1];
					var html = "<li onclick='Formez._showAudit(this);' data-noderef='"+audit.noderef+"' class='list-group-item type-"+type+"'>";
					html += "<i class='fa fa-folder-open'></i> "+audit.name+" ("+type+")</li>";
					auditUl.append(html);
				}
			} else {
				auditUl.append("<li class='list-group-item'>Nessun risultato...</li>");
			}
		});
	},
	// show audit detail
	_showAudit: function(el){
		var noderef = $(el).data("noderef");
		$(".timeline-wrapper .timeline-item-runtime").remove();
		$(".timeline-start strong").text("Start");
		Formez.Protocol.audit(noderef, function(res){
			var basicHtml = $(".audit-timeline-template").html();
			var previousEl = $(".timeline-wrapper .timeline-start");
			for(var e in res.events){
				var event = res.events[e];
				// load template for row
				var eventEl = $(basicHtml);
				previousEl.after(eventEl);
				previousEl = eventEl;
				// set properties for row
				if(event.referenceType=="PROTOCOLLO"){
					var prot = event.referenceName.split("-");
					$(".timeline-start strong").text("Protocollo "+prot[2]+" (anno "+prot[1]+")");
				} else if(event.referenceType=="TITOLARIO"){
					$(".timeline-start strong").text("Voce Titolario '"+event.referenceName+"'");
				}
				var dateSplit = event.date.split(".");
				eventEl.find(".timeline-info .time").html(dateSplit[0]+"."+dateSplit[1]+" "+dateSplit[2]);
				eventEl.find(".timeline-panel .panel-heading span").text(event.action);
				eventEl.find(".timeline-panel .fa-user").after(" "+event.user);
				var paramsHtml = "<ul class='list-group timeline-params'>";
				for(var p in event.params){
					var param = event.params[p].split("|");
					paramsHtml += "<li class='list-group-item'><strong>"+param[0]+":</strong> "+param[1]+"</li>";
				}
				paramsHtml += "</ul>";
				eventEl.find(".timeline-panel .panel-body p").html(paramsHtml);
			}
		});
	}
});
	
})();
