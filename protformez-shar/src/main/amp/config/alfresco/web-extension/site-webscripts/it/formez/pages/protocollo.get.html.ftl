<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-3 col_center_container">
			<#if perms.can("canProtocolCreateEnt") || perms.can("canProtocolCreateUsc") || perms.can("canProtocolCreateIn")>
			<div class="panel panel-default">
				<div class="panel-heading"><h3>Nuova Protocollazione</h3></div>
				<div class="panel-body reg-new-prot-buttons">
					<#if perms.can("canProtocolCreateEnt")>
					<button class="btn" onclick='Formez._newProtocol("in");'><i class="reg-dir fa fa-arrow-circle-left"></i> In Entrata</button>
					</#if>
					<#if perms.can("canProtocolCreateUsc")>
					<button class="btn" onclick='Formez._newProtocol("out");'><i class="reg-dir fa fa-arrow-circle-right"></i> In Uscita</button>
					</#if>
					<#if perms.can("canProtocolCreateIn")>
					<button class="btn" onclick='Formez._newProtocol("int");'><i class="reg-dir fa fa-arrow-circle-down"></i> Interno</button>
					</#if>
				</div>
			</div>
			</#if>
			<#if perms.can("canProtocolPrenotation") || perms.can("canProtocolEdit") || perms.can("canProtocolReport")>
			<div class="panel panel-default">
				<div class="panel-heading"><h3>Azioni</h3></div>
				<ul class="list-group">
					<#if perms.can("canProtocolPrenotation")>
					<#if perms.can("canProtocolCreateEnt") || perms.can("canProtocolCreateUsc") || perms.can("canProtocolCreateIn")>
					<li class="list-group-item reg-prenotation" data-toggle="popover" data-container=".formez-protocollo">
						<a>Prenota Protocolli<i class="fa fa-chevron-circle-right pull-right"></i></a>
					</li>
					</#if>
					</#if>
					<#if perms.can("canProtocolEdit")>
					<li class="list-group-item" onclick="Formez._assocsProt();">
						<a>Associa Documenti<i class="fa fa-chevron-circle-right pull-right"></i></a>
					</li>
					</#if>
					<#if perms.can("canProtocolReport")>
					<li class="list-group-item reg-dailyregistry" data-toggle="popover" data-container="body">
						<a>Registro Giornaliero<i class="fa fa-calendar-o pull-right"></i></a>
					</li>
					</#if>
				</ul>
				<div class="clearfix"></div>
			</div>
			</#if>
		</div>
		<div class="col-md-9 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading"><h3>Lista Protocolli</h3></div>
				<div class="panel-body">
					<div class="input-group reg-tab-actions">
						<button onclick="Formez._regFilters();" class="btn btn-default"><i class="fa fa-chevron-down"></i> Filtri</button>
						<#if perms.can("canProtocolReport")>
						<button onclick="Formez._printProtocol();" class="btn btn-default"><i class="fa fa-print"></i> Stampa</button>
						</#if>
						<button onclick="Formez._updateProtocols();" class="btn btn-default"><i class="fa fa-refresh"></i> Aggiorna Lista</button>
					</div>
					<div class="reg-advsearch hide">
						<form class="form-horizontal" role="form">
							<div class="form-group">
								<div class="col-md-3">
							    	<label class="control-label">Numero</label>
							    	<input type="text" class="form-control reg-search-number" />
							    </div>
							    <div class="col-md-3">
							    	<label class="control-label">Oggetto</label>
							    	<input type="text" class="form-control reg-search-subject" />
							    </div>
							    <div class="col-md-3">
							    	<label class="control-label">Fascicolo</label>
							    	<div><a class="btn btn-default" onclick="Formez._filterFiling(this);">Nessuno</a></div>
							    	<input type="hidden" class="reg-search-filing" />
							    </div>
							</div>
							<div class="form-group">
							    <div class="col-md-3">
							    	<label class="control-label">Stato</label>
							    	<select class="form-control reg-search-stato">
							    		<option value="">Qualsiasi</option>
							    		<option value="Protocollato">Protocollato</option>
							    		<option value="Annullato">Annullato</option>
							    		<option value="Prenotato">Prenotato</option>
							    	</select>
							    </div>
							    <div class="col-md-3">
							    	<label class="control-label">Data</label>
							        <div class="input-daterange input-group">
								    	<input type="text" class="input-md form-control reg-search-from" placeholder="Da..." />
								    	<span class="input-group-addon">...</span>
								    	<input type="text" class="input-md form-control reg-search-to" placeholder="A..." />
								    </div>
							    </div>
							    <div class="col-md-3">
									<label class="control-label">Direzione</label><br/>
									<div class="btn-group reg-search-dir" data-toggle='buttons'>
										<label data-dir='' class='btn btn-primary' title='Tutte le direzioni'>
											<input type='radio' name='options'><i class='fa fa-circle'></i>
										</label>
										<label data-dir='in' class='btn btn-primary' title='In Entrata'>
											<input type='radio' name='options'><i class='reg-dir fa fa-arrow-circle-left'></i>
										</label>
										<label data-dir='out' class='btn btn-primary' title='In Uscita'>
											<input type='radio' name='options'><i class='reg-dir fa fa-arrow-circle-right'></i>
										</label>
										<label data-dir='int' class='btn btn-primary' title='Interno'>
											<input type='radio' name='options'><i class='reg-dir fa fa-arrow-circle-down'></i>
										</label>
								    </div>
							    </div>
							</div>
							<div class="form-group">
								<div class="col-md-12">
							    	<a onclick="Formez._resetFilters();" class="btn btn-default"><i class="fa fa-times-circle"></i> Reset</a>
							    	<a onclick="Formez._updateProtocols();" class="btn btn-default"><i class="fa fa-search"></i> Cerca</a>
							    	<span>&nbsp;&nbsp;&nbsp;* il filtro "Fascicolo" annulla gli altri filtri se attivo</span>
							    </div>
							</div>
						</form>
					</div>
					<div class="table-responsive" style="margin-top: 20px;">
						<table class="table table-bordered" id="reg-list">
						</table>
						<ul class="pager">
							<li><a onclick="Formez._prevProtocols();">Precedenti</a></li>
							<li><a onclick="Formez._nextProtocols();">Successivi</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function(){
	Formez._resetFilters();
	// setup popover
	$(".reg-prenotation").popover({
		placement: "right",
		html: true,
		content: function(){
			var html = "<div data-toggle='buttons' class='btn-group reg-prenotation-dir' style='margin:0 0 10px 0;'>";
			<#if perms.can("canProtocolCreateEnt")>
			html += "<label data-dir='in' class='btn btn-primary'><input type='radio' name='options'><i class='reg-dir fa fa-arrow-circle-left'></i></label>";
			</#if>
			<#if perms.can("canProtocolCreateUsc")>
			html += "<label data-dir='out' class='btn btn-primary'><input type='radio' name='options'><i class='reg-dir fa fa-arrow-circle-right'></i></label>";
			</#if>
			<#if perms.can("canProtocolCreateIn")>
			html += "<label data-dir='int' class='btn btn-primary'><input type='radio' name='options'><i class='reg-dir fa fa-arrow-circle-down'></i></label>";
			</#if>
			html += "</div><div class='input-group'>";
			html += "<input placeholder='Quantità...' type='text' class='form-control reg-prenotation-number' onkeydown='Formez._protPrenotation(event);' /><span class='input-group-btn'>";
			html += "<button class='btn btn-success' type='button' onclick='Formez._protPrenotation();'><i class='fa fa-hand-o-up'></i> Prenota</button></span></div>";
			return html;
		}
	});
	$(".reg-dailyregistry").popover({
		placement: "right",
		html: true,
		title: "Scegli data...",
		content: function(){
			var html = "<div class='input-group reg-dailyregistry-cal'><span class='input-group-addon'><a onclick='$(this).parent().next().focus();'>";
			html += "<i class='glyphicon glyphicon-th'></i></a></span><input type='text' class='form-control' placeholder='Data...'>";
			html += "<span class='input-group-addon'><a onclick='Formez._printDailyProtocol();'><i class='fa fa-print'></i></a></span></div>";
			html += "<div class='reg-dailyregistry-history'><h3 class='popover-title'>Storico</h3><ul class='list-group'>";
			html += "<li class='list-group-item'>Scegli data...</li></ul></div>";
			return html;
		}
	}).on("shown.bs.popover", function(){
		$('.reg-dailyregistry-cal input').datepicker({
	    	format: "dd/mm/yyyy",
		    todayBtn: "linked",
		    language: "it",
		    autoclose: true,
		    todayHighlight: true,
		    weekStart: 1
	    }).on("changeDate",function(){
	    	var ulEl = $('.reg-dailyregistry-history ul');
	    	ulEl.empty();
	    	var dateval = $('.reg-dailyregistry-cal input').val();
	    	Formez.Protocol.dailyHistory(dateval, function(res){
	    		if(res.total>0){
	    			for(var d in res.docs){
	    				var doc = res.docs[d];
	    				var uri = Formez.alf_url+"api/node/content/"+doc.noderef.replace(":/","")+"/registro-"+dateval.replace(/\//g,"-")+".pdf?a=true";
	    				ulEl.append("<li class='list-group-item have-cursor-pointer'><a target='_blank' href='"+uri+"'>"+
	    						Formez.Docs.icon("a.pdf")+"Creato il "+doc.date+"</a></li>");
	    			}
	    		} else {
	    			ulEl.append("<li class='list-group-item'>Nessun elemento...</li>");
	    		}
	    	});
	    });
	});
	// setup datepicker
    $('.reg-advsearch .input-daterange').datepicker({
    	format: "dd/mm/yyyy",
	    todayBtn: "linked",
	    language: "it",
	    autoclose: true,
	    todayHighlight: true,
	    weekStart: 1
    });
});
</script>