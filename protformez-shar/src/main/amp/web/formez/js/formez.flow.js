/**
 * Formez @Flow Module
 * @namespace Formez.Flow
*/
(function(){
	
/**
 * @Flow module
 */
Formez.Flow = {
	// flows: 
	tasks: {
		"wf:submitAdhocTask": [
		    {name:"bpm:workflowDescription",type:"textarea",title:"Messaggio",mandatory:true},
		    {name:"bpm:package",type:"node",title:"Risorse",multiple:true},
		    {name:"bpm:workflowDueDate",type:"date",title:"Scadenza"},
		    {name:"bpm:assignee",type:"user",title:"Assegnatario",mandatory:true,multiple:false}
		],
		"wf:adhocTask": [
		    {name:"initiator",type:"initiator",title:"Assegnato da"},
   		    {name:"bpm:description",type:"view",title:"Messaggio"},
   		    {name:"bpm:package",type:"view",title:"Risorse"},
   		    {name:"bpm:dueDate",type:"view",datatype:"datetime",title:"Scadenza"},
   		    {name:"bpm:comment",type:"textarea",title:"Commento"}
   		],
   		"wf:completedAdhocTask": [
  		    {name:"bpm:description",type:"view",title:"Messaggio"},
		    {name:"bpm:package",type:"view",title:"Risorse"},
		    {name:"bpm:dueDate",type:"view",datatype:"datetime",title:"Scadenza"}
		],
		"wf:submitReviewTask": [
  		    {name:"bpm:workflowDescription",type:"textarea",title:"Messaggio",mandatory:true},
		    {name:"bpm:package",type:"node",title:"Risorse",multiple:true},
		    {name:"bpm:workflowDueDate",type:"date",title:"Scadenza"},
		    {name:"bpm:assignee",type:"user",title:"Assegnatario",mandatory:true,multiple:false}
		],
		"wf:activitiReviewTask": [
		    {name:"initiator",type:"initiator",title:"Assegnato da"},
  		    {name:"bpm:description",type:"view",title:"Messaggio"},
		    {name:"bpm:package",type:"view",title:"Risorse"},
		    {name:"bpm:dueDate",type:"view",datatype:"datetime",title:"Scadenza"}
		],
		"wf:approvedTask": [
  		    {name:"bpm:description",type:"view",title:"Messaggio"},
		    {name:"bpm:package",type:"view",title:"Risorse"},
		    {name:"bpm:dueDate",type:"view",datatype:"datetime",title:"Scadenza"}
		],
		"wf:rejectedTask": [
  		    {name:"bpm:description",type:"view",title:"Messaggio"},
		    {name:"bpm:package",type:"view",title:"Risorse"},
		    {name:"bpm:dueDate",type:"view",datatype:"datetime",title:"Scadenza"}
		],
		"wf:submitParallelReviewTask": [
   		    {name:"bpm:workflowDescription",type:"textarea",title:"Messaggio",mandatory:true},
		    {name:"bpm:package",type:"node",title:"Risorse",multiple:true},
		    {name:"bpm:workflowDueDate",type:"date",title:"Scadenza"},
		    {name:"bpm:assignees",type:"user",title:"Assegnatario",mandatory:true,multiple:true},
		    {name:"wf:requiredApprovePercent",type:"number",range:"1,100",title:"Precentuale di approvazione richiesta",mandatory:true}
		],
		"wf:approvedParallelTask": [
  		    {name:"bpm:description",type:"view",title:"Messaggio"},
		    {name:"bpm:package",type:"view",title:"Risorse"},
		    {name:"bpm:dueDate",type:"view",datatype:"datetime",title:"Scadenza"},
		    {name:"wf:reviewerCount",type:"view",title:"Numero esaminatori"},
		    {name:"wf:approveCount",type:"view",title:"Esaminatori che hanno approvato il contenuto"},
		    {name:"wf:requiredPercent",type:"view",title:"Percentuale di approvazioni richiesta"},
		    {name:"wf:actualPercent",type:"view",title:"Percentuale di approvazioni effettiva"}
		],
		"wf:rejectedParallelTask": [
  		    {name:"bpm:description",type:"view",title:"Messaggio"},
		    {name:"bpm:package",type:"view",title:"Risorse"},
		    {name:"bpm:dueDate",type:"view",datatype:"datetime",title:"Scadenza"},
		    {name:"wf:reviewerCount",type:"view",title:"Numero esaminatori"},
		    {name:"wf:approveCount",type:"view",title:"Esaminatori che hanno approvato il contenuto"},
		    {name:"wf:requiredPercent",type:"view",title:"Percentuale di approvazioni richiesta"},
		    {name:"wf:actualPercent",type:"view",title:"Percentuale di approvazioni effettiva"}
		]
	},
	// outcome propery values
	outcome: {
		"wf:reviewOutcome": {
			"yes": "Approve",
			"no": "Reject"
		}
	},
	// list of excludes workflows
	excludes: ["jbpm*","activiti$activitiInvitation*","activiti$publishWebContent", "activiti$activitiParallelG*", "activiti$activitiReviewP*"],
	// workflow list
	workflows: null,
	// get workflow definitions
	getWorkflows: function(callback){
		var url = Formez.alf_url+"api/workflow-definitions?exclude="+this.excludes.join(",");
		$.getJSON(url, function(res){
			Formez.Flow.workflows = res.data;
			callback(res.data);
		});
	},
	// get single workflow definition
	getWorkflow: function(id, callback){
		$.getJSON(Formez.alf_url+"api/workflow-definitions/"+id, function(res){
			callback(res.data);
		});
	},
	// get current user tasks
	getTasks: function(callback){
		$.getJSON(Formez.alf_url+"api/task-instances?authority="+Formez.user.id, function(res){
			callback(res.data);
		});
	},
	// get current user tasks
	getTaskInstance: function(id, callback){
		$.getJSON(Formez.alf_url+"api/task-instances/"+id, function(res){
			callback(res.data);
		});
	},
	// get task definition
	getTask: function(id, callback){
		$.getJSON(Formez.alf_url+"api/classes/"+id.replace(":","_"), callback);
	},
	// start workflow
	start: function(data, callback){
		$.ajax({
		    type: "POST",
		    url: Formez.formez_url+"flow/start",
		    data: data,
		    success: callback,
		    contentType: "application/x-www-form-urlencoded",
		    dataType: 'json'
		});
	},
	// step workflow
	step: function(data, callback){
		$.ajax({
		    type: "POST",
		    url: Formez.formez_url+"flow/step",
		    data: data,
		    success: callback,
		    contentType: "application/x-www-form-urlencoded",
		    dataType: 'json',
		    error: function(){location.reload();}
		});
	},
	// show diagram
	diagram: function(wid){
		var divEl = $(".form-img-diagram");
		if(divEl.children().length==0){
			var random = Math.floor(Math.random() * 999);
			divEl.html("<div class='col-sm-10'><img src='"+Formez.alf_url+"api/workflow-instances/"+wid+"/diagram?cache="+random+"' /></div>");
		} else {
			divEl.empty();
		}
	},
	// draw workflow form
	/**
	 * el: form container for draw
	 * wid: workflow id
	 * task: task object definition
	 * isInstance: false if is start for, true otherwise
	 * noderef: package to select automatically in start workflow
	 */
	draw: function(el, wid, task, isInstance, noderef){
		var taskCfg = Formez.Flow.tasks[task.name],
			html = "<h3>"+task.description+"</h3>";
		if(wid!=null){
			html += "<input type='hidden' name='wid' value='"+wid+"' />";
		}
		if(isInstance){
			html += "<button class='btn btn-success btn-xs' type='button' onclick='Formez.Flow.diagram(\""+task.workflowInstance.id+"\");'>";
			html += "<i class='fa fa-camera'></i> Diagramma</button>";
			html += "<input type='hidden' name='tid' value='"+task.id+"' />";
		}
		html += "<div class='form-group form-img-diagram'></div>";
		for(var p in taskCfg){
			var prop = taskCfg[p];
			html += "<div class='form-group'>";
			html += "<label class='control-label col-sm-2'>"+prop.title+"</label>";
			html += "<div class='col-sm-6'>";
			var drawer = Formez.Flow.drawer[prop.type];
			if(drawer!=null){
				html += drawer(prop, task);
			} else {
				html += Formez.Flow.drawer["default"](prop, task);
			}
			html += "</div></div>";
		}
		html += "<div class='form-group'><div class='col-sm-6 col-sm-offset-2'>";
		if(isInstance){
			var outcomeP = task.properties["bpm_outcomePropertyName"];
			if(outcomeP!=null && outcomeP!=""){
				html += "<button class='btn btn-success' type='button' onclick='Formez._stepFlow(\""+outcomeP+"\",\""+Formez.Flow.outcome[outcomeP].yes+"\");'>Approva</button> ";
				html += "<button class='btn btn-success' type='button' onclick='Formez._stepFlow(\""+outcomeP+"\",\""+Formez.Flow.outcome[outcomeP].no+"\");'>Respingi</button>";
			} else {
				html += "<button class='btn btn-success' type='button' onclick='Formez._stepFlow(null);'>Completato</button>";
			}
		} else {
			html += "<button class='btn btn-success' type='button' onclick='Formez._startFlow();'>Avvia Processo</button>";
		}
		html += "</div></div>";
		el.removeData('bootstrapValidator');
		el.empty();
		el.append(html);
		// activate javascript behaviour for boolean
		el.find(".flow-form-boolean").bootstrapSwitch({
			size: "small"
		});
		// activate datepicker for daTE
		el.find(".flow-form-date").datepicker({
	    	format: "dd/mm/yyyy",
		    todayBtn: "linked",
		    language: "it",
		    autoclose: true,
		    todayHighlight: true,
		    weekStart: 1
	    }).on("changeDate", function(){
	    	// ### fix bootstrap validator bug: not set "NOT_VALIDATED" without key event
	    	$(this).data("bv.result.notEmpty","NOT_VALIDATED");
	    });
		// activate picker for node
		el.find(".flow-form-node").click(function(){
			var parentEl = $(this).parent();
			var selected = parentEl.children("input").data("selected");
			Formez.Picker.openDoclib({
				multiple: parentEl.children("input").data("multiple"),
				selectable: function(n){return !n.isContainer},
				upload: true,
				selectselected: selected,
				element: parentEl,
				callback: function(nodes){
					if(nodes.length>0){
						var inputEl = parentEl.children("input");
						var ulEl = parentEl.children("ul");
						inputEl.val("");
						ulEl.empty();
						for(var n in nodes){
							var node = nodes[n];
							inputEl.val(inputEl.val()+";"+node.noderef);
							ulEl.append("<li class='list-group-item'><span class='label label-primary'>"+node.name+"</span></li>");
						}
					}
					else{
						var inputEl = parentEl.children("input");
						var ulEl = parentEl.children("ul");
						inputEl.val("");
						inputEl.attr("value", "");
						ulEl.empty();
						ulEl.attr("data-noderef", "");
					}
				}
			});
		});
		// activate picker for user
		el.find(".flow-form-user").click(function(){
			var parentEl = $(this).parent();
			var multiple = parentEl.children("input").data("multiple");
			Formez.Picker.searchUsers({
				multiple: multiple,
				callback: function(users){
					if(users.length>0){
						var inputEl = parentEl.children("input");
						var ulEl = parentEl.children("ul");
						inputEl.val("");
						ulEl.empty();
						if(multiple){
							for(var u in users){
								var user = users[u];
								inputEl.val(inputEl.val()+";"+user.username);
								ulEl.append("<li class='list-group-item'><span class='label label-primary'>"+user.name+"</span></li>");
							}
						} else {
							var user = users[0];
							inputEl.val(user.username);
							ulEl.append("<li class='list-group-item'><span class='label label-primary'>"+user.name+"</span></li>");
						}
						inputEl.data("bv.result.notEmpty","NOT_VALIDATED");
					}
				}
			});
		});
		// activate picker for contact
		el.find(".flow-form-contact").click(function(){
			var parentEl = $(this).parent();
			var selected = parentEl.children("input").data("selected");
			var multiple = parentEl.children("input").data("multiple");
			Formez.Picker.openAdb({
				multiple: multiple,
				selectselected: selected,
				element: parentEl,
				callback: function(contacts){
					if(contacts.length>0){
						var inputEl = parentEl.children("input");
						var ulEl = parentEl.children("ul");
						inputEl.val("");
						ulEl.empty();
						if(multiple){
							for(var c in contacts){
								var contact = contacts[u];
								inputEl.val(inputEl.val()+";"+contact.noderef);
								ulEl.append("<li class='list-group-item'><span class='label label-primary'>"+contact.name+"</span></li>");
							}
						} else {
							var contact = contacts[0];
							inputEl.val(contact.noderef);
							ulEl.append("<li class='list-group-item'><span class='label label-primary'>"+contact.name+"</span></li>");
						}
						inputEl.data("bv.result.notEmpty","NOT_VALIDATED");
					}
					else{
						var inputEl = parentEl.children("input");
						var ulEl = parentEl.children("ul");
						inputEl.val("");
						inputEl.attr("value", "");
						ulEl.empty();
						ulEl.attr("data-noderef", "");
					}
				}
			});
		});		
		if(noderef!=null && !isInstance){
			var inputEl = el.find("input[name='bpm:package']");
			var ulEl = inputEl.parent().children("ul");
			if(inputEl.length>0){
				Formez.Docs.get(noderef, function(item){
					inputEl.val(noderef);
					if(ulEl.length>0){
						ulEl.append("<li class='list-group-item'><span class='label label-primary'>"+item.properties["cm:name"]+"</span></li>");
					}
				});
			}
		}
		el.bootstrapValidator({
			excluded: [":disabled"],
			feedbackIcons: {
		        valid: 'glyphicon glyphicon-ok',
		        invalid: 'glyphicon glyphicon-remove',
		        validating: 'glyphicon glyphicon-refresh'
		    },
		    live: 'enabled'
		});
	},
	// renderer for workflow form (extension point for future workflow)
	drawer: {
		"boolean": function(prop, task){
				var propValue = task.properties[prop.name.replace(":","_")];
				var html = "<input type='checkbox' name='"+prop.name+"|"+prop.type+"' class='flow-form-boolean' ";
				html += (propValue=="true"?"checked='checked'":"") + "/>";
				return html;
		},			
		"contact": function(prop, task){
			var classname = prop.name.replace(":", "_");
			var propValue = task.properties[prop.name.replace(":","_")];
			if (propValue){
				var propArray = propValue.split(";");
			}
			var html = "<button class='flow-form-contact btn btn-default' type='button'>Seleziona</button>";
			html += "<input type='text' name='"+prop.name+"' style='visibility:hidden;'";
			if(prop.mandatory){
				html += " data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'";
			}
			if(prop.multiple){
				html += " data-multiple='true'";
			} else {
				html += " data-multiple='false'";
			}
			if(prop.selected){
				html += " data-selected='true'";
			} else {
				html += " data-selected='false'";
			}
			if (propValue){
				html += " value=" + propValue + "";
			}
			html += " />";
			if (!propValue){
				html += "<ul class='list-group flow-form-ul'></ul>";
			}
			else{
				html += "<ul data-noderef='"+propValue+"' class='list-group flow-form-ul " + classname + "'></ul>";
				for (var i = 0; i < propArray.length; i++){
					if (propArray[i]){
						$.getJSON(Formez.doclib2_url+"node/"+propArray[i].replace("://", "/"), function(res){
							var ulEl = $("ul[data-noderef='"+propValue+"'][class='list-group flow-form-ul " + classname + "']");
							var name = "";
							if (res.item.node.type == "addbook:contact"){
								name = res.item.node.properties["addbook:name"];
							}
							else{
								name = res.item.node.properties["cm:name"];
							}
							ulEl.append("<li class='list-group-item'><span class='label label-primary'>"+name+"</span></li>");
						});	
					}
				}
				html += "</ul>";
			}
			return html;
		},		
		"date": function(prop, task){
			var propValue = task.properties[prop.name.replace(":","_")];
			if (propValue){
				var day = new Date(propValue).getUTCDate();
				if (day.toString().length == 1){
					day = "0" + day;
				}
				var month = new Date(propValue).getUTCMonth() + 1;
				if (month.toString().length == 1){
					month = "0" + month;
				}
				var year = new Date(propValue).getUTCFullYear();
				propValue = day + "/" + month + "/" + year;
			}
			var html = "<input type='text' name='"+prop.name+"|"+prop.type+"' class='form-control flow-form-date'";
			if(prop.mandatory){
				html += " data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'";
			}
			if (propValue){
				html += " value=" +  propValue;
			}
			html +=" />";
			return html;
		},
		"decimal": function(prop, task){
			var propValue = task.properties[prop.name.replace(":","_")];
			var html = "<input class='form-control' name='"+prop.name+"|"+prop.type+"' data-bv-numeric='true'";
			if(prop.mandatory){
				html += " data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'";
			}
			if(prop.range){
				var range = prop.range.split(",");
				html += " data-bv-between='true' data-bv-between-message='Campo non valido!' data-bv-between-min='"+range[0]+"'";
				html += " data-bv-between-max='"+range[1]+"' data-bv-between-inclusive='false'";
			}
			if (propValue){
				html += " value=" +  propValue;
			}
			html +=" />";
			return html;
		},		
		"default": function(prop, task){
			var propValue = task.properties[prop.name.replace(":","_")];
			var html = "<input class='form-control' name='"+prop.name+"|"+prop.type+"'";
			if(prop.mandatory){
				html += " data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'";
			}
			if (propValue){
				html += " value=" +  propValue;
			}
			html +=" />";
			return html;
		},
		"initiator": function(prop, task){
			var initiator = task.workflowInstance.initiator;
			return "<label class='flow-form-view control-label'>"+initiator.firstName+" "+initiator.lastName+"</label>";
		},
		"node": function(prop, task){
			var classname = prop.name.replace(":", "_");
			var propValue = task.properties[prop.name.replace(":","_")];
			if (propValue){
				var propArray = propValue.split(";");
			}
			var html = "<button class='flow-form-node btn btn-default' type='button'>Seleziona</button>";
			html += "<input type='text' name='"+prop.name+"' style='visibility:hidden;'";
			if(prop.mandatory){
				html += " data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'";
			}
			if(prop.multiple){
				html += " data-multiple='true'";
			} else {
				html += " data-multiple='false'";
			}
			if (propValue){
				html += " value=" + propValue + "";
			}
			if(prop.selected){
				html += " data-selected='true'";
			} else {
				html += " data-selected='false'";
			}
			html += " />";
			if (!propValue){
				html += "<ul class='list-group flow-form-ul'>";
				html += "</ul>";
			}
			else{
				html += "<ul data-noderef='"+propValue+"' class='list-group flow-form-ul " + classname + "'></ul>";
				for (var i = 0; i < propArray.length; i++){
					if (propArray[i]){
						$.getJSON(Formez.doclib2_url+"node/"+propArray[i].replace("://", "/"), function(res){
							var ulEl = $("ul[data-noderef='"+propValue+"'][class='list-group flow-form-ul " + classname + "']");
							name = res.item.node.properties["cm:name"];
							ulEl.append("<li class='list-group-item'><span class='label label-primary'>"+name+"</span></li>");
						});	
					}
				}
				html += "</ul>";
			}
			
			return html;
		},
		"number": function(prop, task){
			var propValue = task.properties[prop.name.replace(":","_")];
			var html = "<input class='form-control' name='"+prop.name+"|"+prop.type+"' data-bv-integer='true'";
			if(prop.mandatory){
				html += " data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'";
			}
			if(prop.range){
				var range = prop.range.split(",");
				html += " data-bv-between='true' data-bv-between-message='Campo non valido!' data-bv-between-min='"+range[0]+"'";
				html += " data-bv-between-max='"+range[1]+"' data-bv-between-inclusive='false'";
			}
			if (propValue){
				html += " value=" +  propValue;
			}
			html +=" />";
			return html;
		},
		"select": function(prop, task){
			var html = "<select class='form-control' name='"+prop.name+"|"+prop.type+"'>";
			var choices = prop.choices.split(",");
			for(var c in choices){
				var choice = choices[c];
				var optionName, optionValue = "";
				if(choice.indexOf("|")>-1){
					var options = choice.split("|");
					optionValue = options[0];
					optionName = options[1];
				} else {
					optionValue = choice;
					optionName = choice;
				}
				html += "<option value='"+optionValue+"'>"+optionName+"</option>";
			}
			html += "</select>";
			return html;
		},
		"textarea": function(prop, task){
			var propValue = task.properties[prop.name.replace(":","_")];
			var html = "<textarea class='form-control' name='"+prop.name+"|"+prop.type+"' rows='3'";
			if(prop.mandatory){
				html += " data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'";
			}
			html +=">";
			if (propValue){
				html += propValue;
			}
			html +="</textarea>";
			return html;
		},
		"user": function(prop, task){
			var html = "<button class='flow-form-user btn btn-default' type='button'>Seleziona</button>";
			html += "<input type='text' name='"+prop.name+"' style='visibility:hidden;'";
			if(prop.mandatory){
				html += " data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'";
			}
			if(prop.multiple){
				html += " data-multiple='true'";
			} else {
				html += " data-multiple='false'";
			}
			html += " />";
			html += "<ul class='list-group flow-form-ul'></ul>";
			return html;
		},
		"view": function(prop, task){
			var html = "";
			var datatype = (prop.datatype==null ? "" : prop.datatype);  
			var propValue = task.properties[prop.name.replace(":","_")];
			if (!propValue){propValue = ""};
			var classname = prop.name.replace(":", "_");
			if(prop.name=="bpm:package"){
				html += "<ul data-noderef='"+propValue+"' class='list-group flow-form-ul " + classname + "'></ul>";
				var packageNoderef = propValue;
				$.getJSON(Formez.formez_url+"flow/package?tid="+task.id, function(res){
					var ulEl = $("ul[data-noderef='"+packageNoderef+"'][class='list-group flow-form-ul " + classname + "']");
					for(var n in res.nodes){
						ulEl.append("<li class='list-group-item'>"+res.nodes[n].name+"</li>");
					}
				});
			} else {
				var labelFlag = true;
				if(propValue!=null && (typeof propValue)=="string"){
					if(propValue.indexOf("T")>-1 && propValue.indexOf("-")>-1 && propValue.indexOf(":")>-1 || datatype == "date" || datatype == "datetime"){
						if (datatype == "date"){
							propValue = Formez.formatIsoDateWithoutHour({iso8601:propValue,value:propValue.replace("T","   ")});
						}
						else{
							propValue = Formez.formatIsoDate({iso8601:propValue,value:propValue.replace("T","   ")});
						}
					}
					else if (propValue.indexOf("workspace://SpacesStore/") >= 0){
						labelFlag = false;
						var propArray = propValue.split(";");
						html += "<ul data-noderef='"+propValue+"' class='list-group flow-form-ul " + classname + "'>";
						for (var i = 0; i < propArray.length; i++){
							if (propArray[i]){
								$.getJSON(Formez.doclib2_url+"node/"+propArray[i].replace("://", "/"), function(res){
									var ulEl = $("ul[data-noderef='"+propValue+"'][class='list-group flow-form-ul " + classname + "']");
									var name = "";
									if (res.item.node.type == "addbook:contact"){
										name = res.item.node.properties["addbook:name"];
									}
									else{
										name = res.item.node.properties["cm:name"];
									}
									ulEl.append("<li class='list-group-item'>"+name+"</li>");
								});	
							}
						}
						html += "</ul>";
					}	
				}
				
				if (labelFlag){
					html += "<label class='flow-form-view control-label'>"+propValue+"</label>";
				}
			}
			return html;
		}
	}
}
	
})();
