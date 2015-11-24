<#if perms.can("canAdmin")>
<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-12 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						Impostazioni Area Organizzativa Omogenea
					</h3>
				</div>
				<div class="panel-body cfg-panels">
					<div class="row">
						<div class="col-md-4">
							<div class="panel panel-default cfg-aoo-panel">
								<div class="panel-heading">
									Configurazione AOO
								</div>
								<div class="panel-body">
									<i>Configura l'Area Organizzativa Omogenea: rinominala, se necessario, e impostane l'indirizzo ed i recapiti.</i><br/>
									<button class="btn btn-success btn-sm pull-right" type="button" onclick="Formez._editAOO();">
										<i class="fa fa-edit"></i> Configura
									</button>
								</div>
								<div class="panel-footer"></div>
							</div>
							<#if cfg.get().modules.pec>
							<div class="panel panel-default cfg-pec-panel">
								<div class="panel-heading">
									Account email/PEC
									<button type="button" class="btn btn-default pull-right" onclick="Formez._createPecAccount();">
									<i class="fa fa-plus-circle"></i> Nuovo
									</button>
								</div>
								<div class="panel-body">
									<i>Aggiungi gli account email/PEC.<br/>
									Avrai bisogno delle impostazioni POP/IMAP e SMTP del provider.</i>
								</div>
								<ul class="list-group cfg-pec-accounts"></ul>
							</div>
							</#if>
						</div>
						<#if cfg.get().modules.cos>
						<div class="col-md-4">
							<div class="panel panel-default cfg-cos-panel">
								<div class="panel-heading">
									Conservazione Sostitutiva
								</div>
								<div class="panel-body">
									<i>Scegli le tipologie documentali da conservare. Per ognuna potrai scegliere, se lo vorrai,
									un periodo di tempo dopo il quale il lotto verrà automaticamente chiuso.<br/>
									Imposta inoltre i tuoi parametri del provider di marche temporali e il responsabile della conservazione.</i><br/><br/>
									<button class="btn btn-success btn-sm pull-right" type="button" onclick="Formez._cosRespChoose();">
										<i class="fa fa-user"></i> Responsabile
									</button>
									<button class="btn btn-success btn-sm pull-right" type="button" onclick="Formez._cosMarkSettings();">
										<i class="fa fa-legal"></i> Marca Temporale
									</button>
								</div>
								<div class="panel-footer">
									<b>Attuale Responsabile:</b> <i class="cfg-cos-resp"></i>
								</div>
							</div>
						</div>
						</#if>
						<div class="col-md-4">
							<#if cfg.get().modules.h2h>
							<div class="panel panel-default cfg-h2h-panel">
								<div class="panel-heading">
									Account Servizi Postali H2H
									<div class="pull-right">
									<input type="checkbox" class="form-control" <#if cfg.get().h2h>checked="checked"</#if>> 
									</div>
								</div>
								<div class="panel-body">
									<i>Attiva questo servizio se vuoi usare i servizi postali (raccomandate, lettere, telegrammi).<br/>
									In tal caso, ricorda di configurarne le impostazioni.</i><br/>
									<button class="btn btn-success btn-sm pull-right" type="button" onclick="Formez._h2hSettings();">
										<i class="fa fa-edit"></i> Configura
									</button>
								</div>
							</div>
							</#if>
							<#if cfg.get().modules.ldi>
							<div class="panel panel-default cfg-ldi-panel">
								<div class="panel-heading">
									Account Infocert LegalDoc
									<div class="pull-right">
									<input type="checkbox" class="form-control" <#if cfg.get().ldi>checked="checked"</#if>> 
									</div>
								</div>
								<div class="panel-body">
									<i>Attiva questo servizio se vuoi usare "LegalDoc", il servizio di consevazione sostitutiva di Infocert.<br/>
									In tal caso, ricorda di configurarne le impostazioni.</i><br/>
									<button class="btn btn-success btn-sm pull-right" type="button" onclick="Formez._ldiSettings();">
										<i class="fa fa-edit"></i> Configura
									</button>
									<div class="clearfix"></div>
								</div>
								<div class="panel-footer">
									<i>Per usare il servizio, oltre alle impostazioni, devi scegliere le tipologie documentali da conservare.</i><br/>
									<div class="cfg-ldi-nowtypes"></div>
									<button class="btn btn-success btn-sm pull-right" type="button" onclick="Formez._ldiTypeSettings();">
										<i class="fa fa-file"></i> Tipi Documenti
									</button>
									<div class="clearfix"></div>
								</div>
								<ul class="list-group cfg-ldi-types"></ul>
							</div>
							</#if>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function(){
	// draw initial configuration
	Formez._drawAooConfiguration();
	Formez._drawPecConfiguration();
	Formez._drawH2hConfiguration();
	Formez._drawLdiConfiguration();
	Formez._drawLdiTypesConfiguration();
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
