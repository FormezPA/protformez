<#if cfg.get().modules.flow>
<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-3 col_center_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Nuovo Processo
					</h3>
				</div>
				<div class="panel-body">
					<select class="form-control flow-list" onchange="Formez._drawFlowForm();">
						<option value="-">Caricamento processi...</option>
					</select>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						I tuoi compiti
					</h3>
				</div>
				<ul class="list-group flow-tasks">
				</ul>
				<div class="clearfix"></div>
			</div>
		</div>
		<div class="col-md-9 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Processo
					</h3>
				</div>
				<div class="panel-body">
					<form role="form" class="form-horizontal flow-form">
						Crea un nuovo processo o seleziona un compito...
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function(){
	// draw process list and tasks list
	Formez._drawTasks();
	Formez._drawFlows();
	<#if page.url.args.task??>
	// draw task
	Formez._drawTaskForm("${page.url.args.task}");
	<#elseif page.url.args.flow?? && page.url.args.noderef??>
	// draw flow
	Formez._drawFlowForm("${page.url.args.flow}","${page.url.args.noderef}");
	</#if>
});
</script>
<#else>
<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-12 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
					Il modulo "Processi" non è attivo!
					</h3>
				</div>
			</div>
		</div>
	</div>
</div>
</#if>