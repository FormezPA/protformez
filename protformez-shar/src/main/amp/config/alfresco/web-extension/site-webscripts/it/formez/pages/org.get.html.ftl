<#if perms.can("canAdmin")>
<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-4 col_center_container hide">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="org-uo-name">
						<i class='fa fa-sitemap'></i>
						<span></span>
						<a class="btn pull-right org-uo-remove" data-toggle="popover"><i class='fa fa-times'></i></a>
						<a class="btn pull-right org-uo-move" data-toggle="popover"><i class='fa fa-share'></i></a>
						<a class="btn pull-right org-uo-rename" data-toggle="popover"><i class='fa fa-font'></i></a>
					</h3>
					<h3>Gestisci Unità Organizzativa (UO)</h3>
				</div>
				<div class="panel-body">
					<div class="form-horizontal" role="form">
						<div class="form-group">
							<div class="col-sm-9">
								<input type="text" id="formez-uo-create" class="form-control" placeholder="Nome nuova sottounità..." onkeydown="Formez._createUO(event);" />
							</div>
							<div class="col-sm-3">
								<button type="button" class="btn btn-default" onclick="Formez._createUO();"><i class="fa fa-sitemap"></i> Crea</button>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-10">
								<label for="formez-uo-alltits" class="control-label">Visibilità titolario completa</label>
								<input type="checkbox" id="formez-uo-alltits" class="form-checkbox">
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-10">
								<label for="formez-uo-inherit" class="control-label">Eredita (ruoli e voci) da sottounità</label>
								<input type="checkbox" id="formez-uo-inherit" class="form-checkbox">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Ruoli associati all'UO
						<button type="button" class="btn pull-right" data-toggle="collapse" data-target="#org-collapse1">
						<i class="fa fa-plus-circle"></i>
						</button>
					</h3>
				</div>
				<div class="panel-body collapse" id="org-collapse1">
					<form class="form-horizontal" role="form">
						<div class="form-group">
							<label for="formez-role-assign" class="control-label col-sm-2">Assegna</label>
							<div class="col-sm-10">
								<select class="form-control" id="formez-role-assign" onchange="Formez._assignRole();">
									<option value="">Seleziona Ruolo</option>
								</select>
							</div>
						</div>
					</form>
				</div>
				<ul class="list-group org-uo-roles">
				</ul>
				<div class="clearfix"></div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Utenti in questa UO
						<button type="button" class="btn pull-right" data-toggle="collapse" data-target="#org-collapse2">
						<i class="fa fa-plus-circle"></i>
						</button>
					</h3>
				</div>
				<div class="panel-body">
					<div id="org-collapse2" class="collapse">
						<div class="form-horizontal" role="form">
							<div class="form-group">
								<div class="col-sm-11">
									<div class="input-group">
										<input type="text" placeholder="Nome utente" class="form-control input-sm" id="org-user-q" onkeydown="Formez._searchUsers(true, event);">
										<span class="input-group-btn">
											<button type="button" class="btn btn-default btn-sm" onclick="Formez._searchUsers(false);"><i class="fa fa-search"></i></button>
										</span>
									</div>
								</div>
							</div>
						</div>						
						<div>
							<ul class="list-group org-users-result">
							</ul>
						</div>
					</div>
				</div>
				<ul class="list-group org-uo-users">
				</ul>
				<div class="clearfix"></div>
				<div class="org-uo-user-perms hide">
					<span class="org-uo-user-perms-name"></span>
					<ul class="list-group org-uo-user-perms-ul">
						<li class="list-group-item canAdmin"><i class="fa fa-minus"></i> <span>Amministratore</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolReadEnt"><i class="fa fa-minus"></i> <span>Lettura protocolli in entrata</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolReadUsc"><i class="fa fa-minus"></i> <span>Lettura protocolli in uscita</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolReadIn"><i class="fa fa-minus"></i> <span>Lettura protocolli interni</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolCreateEnt"><i class="fa fa-minus"></i> <span>Creazione protocolli in entrata</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolCreateUsc"><i class="fa fa-minus"></i> <span>Creazione protocolli in uscita</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolCreateIn"><i class="fa fa-minus"></i> <span>Creazione protocolli interni</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolEdit"><i class="fa fa-minus"></i> <span>Modifiche alla protocollazione</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolCancel"><i class="fa fa-minus"></i> <span>Annulla protocollazione</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolPrenotation"><i class="fa fa-minus"></i> <span>Prenotazione protocolli</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolReport"><i class="fa fa-minus"></i> <span>Generazione etichette e report</span><div class="clearfix"></div></li>
						<li class="list-group-item canProtocolAudit"><i class="fa fa-minus"></i> <span>Consultazione Audit</span><div class="clearfix"></div></li>
						<li class="list-group-item canTitolario"><i class="fa fa-minus"></i> <span>Gestione Titolario</span><div class="clearfix"></div></li>
						<li class="list-group-item canFascicoli"><i class="fa fa-minus"></i> <span>Gestione Fascicoli</span><div class="clearfix"></div></li>
					</ul>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Voci titolario associate all'UO
						<button type="button" class="btn pull-right" onclick="Formez._addTitsToUO();">
						<i class="fa fa-plus-circle"></i>
						</button>
					</h3>
				</div>
				<ul class="list-group org-uo-tits">
				</ul>
				<div class="clearfix"></div>
			</div>
		</div>
		<div class="col-md-12 col_right_container formez-org-div" id="formez-org-div">
			<div class="panel panel-default formez-org-panel">
				<div class="panel-heading"><h3>Organigramma</h3></div>
				<div class="panel-body">
					<ul id="formez-org-chart" class="hide"></ul>
					<div id="formez-org-chart-container" class="text-center">
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function() {
	Formez._setupChart(null);
	Formez.Org.getRoles(function(roles){
		for(var r in roles){
			var role = roles[r];
			var html = "<option value='"+r+"'><i class='fa fa-shield'></i> "+role.name+"</option>";
			$("#formez-role-assign").append(html);
		}
	});
	// add popover for remove and move uo
	$(".org-uo-move").popover({
		placement: "bottom",
		container: "body",
		html: true,
		title: "Sposta",
		content: function(){
			Formez._isMoveActive = true;
			$("#formez-org-chart-container").addClass("org-chart-move");
			var html = "<b>Seleziona l'UO in cui vuoi spostare '"+Formez.Org.getUo(Formez._currentUO).name+"'</b><br/>";
			html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
			return html;
		}
	}).on("hide.bs.popover", function(){
		Formez._isMoveActive = false;
		$("#formez-org-chart-container").removeClass("org-chart-move");
	});
	$(".org-uo-remove").popover({
		placement: "bottom",
		container: "body",
		selector: true,
		html: true,
		title: "Elimina",
		content: function(){
			var html = "<b>L'UO sarà rimossa definitivamente!</b><br/>";
			html += "<button class='btn btn-success' onclick='Formez._removeUO();'>Elimina</button>";
			html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
			return html;
		}
	});
	$(".org-uo-rename").popover({
		placement: "bottom",
		container: "body",
		selector: true,
		html: true,
		title: "Rinomina",
		content: function(){
			var html = "<b>Inserisci il nuovo nome</b><br/>";
			html += "<input class='form-control org-uo-rename-value' value='"+Formez.Org.getUo(Formez._currentUO).name+"' /><br/>";
			html += "<button class='btn btn-success' onclick='Formez._renameUO();'>Conferma</button>";
			html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
			return html;
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