<div class="container-fluid formez-${page.id}" role="main">
	<div class="row">
		<div class="col-md-12 col_right_container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3>
						<i class="fa fa-book"></i> Rubrica
					</h3>
				</div>
				<div class="panel-body form-horizontal">
					<div class="form-group has-feedback">
						<div class="col-md-6">
							<input type="text" placeholder="Filtra contatti..." class="form-control adb-filter" onkeydown="Formez._updateContacts(event);"/>
      						<a onclick="Formez._updateContacts();"><span class="glyphicon glyphicon-search form-control-feedback"></span></a>
						</div>
						<div id="adb-actions" class="col-md-6">
							<a class="btn btn-sm btn-default" onclick="Formez._createContact();"><i class="fa fa-plus"></i> Nuovo contatto</a>
						</div>
					</div>
				</div>
				<ul class="list-group adb-list">
				</ul>
				<div class="clearfix"></div>
			</div>
		</div>
	</div>
</div>
<#include "common/service.ftl">
<script type="text/javascript">
$(document).ready(function(){
	Formez._updateContacts();
});
</script>