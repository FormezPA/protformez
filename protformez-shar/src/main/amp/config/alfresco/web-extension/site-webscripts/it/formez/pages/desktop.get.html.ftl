<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-12 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Benvenuto in ${msg("formez.title")}
					</h3>
				</div>
				<div class="panel-body">
					<div class="row desktop-dashlets">
						<div class="col-md-4">
							<div class="panel panel-default">
								<div class="panel-heading"><i class='fa fa-tag'></i> Protocolli Assegnati</div>
								<ul class="list-group desktop-protocol"></ul>
							</div>
						</div>
						<#if cfg.get().modules.flow>
						<div class="col-md-4">
							<div class="panel panel-default">
								<div class="panel-heading"><i class='fa fa-refresh'></i> I tuoi compiti</div>
								<ul class="list-group desktop-task"></ul>
							</div>
						</div>
						</#if>
						<#if cfg.get().modules.pec>
						<div class="col-md-4">
							<div class="panel panel-default">
								<div class="panel-heading"><i class='fa fa-envelope'></i> Ultime PEC/Email</div>
								<ul class="list-group desktop-mail"></ul>
							</div>
						</div>
						</#if>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function(){
	// assigned protocols, tasks and last email
	Formez._assignedProtocols();
	<#if cfg.get().modules.flow>
	Formez._assignedTasks();
	</#if>
	<#if cfg.get().modules.pec>
	Formez._lastEmails();
	</#if>
});
</script>