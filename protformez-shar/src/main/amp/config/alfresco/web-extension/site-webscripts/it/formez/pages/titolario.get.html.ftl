<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-7 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						<#if page.url.args.user??>
						I miei documenti
						<#elseif page.url.args.shared??>
						Documenti condivisi
						<#elseif page.url.args.cos??>
						Conservazione Sostitutiva
						<#else>
						Titolario
						</#if>
					</h3>
				</div>
				<div class="panel-body">
					<div class="btn-group pull-right" data-toggle="buttons">
						<label class="btn btn-primary active" onclick="$('.tit-doclib').removeClass('tit-view-th');">
							<input type="radio" name="options"><i class="fa fa-bars"></i>
						</label>
						<label class="btn btn-primary" onclick="$('.tit-doclib').addClass('tit-view-th');">
							<input type="radio" name="options"><i class="fa fa-th"></i>
						</label>
					</div>
					<ul class="list-group tit-breadcrumb">
					</ul>
				</div>
				<ul class="list-group tit-doclib">
				</ul>
			</div>
		</div>
		<div class="col-md-5 col_option_container">
			<div class="panel panel-default">
				<div class="panel-heading">Ricerca</div>
				<div class="panel-body tit-search">
					<div class="input-group">
						<input type="text" onkeydown="Formez._searchFts(true, event);" id="tit-fts-q" class="form-control input-sm" placeholder="Cerca ovunque...">
						<span class="input-group-btn">
							<button onclick="Formez._searchFts(false);" class="btn btn-default btn-sm" type="button"><i class="fa fa-search"></i></button>
							<button onclick="Formez._resetSearch();" class="btn btn-default btn-sm" type="button"><i class="fa fa-times"></i> Reset</button>
						</span>
					</div>
				</div>
				<div class="panel-heading">Azioni</div>
				<div class="panel-body tit-actions">
					<!-- div for upload plugin -->
					<div class="hide tit-action-input">
						<div class="tit-action-input-ajax"></div>
					</div>
					<!-- action to see after search -->
					<button type="button" class="btn tit-action tit-action-gotonode hide" onclick="Formez._gotoNode();"><i class='fa fa-arrow-right'></i> Vai</button>
					<!-- action for upload -->
					<button type="button" class="btn tit-action tit-action-upload hide" onclick="$('.tit-action-input input').click();"><i class='fa fa-upload'></i> Carica da File</button>
					<button type="button" class="btn tit-action tit-action-upload hide" onclick="Formez._setupScan();"><i class='fa fa-print'></i> Acquisisci da Scanner</button>
					<!-- generic folder actions -->
					<button type="button" class="btn tit-action tit-action-newfolder hide" data-toggle="popover"><i class='fa fa-folder'></i> Crea cartella</button>
					<!-- document actions -->
					<button type="button" class="btn tit-action tit-action-download hide" onclick="Formez.Docs.Actions.download(Formez.Docs.currentDoc);"><i class='fa fa-download'></i> Download</button>
					<button type="button" class="btn tit-action tit-action-preview hide" onclick="Formez._showDoc();"><i class='fa fa-eye'></i> Anteprima</button>
					<button type="button" class="btn tit-action tit-action-rename hide" data-toggle="popover"><i class='fa fa-edit'></i> Rinomina</button>
					<button type="button" class="btn tit-action tit-action-copy hide" onclick="Formez._copyNode();"><i class='fa fa-copy'></i> Copia</button>
					<button type="button" class="btn tit-action tit-action-move hide" onclick="Formez._moveNode();"><i class='fa fa-cut'></i> Sposta</button>
					<button type="button" class="btn tit-action tit-action-topdfa hide" onclick="Formez._nodeToPdfa();"><i class='fa fa-file-pdf-o'></i> Converti in PDF/A</button>
					<button type="button" class="btn tit-action tit-action-sign hide" onclick="Formez._signDoc();"><i class='fa fa-pencil'></i> Firma</button>
					<#if cfg.get().ldi>
					<button type="button" class="btn tit-action tit-action-ldi hide" onclick="Formez._conservaDocLdi();"><i class='fa fa-university'></i> Conserva in Legaldoc</button>
					</#if>
					<#if cfg.get().modules.flow>
					<button type="button" class="btn tit-action tit-action-startwf hide" data-toggle="popover"><i class='fa fa-refresh'></i> Avvia Processo</button>
					</#if>
					<button type="button" class="btn tit-action tit-action-coscount hide" onclick="Formez._setCosCounter();"><i class='fa fa-university'></i> Progressivo Conservazione</button>
					<button type="button" class="btn tit-action tit-action-delete hide" data-toggle="popover"><i class='fa fa-times'></i> Elimina</button>
					<!-- folder actions -->
					<!-- cos -->
					<button type="button" class="btn tit-action tit-action-addclasse hide" data-toggle="popover"><i class='fa fa-book'></i> Aggiungi Classe</button>
					<button type="button" class="btn tit-action tit-action-newsez hide" data-toggle="popover"><i class='fa fa-folder'></i> Crea Sezionale</button>
					<button type="button" class="btn tit-action tit-action-newlotto hide" data-toggle="popover"><i class='fa fa-book'></i> Crea Lotto</button>
					<button type="button" class="btn tit-action tit-action-closelotto hide" onclick="Formez._closeLotto();"><i class='fa fa-lock'></i> Chiudi Lotto</button>
					<!-- reg -->
					<#if perms.can("canTitolario")>
					<button type="button" class="btn tit-action tit-action-newtitolo hide" data-toggle="popover"><i class='fa fa-folder'></i> Crea Titolo</button>
					<button type="button" class="btn tit-action tit-action-newclasse hide" data-toggle="popover"><i class='fa fa-folder'></i> Crea Classe</button>
					<button type="button" class="btn tit-action tit-action-importtit hide" onclick="Formez._titImport();"><i class='fa fa-archive'></i> Importa Titolario</button>
					</#if>
					<#if perms.can("canFascicoli")>
					<button type="button" class="btn tit-action tit-action-newfascic hide" data-toggle="popover"><i class='fa fa-folder'></i> Crea Fascicolo</button>
					<button type="button" class="btn tit-action tit-action-closefasc hide" onclick="Formez._fascState();"><i class='fa fa-lock'></i> Chiudi Fascicolo</button>
					<button type="button" class="btn tit-action tit-action-openfasc hide" onclick="Formez._fascState();"><i class='fa fa-unlock-alt'></i> Apri Fascicolo</button>
					</#if>
					<#if perms.can("canTitolario") || perms.can("canFascicoli")>
					<button type="button" class="btn tit-action tit-action-renametit hide" data-toggle="popover"><i class='fa fa-edit'></i> Rinomina</button>
					<button type="button" class="btn tit-action tit-action-historify hide" data-toggle="popover"><i class='fa fa-times'></i> Elimina (Storicizza)</button>
					</#if>
				</div>
				<div class="panel-heading">Dettagli</div>
				<ul class="list-group tit-details">
				</ul>
			</div>
		</div>
	</div>
</div>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function(){
	<#if page.url.args.user??>
	Formez.Docs.getUserHome(function(doclib){
		Formez.Docs.rootName = "I miei documenti";
		Formez.Docs.mode = "user";
	<#elseif page.url.args.shared??>
	Formez.Docs.getContainer("shared", function(doclib){
		Formez.Docs.rootName = "Documenti condivisi";
		Formez.Docs.mode = "shared";
	<#elseif page.url.args.cos??>
	Formez.Docs.getContainer("cos", function(doclib){
		Formez.Docs.rootName = "Conservazione sostitutiva";
		Formez.Docs.mode = "cos";
		Formez._cosMode = true;
	<#else>
	Formez.Docs.getContainer("documentLibrary", function(doclib){
		Formez.Docs.rootName = "Archivio";
		Formez.Docs.mode = "doclib";
	</#if>
		Formez.Docs.root = doclib.nodeRef;
		Formez.Docs.docs[doclib.nodeRef].properties["cm:name"] = Formez.Docs.rootName;
		<#if page.url.args.noderef??>
		Formez._gotoNode("${page.url.args.noderef}");
		<#else>
		Formez._doclibNext("<span data-noderef='"+doclib.nodeRef+"'></span>");
		</#if>
	});
	Formez._setupActions();
});
</script>