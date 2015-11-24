<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-4 col_center_container">
			<#if perms.can("canAdmin")>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Cerca Audit Protocollo
					</h3>
				</div>
				<div class="panel-body">
					<div class="form-horizontal" role="form">
						<div class="form-group">
							<div class="col-sm-9">
								<input type="text" placeholder="Oggetto o numero di protocollo..." class="form-control" id="audit-reg-filter">
							</div>
							<div class="col-sm-3">
								<button onclick="Formez._auditReg();" class="btn btn-default" type="button"><i class="fa fa-search"></i> Cerca</button>
							</div>
						</div>
					</div>
				</div>
				<ul class="audit-reg-results list-group"></ul>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Cerca Audit Titolario
					</h3>
				</div>
				<div class="panel-body">
					<div class="form-horizontal" role="form">
						<div class="form-group">
							<div class="col-sm-9">
								<input type="text" placeholder="Nome voce titolario..." class="form-control" id="audit-tit-filter">
							</div>
							<div class="col-sm-3">
								<button onclick="Formez._auditTit();" class="btn btn-default" type="button"><i class="fa fa-search"></i> Cerca</button>
							</div>
						</div>
					</div>
				</div>
				<ul class="audit-tit-results list-group"></ul>
			</div>
			</#if>
		</div>
		<div class="col-md-8 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Audit <span class="audit-selected-name"></span>
					</h3>
				</div>
				<div class="panel-body">
					<div class="timeline-wrapper">
						<div class="timeline-item timeline-start">
							<div class="panel">
								<div class="panel-body text-center">
									<div class="timeline-icon">
										<i class="fa fa-bell"></i>
									</div>
									<strong>Start</strong>
								</div>
							</div>
						</div>
						<div class="timeline-item clearfix">
							<div class="timeline-info">
								<div class="timeline-icon">
									<i class="fa fa-minus-circle"></i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="audit-timeline-template hide">
	<div class="timeline-item timeline-item-runtime">
		<div class="timeline-info">
			<div class="timeline-icon"><i class="fa fa-comment"></i></div>
			<div class="time"></div>
		</div>
		<div class="panel panel-default timeline-panel">
			<div class="panel-heading">
				<span></span>
				<small class="pull-right"><i class="fa fa-user"></i></small>
			</div>
			<div class="panel-body">
				<p></p>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">
$(document).ready(function(){
	<#if page.url.args.noderef??>
	// mostro l'audit del
	Formez._showAudit("<span data-noderef='${page.url.args.noderef}'></span>");
	</#if>
});
</script>