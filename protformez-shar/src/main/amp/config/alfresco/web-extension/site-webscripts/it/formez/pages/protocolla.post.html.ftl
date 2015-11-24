<form role="form" method="post"	action="/share/proxy/alfresco/formez/reg/protocol/create" id="formez-reg-new">
	<input type="hidden" name="direction" value="${page.url.args.type}" />
	<input type="hidden" name="noderef" value="${page.url.args.number!""}" />
	<div class="container-fluid formez-${page.id}" role="main">
		<div class="row">
			<div class="col-md-12 col_right_container">
				<div class="panel panel-default">
					<div class="panel-heading"><h3>Nuovo Protocollo <#if page.url.args.type="in">
					in entrata
					<#elseif page.url.args.type="out">
					in uscita
					<#elseif page.url.args.type="int">
					interno
					</#if></h3></div>
					<div class="panel-body reg-newprot-body">
						<div class="row">
							<div class="col-md-6">
								<div class="panel panel-default reg-newprot-mandatory">
									<div class="panel-heading">Oggetto</div>
									<div class="panel-body">
										<input name="subject" type="text" class="form-control" placeholder="Inserisci Oggetto" />
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-heading"><#if page.url.args.type="out">Recapito/i<#else>Consegna</#if></div>
									<div class="panel-body">
										<select	class="form-control" name="deliverymode" <#if page.url.args.type="out">multiple size="7"</#if>>
											<option value="Consegna diretta" <#if page.url.args.type="out">selected="selected"</#if>>Consegna diretta</option>
											<option value="Fax o telegramma">Fax o telegramma</option>
											<option value="E-mail convenzionale">E-mail	convenzionale</option>
											<option value="PEC">PEC</option>
											<option value="Supporto rimovibile">Supporto rimovibile</option>
											<option value="Posta convenzionale o corriere">Posta convenzionale o corriere</option>
											<option value="Posta raccomandata">Posta raccomandata</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-heading">Classificazione
										<button type="button" class="btn pull-right" onclick="Formez._addFascicoli();">
										<i class="fa fa-plus-circle"></i>
										</button>
									</div>
									<div class="panel-body">
										<input name="fascicolo" type="hidden" />
										<h4>
											<span class="label label-info">Nessuno selezionato</span>
										</h4>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-heading">Seleziona Documento
										<button type="button" class="btn pull-right" onclick="Formez._addDoc();">
										<i class="fa fa-plus-circle"></i>
										</button>
									</div>
									<div class="panel-body">
										<input name="doc" type="hidden" />
										<h4>
											<span class="label label-info">Nessuno selezionato</span>
										</h4>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-heading">Seleziona Allegato/i
										<button type="button" class="btn pull-right" onclick="Formez._addAttachs();">
										<i class="fa fa-plus-circle"></i>
										</button>
									</div>
									<div class="panel-body">
										<input name="attachs" type="hidden" />
										<h4>
											<span class="label label-info">Nessuno selezionato</span>
										</h4>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-heading">Seleziona Mittente/i
										<button type="button" class="btn pull-right" onclick="Formez._addSender();">
										<i class="fa fa-plus-circle"></i>
										</button>
									</div>
									<div class="panel-body">
										<input name="sender" type="hidden" />
										<h4>
											<span class="label label-info">Nessuno selezionato</span>
										</h4>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-heading">Seleziona Destinatario/i
										<button type="button" class="btn pull-right" onclick="Formez._addRecipient();">
										<i class="fa fa-plus-circle"></i>
										</button>
									</div>
									<div class="panel-body">
										<input name="receiver" type="hidden" />
										<h4>
											<span class="label label-info">Nessuno selezionato</span>
										</h4>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-heading">Note</div>
									<div class="panel-body">
										<textarea name="notes" class="reg-newprot-notes"></textarea>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-9">
								<div class="panel panel-default reg-newprot-adv">
									<div class="panel-heading" data-toggle="collapse" data-target="#collapseProt">
										Aggiungi Informazioni Avanzate
										<span class="pull-right"><i class="fa fa-chevron-down"></i></span>
									</div>
									<div class="panel-body collapse" id="collapseProt">
										<div class="row">
											<div class="col-md-6">
												<div class="panel panel-heading">
													Protocollo Mittente
												</div>
												<div class="panel-body">
													Numero:
													<div>
														<input type="text" class="form-control" name="mittenteprot" />
													</div>
													Data:
													<div class="input-group date">
														<input type="text" class="form-control" name="mittentedate" disabled />
														<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
													</div>
												</div>
											</div>
											<div class="col-md-6">
												<div class="panel panel-heading">
													Protocollo di Emergenza
												</div>
												<div class="panel-body">
													Numero:
													<div>
														<input type="text" class="form-control" name="sosprot" />
													</div>
													Data:
													<div class="input-group date">
														<input type="text" class="form-control" name="sosdate" disabled />
														<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-5">
								<button type="button" class="btn btn-success" onclick="Formez._newProtocol();">Protocolla</button>
								<button type="button" class="btn btn-danger" onclick="location.href='protocollo';">Annulla</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</form>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function(){
	// get protocol node for checking
	var docprot = "${page.url.args.docprot!""}";
	if(docprot!="" && docprot.length>1){
		var inputEl = $("input[name='doc']");
		inputEl.val(docprot);
		inputEl.parent().parent().find("button").remove();
		Formez.Docs.get(docprot, function(item){
			inputEl.next().remove();
			inputEl.after("<h4><span class='label label-primary'>"+item.properties["cm:name"]+"</span></h4>");
		});
	}
	var direction = "${page.url.args.type}";
	if(direction=="in"){
		$("input[name='sender']").parent().parent().addClass("reg-newprot-mandatory");
	} else if(direction=="out"){
		$("input[name='receiver']").parent().parent().addClass("reg-newprot-mandatory");
		$("input[name='doc']").parent().parent().addClass("reg-newprot-mandatory");
	}
	// add datepicker to input
	$('#collapseProt .input-group.date').datepicker({
	    format: "dd/mm/yyyy",
	    todayBtn: "linked",
	    language: "it",
	    autoclose: true,
	    todayHighlight: true,
	    weekStart: 1,
	    clearBtn: true
	});
});
</script>