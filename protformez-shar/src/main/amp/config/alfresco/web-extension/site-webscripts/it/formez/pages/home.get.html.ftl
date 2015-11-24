<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-6 col_center_container">
			<h2 class="home-h2"><i class="fa fa-home"></i> Home</h2>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						<i class="fa fa-globe"></i> Amministrazione: <span class="formez-gov"></span>
						<#if user.isAdmin>
						<button type="button" class="btn pull-right" onclick="Formez._editGov();">
						<i class="fa fa-cog"></i>
						</button>
						</#if>
					</h3>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						<i class="fa fa-sitemap"></i> Aree Organizzative Omogenee (AOO)
						<#if user.isAdmin>
						<button type="button" class="btn pull-right" data-toggle="collapse" data-target="#aoo-collapse1">
						<i class="fa fa-plus-circle"></i>
						</button>
						</#if>
					</h3>
				</div>
				<div class="panel-body collapse" id="aoo-collapse1">
					<form class="form-horizontal" role="form">
						<div class="form-group">
							<label for="aoo-name" class="control-label col-sm-2">Nome</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" id="aoo-name" placeholder="Nome AOO..." />
							</div>
						</div>
						<div class="form-group">
							<label for="aoo-prefix" class="control-label col-sm-2">Codice</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" id="aoo-prefix" placeholder="Codice AOO..." />
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-offset-2 col-sm-10">
								<div class="alert alert-warning">
							      <strong>Attenzione!</strong> Il codice sarà usato nella segnatura di protocollo.
							      Si consiglia di usare 3 o 4 caratteri
							    </div>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-offset-2 col-sm-10">
								<button onclick="Formez._addAoo();" class="btn btn-success" type="button">Crea AOO</button>
							</div>
						</div>
					</form>
				</div>
				<ul class="list-group org-aoo">
				</ul>
				<div class="clearfix"></div>
			</div>
		</div>
	</div>
</div>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function(){
	Formez._govDetails();
	Formez._listAoo();
});
</script>