<#if user.isAdmin>
<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-12 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						<i class="fa fa-users"></i> Gestione Utenti
					</h3>
				</div>
				<div class="panel-body form-horizontal">
					<div class="form-group has-feedback">
						<div class="col-md-6">
							<input type="text" placeholder="Cerca utenti..." class="form-control users-filter" onkeydown="Formez._searchUsers(event);"/>
      						<a onclick="Formez._searchUsers();"><span class="glyphicon glyphicon-search form-control-feedback"></span></a>
						</div>
						<div id="users-actions" class="col-md-6">
							<a class="btn btn-sm btn-default users-create" data-toggle="popover"><i class="fa fa-plus"></i> Nuovo utente</a>
						</div>
					</div>
				</div>
				<div class="table-responsive">
					<table class="table table-bordered table-striped users-list">
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- ### template for add user popover ### -->
<div class="hide users-add-template">
	<form class='form-horizontal' role='form'>
		<div class='form-group'>
			<label class='control-label col-sm-3'>Nome</label>
			<div class='col-sm-9'>
				<input type='text' placeholder='Nome...' class="form-control input-sm" name="name"
				data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!' />
			</div>
		</div>
		<div class='form-group'>
			<label class='control-label col-sm-3'>Cognome</label>
			<div class='col-sm-9'>
				<input type='text' placeholder='Cognome...' class="form-control input-sm" name="surname" 
				data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!' />
			</div>
		</div>
		<div class='form-group'>
			<label class='control-label col-sm-3'>Username</label>
			<div class='col-sm-9'>
				<input type='text' placeholder='Username...' class="form-control input-sm" name="user"
				data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!' />
			</div>
		</div>
		<div class='form-group'>
			<label class='control-label col-sm-3'>Password</label>
			<div class='col-sm-9'>
				<input type='password' placeholder='Password...' class="form-control input-sm" name="pass"
				data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!' />
			</div>
		</div>
		<div class='form-group'>
			<label class='control-label col-sm-3'>Email</label>
			<div class='col-sm-9'>
				<input type='text' placeholder='Email...' class="form-control input-sm" name="email"
				data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'
				data-bv-emailaddress='true' data-bv-emailaddress-message='Email non valida!' />
			</div>
		</div>
		<div class='form-group'>
			<div class='col-sm-12'>
				<a class="btn btn-success" onclick="Formez._createUser();"><i class="fa fa-user"></i> Crea</a>
				<a class="btn btn-danger" onclick="Formez._closePopover();"><i class="fa fa-times"></i> Annulla</a>
			</div>
		</div>
	</form>
</div>
<!-- ### template for edit user popover ### -->
<div class="hide users-edit-template">
	<form class='form-horizontal' role='form' data-username="$$username$$">
		<div class='form-group'>
			<label class='control-label col-sm-3'>Nome</label>
			<div class='col-sm-9'>
				<input type='text' placeholder='Nome...' class="form-control input-sm" name="firstName"
				data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!' value="$$firstName$$" />
			</div>
		</div>
		<div class='form-group'>
			<label class='control-label col-sm-3'>Cognome</label>
			<div class='col-sm-9'>
				<input type='text' placeholder='Cognome...' class="form-control input-sm" name="lastName" 
				data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!' value="$$lastName$$" />
			</div>
		</div>
		<div class='form-group'>
			<label class='control-label col-sm-3'>Email</label>
			<div class='col-sm-9'>
				<input type='text' placeholder='Email...' class="form-control input-sm" name="email"
				data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'
				data-bv-emailaddress='true' data-bv-emailaddress-message='Email non valida!' value="$$email$$" />
			</div>
		</div>
		<div class='form-group'>
			<div class='col-sm-12'>
				<a class="btn btn-success" onclick="Formez._editUser();"><i class="fa fa-user"></i> Salva</a>
				<a class="btn btn-danger" onclick="Formez._closePopover();"><i class="fa fa-times"></i> Annulla</a>
			</div>
		</div>
	</form>
</div>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function(){
	// popover for create user
	$(".users-create").popover({
		placement: "bottom",
		html: true,
		container: "body",
		title: "Creazione nuovo utente",
		content: function(){
			return $(".users-add-template").html();
		}
	}).on("show.bs.popover", function(){
		$(this).data("bs.popover")["$tip"].addClass("users-add-popover");
	}).on("shown.bs.popover", function(){
		var userPop = $(this).data("bs.popover")["$tip"];
		$(userPop).find("form.form-horizontal").bootstrapValidator({
			feedbackIcons: {
		        valid: 'glyphicon glyphicon-ok',
		        invalid: 'glyphicon glyphicon-remove',
		        validating: 'glyphicon glyphicon-refresh'
		    },
		    live: 'enabled'
		});
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