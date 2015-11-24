<#macro formez>
<#assign inSite = page.url.templateArgs.site??>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="icon" type="image/png" href="/share/res/formez/images/icon.png">
		<title>${msg("formez.title")}</title>
		<!-- Bootstrap 3.1.1 -->
		<link href="/share/res/formez/css/bootstrap.min.css" rel="stylesheet">
		<link href="/share/res/formez/css/bootstrap-theme.min.css" rel="stylesheet">
		<link href="/share/res/formez/css/bootstrap-switch.min.css" rel="stylesheet">
		<link href="/share/res/formez/css/bootstrapValidator.min.css" rel="stylesheet">
		<link href="/share/res/formez/css/datepicker3.css" rel="stylesheet">
		<!-- Font-Awesome 4.0.3 -->
		<link href="/share/res/formez/css/font-awesome.min.css" rel="stylesheet">
		<!-- Formez custom CSS -->
		<link href="/share/res/formez/css/custom.css" rel="stylesheet">
		<link href="/share/res/formez/css/ipad.css" rel="stylesheet">
		<link href="/share/res/formez/css/replaceable.css" rel="stylesheet">
		<!-- jQuery (necessary for Bootstrap's 3.1.1 JavaScript plugins) -->
		<script src="/share/res/formez/js/jquery-1.11.0.min.js"></script>
		<!-- jQuery plugins -->
		<script src="/share/res/formez/js/jquery.popupoverlay.js"></script>
		<script src="/share/res/formez/js/jquery.form.js"></script>
		<script src="/share/res/formez/js/jquery.uploadfile.min.js"></script>
		<script src="/share/res/formez/js/bootstrap-switch.min.js"></script>
		<script src="/share/res/formez/js/bootstrapValidator.min.js"></script>
		<#if page.id="org">
		<script src="/share/res/formez/js/jquery.orgchart.min.js"></script>
		<link href="/share/res/formez/css/jquery.orgchart.css" rel="stylesheet">
		</#if>
		<!-- tiny mce for mail -->
		<#if page.id="mail">
		<script src="/share/res/formez/tinymce/tinymce.min.js"></script>
		<script src="/share/res/formez/tinymce/jquery.tinymce.min.js"></script>
		</#if>
		<!-- Formez js -->
		<script src="/share/res/formez/js/formez.js"></script>
		<script type="text/javascript">
			// get site and page
			Formez.site = "${page.url.templateArgs.site!""}";
			Formez.page = "${page.id!""}";
			// get user id and permissions
		    Formez.user.id = "${user.id}";
		    <#if inSite>
		    Formez.user.permissions = ${perms.getPerms(user.id,page.url.templateArgs.site)}
		    </#if>
		    $(document).ready(function(){
		    	// add class to autogenerate share div
		    	$(".container-fluid").parents("div[id^='page_']").addClass("share-div");
		    	// setup popup
		    	$('#formez_popup').popup({
		    		scrolllock: true,
		    		transition: 'all 0.1s',
		    		opentransitionend: function(){
		    			$(".alert button.formez_popup_close").focus();
		    		}
		    	});
		    	$('#formez_poptime').popup({
		    		background: false,
		    		transition: "all 0.3s"
		    	});
		    	$('#formez_wait').popup({
		    		scrolllock: true,
		    		blur: false,
		    		escape: false,
		    		opacity: 0.25
		    	});
		    	<#if inSite>
		    	// open menu if user has choosen it
		    	if(sessionStorage.getItem("mopen")=="true"){
		    		Formez.wrapperResizer();
		    	}
		    	// set header text and (if in site) user id and permissions
		    	$.getJSON(Formez.alf_url+"api/sites/"+Formez.site, function(res){
				    Formez.title = res.title;
				    $(".title_container i").after(" Area Organizzativa: "+res.title);
				    // set site node
				    Formez.node = res.node.split("node/")[1].replace("workspace/","workspace://");
				});
		    	<#else>
		    	$(".title_container i").after(" Benvenuto ${user.firstName}!");
		    	</#if>
		    	// add popover for user setting
		    	Formez._userSettingPopover();
		    });
		</script>
		<script src="/share/res/formez/js/formez.org.js"></script>
		<script src="/share/res/formez/js/formez.docs.js"></script>
		<script src="/share/res/formez/js/formez.reg.js"></script>
		<script src="/share/res/formez/js/formez.pec.js"></script>
		<script src="/share/res/formez/js/formez.cos.js"></script>
		<script src="/share/res/formez/js/formez.flow.js"></script>
		<script src="/share/res/formez/js/formez.infocert.js"></script>
		<script src="/share/res/formez/js/formez.poste.js"></script>
		<script src="/share/res/formez/js/formez.ui.js"></script>
		<script src="/share/res/formez/js/ui/formez.ui.${page.id}.js"></script>
		<script src="/share/res/formez/js/formez.picker.js"></script>
		<!-- HTML5 Shim (3.7.0) and Respond.js (1.4.2) IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		  <script src="/share/res/formez/js/html5shiv.js"></script>
		  <script src="/share/res/formez/js/respond.min.js"></script>
		<![endif]-->
		<!--[if lte IE 9]>
		  <script src="/share/res/formez/js/jquery.xdomainrequest.min.js"></script>
		  <script src="/share/res/formez/js/compatibility.js"></script>
		<![endif]-->
	</head>
	<body role="document">
		<div id="wrapper" class="<#if inSite>sidebar-mini<#else>ishome</#if>">
		    <!-- Fixed navbar -->
		    <div id="top-nav" class="fixed" role="navigation">
				<div class="row">
					<div class="brand">
						<div class="navbar-header">
							<a class="logo_formez" href="/share/page/home">
								<img src="/share/res/formez/images/logo_mdm.png" alt="mDM formez Document Management" class="large_logo" />
							</a>
						</div>
					</div>
					<div class="col-md-3 title_container">
						<h2>
							<i class="fa fa-arrow-circle-right"></i>
						</h2>
					</div>
					<div class="col-md-9">
						<ul class="nav navbar-nav nav_dx">
							<li><a href="/share/page/home"><i class="fa fa-home"></i> Home</a></li>
							<li><a href="/share/page/rubrica"><i class="fa fa-book"></i> Rubrica</a></li>
							<#if user.isAdmin>
							<li><a href="/share/page/users"><i class="fa fa-users"></i> Utenti</a></li>
							</#if>
							<li><a data-toggle="popover" class="formez-user"><i class="fa fa-user"></i> ${user.firstName}</a></li>
						</ul>
					</div>
					<div class="nofloat"></div>
				</div><!--row-->
			</div>
			<aside class="nav_sx">
				<div class="sidebar-inner scrollable-sidebar <#if !inSite>hide</#if>">
					<div class="size-toggle">
						<a class="btn btn-sm" id="sizeToggle" onClick="Formez.wrapperResizer();">
							<i class="fa fa-bars"></i>
						</a>
					</div><!-- /size-toggle -->
					<div class="user-block clearfix">
						<div class="main-menu">
							<ul>
								<li <#if page.id="desktop">class="active"</#if>><a href="desktop"><i class="fa fa-desktop"></i> Bacheca</a></li>
								<li <#if ["protocollo","protocolla"]?seq_contains(page.id)>class="active"</#if>><a href="protocollo"><i class="fa fa-tag"></i> Protocollo</a></li>
								<li <#if page.id="titolario" && !page.url.args.cos??>class="active"</#if>><a data-target=".archive.submenu" data-toggle="collapse">
									<i class="fa fa-file-text"></i> Documenti<span class="pull-right-backup"><i class="fa fa-chevron-down"></i></span></a>
									<ul class="submenu archive collapse">
										<li><a href="titolario"><i class="fa fa-archive"></i> Titolario</a></li>
										<li><a href="titolario?user"><i class="fa fa-child"></i> Personali</a></li>
										<li><a href="titolario?shared"><i class="fa fa-share-alt"></i> Condivisi</a></li>
									</ul>
								</li>
								<#if inSite && cfg.get().modules.pec && (cfg.get().pec>0)>
								<li <#if page.id="mail">class="active"</#if>><a href="mail"><i class="fa fa-envelope"></i> Mail</a></li>
								</#if>
								<#if inSite && cfg.get().modules.flow>
								<li <#if page.id="flows">class="active"</#if>><a href="flows"><i class="fa fa-refresh"></i> Processi</a></li>
								</#if>
								<#if inSite && cfg.get().modules.cos>
								<li <#if page.id="titolario" && page.url.args.cos??>class="active"</#if>><a href="titolario?cos"><i class="fa fa-university"></i> Conserv...</a></li>
								</#if>
								<#if inSite && cfg.get().modules.ldi && cfg.get().ldi>
								<li <#if page.id="legaldoc">class="active"</#if>><a href="legaldoc"><i class="fa fa-university"></i> Legaldoc</a></li>
								</#if>
								<#if inSite && cfg.get().modules.h2h && cfg.get().h2h>
								<li <#if page.id="poste">class="active"</#if>><a href="poste"><i class="fa fa-plane"></i> Poste</a></li>
								</#if>
								<#if inSite && perms.can("canAdmin")>
								<li <#if ["roles","org","audit","settings"]?seq_contains(page.id)>class="active"</#if>><a data-target=".admin.submenu" data-toggle="collapse">
									<i class="fa fa-cogs"></i> Admin<span class="pull-right-backup"><i class="fa fa-chevron-down"></i></span></a>
									<ul class="submenu admin collapse">
										<li><a href="org"><i class="fa fa-sitemap"></i> Organig...</a></li>
										<li><a href="roles"><i class="fa fa-shield"></i> Ruoli</a></li>
										<li><a href="audit"><i class="fa fa-clock-o"></i> Audit</a></li>
										<li><a href="settings"><i class="fa fa-cog"></i> Opzioni</a></li>
									</ul>
								</li>
								</#if>
							</ul>
						</div><!-- /main-menu -->
					</div>
				</div><!-- /sidebar-inner -->
			</aside>
			<#nested>
		</div>
		<div id="formez_popup">
		</div>
		<div id="formez_poptime">
		</div>
		<div id="formez_wait">
		</div>
		<!-- Include bootstrap -->
		<script src="/share/res/formez/js/bootstrap.min.js"></script>
		<script src="/share/res/formez/js/bootstrap-datepicker.js"></script>
		<script src="/share/res/formez/js/locales/bootstrap-datepicker.it.js"></script>
		<!-- Include a formez js for customization -->
		<script src="/share/res/formez/js/formez.custom.js"></script>
		<!-- include pdfjs (at the end, for performance -->
		<script src="/share/res/formez/js/pdf.js"></script>
	</body>
</html>
</#macro>