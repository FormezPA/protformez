<#if cfg.get().modules.pec && (cfg.get().pec>0)>
<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-3 col_center_container">
			<div class="panel panel-default hide">
				<div class="panel-heading">
					<h3 class="pec-account-h3">
					</h3>
				</div>
				<ul class="list-group pec-folders">
					<li class='list-group-item pec-folder-inbox'><a onclick="Formez._gotoInbox();"><i class="fa fa-inbox"></i> Posta in arrivo<span class="badge pull-right pec-number-newmail">0</span></a></li>
					<li class='list-group-item pec-folder-sent'><a onclick="Formez._gotoSent();"><i class="fa fa-envelope"></i> Posta inviata</a></li>
					<li class='list-group-item pec-folder-star'><a onclick="Formez._gotoStarred();"><i class="fa fa-star"></i> Preferiti</a></li>
				</ul>
				<div class="clearfix"></div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>Accounts</h3>
				</div>
				<ul class="list-group pec-accounts">
				</ul>
				<div class="clearfix"></div>
			</div>
		</div>
		<div class="col-md-9 col_right_container pec-mail-list hide">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3><i class='fa fa-inbox'></i> Posta in arrivo</h3>
				</div>
				<div class="panel-body form-horizontal">
					<div class="form-group has-feedback">
						<div class="col-md-6">
							<input type="text" placeholder="Cerca nelle email..." class="form-control" />
      						<a><span class="glyphicon glyphicon-search form-control-feedback"></span></a>
						</div>
						<div id="pec-actions" class="col-md-5">
							<a class="btn btn-sm btn-success pec-new-mail" onclick="Formez._sendMail('new');"><i class="fa fa-pencil"></i> Nuova mail</a>
							<a class="btn btn-sm btn-danger pec-delete-mail" data-container="body" data-toggle="popover"><i class="fa fa-trash-o"></i> Cancella</a>
						</div>
					</div>
				</div>
				<table id="pec-list" class="table table-condensed">
				</table>
				<ul class="pager">
					<li><a onclick="Formez._prevEmail();">Precedenti</a></li>
					<li><a onclick="Formez._nextEmail();">Successive</a></li>
				</ul>
			</div>
		</div>
		<div class="col-md-9 col_right_container pec-mail-body" style="display:none;">
			<div class="panel panel-default">
				<div class="panel-body">
					<div class="mail-actions">
						<a class="btn btn-sm btn-default" onclick="Formez._hideEmail();"><i class="fa fa-arrow-left"></i> Indietro</a>
						<span class="mail-actions-divider"></span>
						<a class="btn btn-sm btn-default" onclick="Formez._sendMail('reply');"><i class="fa fa-mail-reply"></i> Rispondi</a>
						<a class="btn btn-sm btn-default" onclick="Formez._sendMail('replyall');"><i class="fa fa-mail-reply-all"></i> Rispondi a tutti</a>
						<a class="btn btn-sm btn-default" onclick="Formez._sendMail('forward');"><i class="fa fa-mail-forward"></i> Inoltra</a>
						<span class="mail-actions-divider"></span>
						<a class="btn btn-sm btn-default" data-container="body" data-toggle="popover"><i class="fa fa-tag"></i> Protocolla</a>
						<a class="btn btn-sm btn-default" onclick="Formez.Pec.download(Formez.Pec.email);"><i class="fa fa-download"></i> Scarica</a>
						<a class="btn btn-sm btn-default" onclick="Formez.Pec.print(Formez.Pec.email);"><i class="fa fa-print"></i> Stampa</a>
					</div>
					<div class="mail-headers">
						<h3 class="mail-headers-title">
							Oggetto: <strong><span id="mail-headers-subject"></span></strong>
						</h3>
						<div class="mail-headers-recipients">
							<i class="fa fa-user"></i> da: <strong><span id="mail-headers-from"></span></strong>
							<ul>
								<li><i class="fa fa-envelope-o"></i> a: <span id="mail-headers-to"></span></li>
								<li><i class="fa fa-envelope-o"></i> cc: <span id="mail-headers-cc"></span></li>
								<li><i class="fa fa-envelope-o"></i> bcc: <span id="mail-headers-bcc"></span></li>
							</ul>
							<div class="clearfix"></div>
						</div>
						<div class="mail-dates">
							<i class="fa fa-calendar"></i> Ricevuta il: <strong><span id="mail-date"></span></strong>
						</div>
					</div>
					<div id="mail-body">
					</div>
					<div id="mail-attachs">
						<ul>
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
	Formez.Pec.getAccounts(function(){
		// fill account list
		Formez._drawPecAccounts();
		// get current account
		Formez.Pec.account = "${page.url.args.noderef!""}";
		if(Formez.Pec.account!=""){
			// remove class hide
			$(".pec-folders").parent().removeClass("hide");
			$(".pec-mail-list").removeClass("hide");
			// set title page
			if("${page.url.args.sent!""}"=="on"){
				$(".pec-mail-list .panel-heading h3").html("<i class='fa fa-envelope'></i> Posta inviata");
				Formez._inSentMode = true;
			}
			if("${page.url.args.starred!""}"=="on"){
				$(".pec-mail-list .panel-heading h3").html("<i class='fa fa-star'></i> Preferiti");
				Formez._inStarredMode = true;
			}
			<#if page.url.args.mail??>
			Formez._mailParam = "${page.url.args.mail}";
			</#if>
			Formez._getEmails();
			var currentAccount = Formez.Pec.accounts[Formez.Pec.account];
			$(".badge.pec-number-newmail").text(currentAccount.notRead);
			if(currentAccount.notRead>0){
				$(".badge.pec-number-newmail").addClass("morethanzero");
			}
			$(".pec-account-h3").html("<span class='pec-account-name'>"+currentAccount.name + "</span><br/><span class='pec-account-mail'>" + currentAccount.username + "</span>");
			// highlight folder in page
			if(Formez._inSentMode){
				$(".pec-folder-sent").addClass("pec-folder-active");
			}
			if(Formez._inStarredMode){
				$(".pec-folder-star").addClass("pec-folder-active");
			}
			if(!Formez._inStarredMode && !Formez._inSentMode){
				$(".pec-folder-inbox").addClass("pec-folder-active");
			}
			// setup popover
			$(".mail-actions a[data-toggle='popover']").popover({
				placement: "bottom",
				html: true,
				content: function(){
					var html = "<button class='btn btn-success' onclick='Formez._protocolMail();'>Protocolla</button>";
					html += " <button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
					return html;
				}
			});
			$("#pec-actions a[data-toggle='popover']").popover({
				placement: "bottom",
				html: true,
				content: function(){
					var html = "";
					if($("#pec-list input:checked").length>0){
						html += "<button class='btn btn-success' onclick='Formez._deleteEmails();'>Conferma</button> ";
					} else {
						html += "<strong>Selezione vuota</strong> ";
					}
					html += "<button class='btn btn-danger' onclick='Formez._closePopover();'>Annulla</button>";
					return html;
				}
			});	
		} else {
			$("body").css("background-color","#fff");
			if($(".pec-accounts").children().length==1){
				location.href = $(".pec-accounts a").first().attr("href");
			}
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
					Il servizio PEC non è attivo!
					</h3>
				</div>
			</div>
		</div>
	</div>
</div>
</#if>