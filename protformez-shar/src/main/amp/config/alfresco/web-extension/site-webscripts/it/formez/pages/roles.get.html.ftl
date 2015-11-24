<#if perms.can("canAdmin")>
<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-3 col_center_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Ruoli
						<button type="button" class="btn pull-right" data-toggle="collapse" data-target="#org-collapse1">
						<i class="fa fa-plus-circle"></i>
						</button>
					</h3>
				</div>
				<div class="panel-body collapse" id="org-collapse1">
					<div class="form-horizontal" role="form">
						<div class="form-group">
							<label for="formez-role-namenew" class="control-label col-sm-2">Nome</label>
							<div class="col-sm-7">
								<input type="text" class="form-control" id="formez-role-namenew" placeholder="Nome ruolo..." onkeydown="Formez._createRole(event);" />
							</div>
							<div class="col-sm-2">
								<button class="btn btn-default" type="button" onclick="Formez._createRole();">Crea</button>
							</div>
						</div>
					</div>
				</div>
				<ul class="list-group org-roles">
				</ul>
			</div>
		</div>
		<div class="col-md-8 col_right_container">
			<div class="panel panel-default hide">
				<div class="panel-heading"><h3>Seleziona i permessi</h3>
					<div class="pull-right">
						<button class="btn btn-default" onclick="Formez._savePerms();"><i class='fa fa-save'></i> Salva permessi</button>
						<button class="btn btn-danger" onclick="Formez._deleteRole();"><i class='fa fa-times'></i> Elimina ruolo</button>
					</div>
					<div class="clearfix"></div>
				</div>
				<ul class="list-group org-permissions">
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canAdmin"></span>
							<span class="form-control">Amministratore</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolReadEnt"></span>
							<span class="form-control">Lettura protocolli in entrata</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolReadUsc"></span>
							<span class="form-control">Lettura protocolli in uscita</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolReadIn"></span>
							<span class="form-control">Lettura protocolli interni</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolCreateEnt"></span>
							<span class="form-control">Creazione protocolli in entrata</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolCreateUsc"></span>
							<span class="form-control">Creazione protocolli in uscita</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolCreateIn"></span>
							<span class="form-control">Creazione protocolli interni</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolEdit"></span>
							<span class="form-control">Modifiche alla protocollazione</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolCancel"></span>
							<span class="form-control">Annulla protocollazione</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolPrenotation"></span>
							<span class="form-control">Prenotazione protocolli</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolReport"></span>
							<span class="form-control">Generazione registri, etichette e report</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canProtocolAudit"></span>
							<span class="form-control">Consultazione Audit</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canTitolario"></span>
							<span class="form-control">Gestione Titolario</span>
						</div> <!-- /input-group -->
					</li>
					<li class="list-group-item">
						<div class="input-group">
							<span class="input-group-addon"><input type="checkbox" name="canFascicoli"></span>
							<span class="form-control">Gestione Fascicoli</span>
						</div> <!-- /input-group -->
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">
$(document).ready(function() {
	// get roles and draw
	Formez.Org.getRoles(function(roles){
		for(var r in roles){
			var role = roles[r];
			var html = "<li class='list-group-item'><a data-noderef='"+r+"' onclick='Formez._setupPerm(this);'><i class='fa fa-shield'></i> "+role.name;
			html += "<i class='fa fa-chevron-circle-right pull-right'></i></a></li>";
			$(".org-roles").append(html);
		}
	});
});
</script>
<#else>
<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-12 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
					Non hai i permessi per visualizzare questa pagina
					</h3>
				</div>
			</div>
		</div>
	</div>
</div>
</#if>