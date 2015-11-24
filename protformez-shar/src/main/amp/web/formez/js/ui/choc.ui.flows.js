/**
 * Formez @UI Module
 * @namespace Formez
*/

(function(){
	
/**
 * @UI module (appending to Formez general object)
 */
$.extend(Formez, {
	// draw tasks
	_drawTasks: function(){
		var tasksEl = $(".flow-tasks");
		tasksEl.empty();
		Formez.Flow.getTasks(function(tasks){
			if(tasks.length>0){
				for(var t in tasks){
					var task = tasks[t];
					tasksEl.append("<li class='list-group-item'><a onclick='Formez._drawTaskForm(\""+task.id+"\");'>"+ task.title +
							"<i class='fa fa-chevron-circle-right pull-right'></i></a></li>");
				}
			} else {
				tasksEl.append("<li class='list-group-item'><a>Nessun task assegnato...</a></li>");
			}
		});
	},
	// draw workflow
	_drawFlows: function(){
		var flowsEl = $(".flow-list");
		flowsEl.empty();
		Formez.Flow.getWorkflows(function(flows){
			if(flows.length>0){
				flowsEl.append("<option selected value=''>Seleziona un workflow...</option>");
				for(var f in flows){
					var flow = flows[f];
					flowsEl.append("<option value='"+flow.id+"'>"+flow.title+"</option>");
				}
			} else {
				flowsEl.append("<option value=''>Nessun workflow disponibile</option>");
			}
		});
	},
	// draw start form
	_drawFlowForm: function(wparam, nparam){
		var wid = "";
		if(wparam){
			wid = wparam;
		} else {
			wid = $(".flow-list").val();
		}
		if(wid!=""){
			// get wf def
			Formez.Flow.getWorkflow(wid, function(wf){
				Formez.Flow.getTask(wf.startTaskDefinitionType, function(task){
					Formez.Flow.draw($(".flow-form"), wf.name, task, null, nparam);
				});
			});
			$(".flow-list").val("");
		}
	},
	// draw start form
	_drawTaskForm: function(tid){
		Formez.Flow.getTaskInstance(tid, function(task){
			Formez.Flow.draw($(".flow-form"), null, task, true);
		});
	},
	// start flow
	_startFlow: function(){
		var formEl = $(".flow-form");
		formEl.data('bootstrapValidator').validate();
		if(formEl.data('bootstrapValidator').isValid()){
			Formez.wait("Avvio del processo in corso...");
			Formez.Flow.start(formEl.serialize(), function(res){
				Formez.waitOff();
				if(res.success){
					Formez.poptime("Processo avviato con successo!");
					formEl.removeData('bootstrapValidator');
					formEl.empty();
					Formez._drawTasks();
				} else {
					alert("Errore imprevisto!");
					location.reload();
				}
			});
		}
	},
	// start flow
	_stepFlow: function(p, value){
		var formEl = $(".flow-form");
		formEl.data('bootstrapValidator').validate();
		if(formEl.data('bootstrapValidator').isValid()){
			Formez.wait("Avanzamento processo in corso...");
			var data = formEl.serialize();
			if(data.length>0){
				data += "&";
			}
			data += p+"|string="+value;
			Formez.Flow.step(data, function(res){
				Formez.waitOff();
				if(res.success){
					Formez.poptime("Processo avanzato con successo!");
					formEl.removeData('bootstrapValidator');
					formEl.empty();
					Formez._drawTasks();
				} else {
					alert("Errore imprevisto!");
					location.reload();
				}
			});
		}
	}
});
	
})();
