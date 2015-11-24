<div class="formez-service formez-service-sendmail">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-offset-4 col-md-8">
				<div class="formez-service-close" onclick="Formez.Picker.sendmail.destroy();"><i class="fa fa-times"></i></div>
				<div class="panel panel-default">
					<div class="panel-heading">Nuovo messaggio...</div>
					<div class="panel-body">
						<form id="formez-service-sendmail-form" role="form" class="form-horizontal">
							<div class="form-group">
								<label for="formez-service-sendmail-from" class="col-sm-2 control-label">From</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" disabled id="formez-service-sendmail-from" />
								</div>
							</div>
							<div class="form-group">
								<label for="formez-service-sendmail-to" class="col-sm-2 control-label">To</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" name="to" id="formez-service-sendmail-to" placeholder="To...">
								</div>
							</div>
							<div class="form-group">
								<label for="formez-service-sendmail-cc" class="col-sm-2 control-label">Cc</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" name="cc" id="formez-service-sendmail-cc" placeholder="Cc...">
								</div>
							</div>
							<div class="form-group">
								<label for="formez-service-sendmail-subject" class="col-sm-2 control-label">Oggetto</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" name="subject" id="formez-service-sendmail-subject" placeholder="Oggetto...">
								</div>
							</div>
							<div class="form-group">
								<label for="formez-service-sendmail-msg" class="col-sm-2 control-label">Testo del messaggio</label>
								<div class="col-sm-10">
									<textarea id="formez-service-sendmail-msg"></textarea>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label">
									<a onclick='Formez.Picker.sendmail.addAttachs();' class="btn btn-default"><i class="fa fa-plus"></i></a> Allegati
								</label>
								<div class="col-sm-10">
									<ul class="list-group" id="formez-service-sendmail-attachs"></ul>
								</div>
							</div>
						</form>
					</div>
					<div class="panel-footer">
						<button type="button" class="btn btn-success" onclick='Formez.Picker.sendmail.send();'>Invia</button>
						<button type="button" class="btn btn-danger" onclick='Formez.Picker.sendmail.destroy();'>Annulla</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="formez-service formez-service-doclib">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-offset-7 col-md-5">
				<div class="formez-service-close" onclick="Formez.Picker.doclib.destroy(true);"><i class="fa fa-times"></i></div>
				<div class="panel panel-default">
					<div class="panel-heading">Elementi selezionati</div>
					<ul class="list-group formez-service-doclib-selected">
						<li class="toremove list-group-item">Nessun elemento selezionato</li>
					</ul>
					<div class="panel-footer">
						<div class="hide formez-service-doclib-input">
							<div class="formez-service-doclib-input-ajax"></div>
						</div>
						<div class="btn-group formez-service-doclib-upload hide">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
							Carica <span class="caret"></span>
							</button>
							<ul class="dropdown-menu" role="menu">
								<li><a class="formez-service-doclib-upli" onclick="$('.formez-service-doclib-input input').click();"><i class="fa fa-file-o"></i> Da File</a></li>
							    <li><a onclick="Formez.Picker.doclib.scan();"><i class="fa fa-print"></i> Da Scanner</a></li>
							</ul>
						</div>
						<button type="button" class="btn btn-success" onclick='Formez.Picker.doclib.ok();'>Conferma</button>
						<button type="button" class="btn btn-danger" onclick='Formez.Picker.doclib.destroy(true);'>Annulla</button>
					</div>
				</div>
				<div class="panel panel-default">
					<div class="panel-heading">Documenti: 
						<div class="btn-group formez-service-doclib-archives">
							<button onclick="Formez.Picker.doclib.chooseArchive('doclib');" type="button" class="btn btn-default formez-service-doclib-archives-doclib">Titolario</button>
							<button onclick="Formez.Picker.doclib.chooseArchive('user');" type="button" class="btn btn-default formez-service-doclib-archives-user">Personali</button>
							<button onclick="Formez.Picker.doclib.chooseArchive('shared');" type="button" class="btn btn-default formez-service-doclib-archives-shared">Condivisi</button>
							<#if page.url.templateArgs.site?? && cfg.get().modules.cos>
							<button onclick="Formez.Picker.doclib.chooseArchive('cos');" type="button" class="btn btn-default formez-service-doclib-archives-cos">Conservazione</button>
							</#if>
						</div>
					</div>
					<div class="panel-body formez-service-doclib-parent">
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="formez-service formez-service-adb">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-offset-7 col-md-5">
				<div class="formez-service-close" onclick="Formez.Picker.adb.destroy();"><i class="fa fa-times"></i></div>
				<div class="panel panel-default">
					<div class="panel-heading">Elementi selezionati</div>
					<ul class="list-group formez-service-adb-selected">
						<li class="toremove list-group-item">Nessun elemento selezionato</li>
					</ul>
					<div class="panel-footer">
						<button type="button" class="btn btn-success" onclick='Formez.Picker.adb.ok();'>Conferma</button>
						<button type="button" class="btn btn-danger" onclick='Formez.Picker.adb.destroy();'>Annulla</button>
					</div>
				</div>
				<div class="panel panel-default">
					<div class="panel-heading">Cerca o crea contatti</div>
					<div class="panel-body formez-service-adb-search">
						<div class="input-group">
							<input type="text" placeholder="Cerca o crea contatti..." class="form-control input-md" onkeydown='Formez.Picker.adb.search(true, event);' />
							<span class="input-group-btn">
								<button type="button" class="btn btn-default" onclick='Formez.Picker.adb.search(false);'><i class="fa fa-search"></i></button>
							</span>
							<span class="input-group-btn">
								<button type="button" class="btn btn-default" onclick='Formez.Picker.adb.add();'><i class="fa fa-plus"></i></button>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="formez-service formez-service-user">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-offset-7 col-md-5">
				<div class="formez-service-close" onclick="Formez.Picker.users.destroy();"><i class="fa fa-times"></i></div>
				<div class="panel panel-default">
					<div class="panel-heading">Elementi selezionati</div>
					<ul class="list-group formez-service-user-selected">
						<li class="toremove list-group-item">Nessun elemento selezionato</li>
					</ul>
					<div class="panel-footer">
						<button type="button" class="btn btn-success" onclick='Formez.Picker.users.ok();'>Conferma</button>
						<button type="button" class="btn btn-danger" onclick='Formez.Picker.users.destroy();'>Annulla</button>
					</div>
				</div>
				<div class="panel panel-default">
					<div class="panel-heading">Seleziona utenti da UO...</div>
					<div class="panel-body">
						<div class="input-group">
							<select class="form-control formez-service-user-uos" onchange='Formez.Picker.users.uoSelect();'>
							</select>
						</div>
					</div>
				</div>
				<div class="panel panel-default">
					<div class="panel-heading">...oppure cercali...</div>
					<div class="panel-body formez-service-user-search">
						<div class="input-group">
							<input type="text" placeholder="Cerca utenti..." class="form-control input-md" onkeydown='Formez.Picker.users.search(true, event);' />
							<span class="input-group-btn">
								<button type="button" class="btn btn-default" onclick='Formez.Picker.users.search(false);'><i class="fa fa-search"></i></button>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="formez-service formez-service-scan">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-offset-7 col-md-5">
				<div class="formez-service-close" onclick="Formez.Picker.scanner.destroy();"><i class="fa fa-times"></i></div>
				<div class="panel panel-default">
					<div class="panel-heading">Documenti scansionati</div>
					<ul class="list-group formez-service-scan-selected">
						<li class="toremove list-group-item">Nessun documento...</li>
					</ul>
					<div class="panel-footer">
						<button type="button" class="btn btn-success" onclick='Formez.Picker.scanner.ok();'>Conferma</button>
						<button type="button" class="btn btn-danger" onclick='Formez.Picker.scanner.destroy();'>Annulla</button>
					</div>
				</div>
				<div class="panel panel-default">
					<div class="panel-heading">Scansione</div>
					<div class="panel-body">
						<div class="form-horizontal" role="form">
							<div class="form-group">
								<label for="formez-service-scan-scanners" class="control-label col-sm-2">Scanner</label>
								<div class="col-sm-8">
									<select class="form-control" id="formez-service-scan-scanners">
									</select>
								</div>
								<div class="col-sm-2">
									<a class="btn btn-default" onclick="Formez.Picker.scanner.getScanners();"><i class="fa fa-refresh"></i></a>
								</div>
							</div>
							<div class="form-group">
								<label for="formez-service-scan-dpi" class="control-label col-sm-2">DPI</label>
								<div class="col-sm-4">
									<select class="form-control" id="formez-service-scan-dpi">
										<option value="75">75 dpi</option>
										<option value="150" selected>150 dpi</option>
										<option value="200">200 dpi</option>
										<option value="300">300 dpi</option>
										<option value="600">600 dpi</option>
									</select>
								</div>
								<label for="formez-service-scan-type" class="control-label col-sm-2">Formato</label>
								<div class="col-sm-4">
									<select class="form-control" id="formez-service-scan-type">
										<option value=".pdf">PDF</option>
										<option value=".tif">TIF</option>
										<option value=".jpg">JPG</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label for="formez-service-scan-adf" class="control-label col-sm-2">ADF</label>
								<div class="col-sm-1">
									<input type="checkbox" class="form-control" id="formez-service-scan-adf" />
								</div>
								<label for="formez-service-scan-ocr" class="control-label col-sm-2">OCR</label>
								<div class="col-sm-1">
									<input type="checkbox" class="form-control" onchange="return false;" id="formez-service-scan-ocr" />
								</div>
								<label for="formez-service-scan-lang" class="control-label col-sm-2">Lingua</label>
								<div class="col-sm-4">
									<select class="form-control" id="formez-service-scan-lang">
										<option value="ita">Italiano</option>
										<option value="eng">Inglese</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label for="formez-service-scan-name" class="control-label col-sm-2">Nome</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="formez-service-scan-name" placeholder="Nome file senza estensione..." />
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-offset-2 col-sm-4">
									<button onclick="Formez.Picker.scanner.start();" class="btn btn-success" type="button">Inizia Scansione</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="formez-service formez-service-sign">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-offset-6 col-md-6">
				<div class="formez-service-close" onclick="Formez.Picker.signer.destroy();"><i class="fa fa-times"></i></div>
				<div class="panel panel-default">
					<div class="panel-heading">Documenti da firmare</div>
					<ul class="list-group formez-service-sign-selected">
					</ul>
					<div class="panel-footer">
						<button type="button" class="btn btn-danger" onclick='Formez.Picker.signer.destroy();'>Annulla</button>
					</div>
				</div>
				<div class="panel panel-default">
					<div class="panel-heading">Firma</div>
					<div class="panel-body">
						<div class="form-horizontal" role="form">
							<div class="form-group">
								<label for="formez-service-sign-driver" class="control-label col-sm-2">Driver</label>
								<div class="col-sm-10">
									<select class="form-control" id="formez-service-sign-driver">
										<option value="gclib.dll">[BNL/Postecom] Gemplus GemGATE (win)</option>
										<option value="SI_pkcs11.dll">[InfoCamere/BNL/Buffetti] 140*/150* (win)</option>
										<option value="IpmPki32.dll">[InfoCamere/Telecom] 1201*/1203* (win)</option>
										<option value="IpmPkiLC.dll">[InfoCamere/Telecom] 1202*/0..04000 (win)</option>
										<option value="cvP11_M4.dll">[InfoCamere] 160* CryptoVision (win)</option>
										<option value="incryptoki2.dll">[Infocamere/PosteCom] 7420*/1204* (win)</option>
										<option value="CardOS_PKCS11.dll">[Siemens/Eutron] Notai o Actalis (win)</option>
										<option value="bit4ipki.dll">[InfoCamere] 7420*/6090*/120* (win)</option>
										<option value="bit4opki.dll">[InfoCamere] CNS Oberthur (win)</option>
										<option value="cnsPKCS11.dll">[Siemens] CRS/CNS Siemens (win)</option>
										<option value="cmp11.dll">[Actalis/Eutron] Charismatics (win)</option>
										<option value="siecap11.dll">[InfoCamere] new Siemens Card (win)</option>
										<option value="asepkcs.dll">[Athena] CNS prodotte da Athena (win)</option>
										<option value="inpkisc.dll">[InfoCamere] 7420* vecchio CSP (win)</option>
										<option value="inp11lib.dll">[InfoCamere] new Incard card (win)</option>
										<option value="SissP11.dll">[Regione Lombardia] Siemens SISS HPC (win)</option>
										<option value="libbit4ipki.so">[InfoCamere] 7420*/6090*/120* (linux)</option>
										<option value="libbit4ihpki.so">[InfoCamere] Business Key Lite (linux)</option>
										<option value="libbit4opki.so">[InfoCamere] CNS Oberthur (linux)</option>
										<option value="libASEP11.so">[Athena] CNS prodotte da Athena (linux)</option>
										<option value="libinp11.so">[Infocamere/PosteCom] 7420*/1204* (linux)</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label for="formez-service-sign-pin" class="control-label col-sm-2">PIN</label>
								<div class="col-sm-10">
									<input type="password" class="form-control" id="formez-service-sign-pin" placeholder="Inserisci PIN..." />
								</div>
							</div>
							<div class="form-group">
								<label for="formez-service-sign-certs" class="control-label col-sm-2">Certificati</label>
								<div class="col-sm-8">
									<select class="form-control" id="formez-service-sign-certs">
									</select>
								</div>
								<div class="col-sm-2">
									<a class="btn btn-default" onclick="Formez.Picker.signer.getCertificates();"><i class="fa fa-refresh"></i></a>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-offset-2 col-sm-4">
									<button onclick="Formez.Picker.signer.sign();" class="btn btn-success" type="button">Firma</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="formez-service formez-service-form">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-offset-6 col-md-6">
				<div class="formez-service-close" onclick="Formez.Picker.form.destroy();"><i class="fa fa-times"></i></div>
				<div class="panel panel-default">
					<div class="panel-heading formez-service-form-header"></div>
					<div class="panel-body">
						<form class="form-horizontal formez-service-form-form" role="form">
						</form>
					</div>
					<div class="panel-footer">
						<button type="button" class="btn btn-success" onclick="Formez.Picker.form.go();">Conferma</button>
						<button type="button" class="btn btn-danger" onclick='Formez.Picker.form.destroy();'>Annulla</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="formez-service formez-service-preview">
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-offset-6 col-md-6">
				<div class="formez-service-close" onclick="Formez.Picker.preview.destroy();"><i class="fa fa-times"></i></div>
				<div class="panel panel-default">
					<div class="panel-heading">
						<span class="formez-service-preview-name"></span>
						<span class="formez-service-preview-page pull-right"></span>
					</div>
					<div class="panel-body formez-service-preview-body text-center">
						<div class="formez-service-preview-toolbar">
							Vai alla pagina:
							<input type="text" class="form-control formez-service-preview-numpage">
							<a onclick="Formez.Picker.preview.gotoPage();" class="btn btn-success"><i class="fa fa-play"></i></a>
							<button onclick="Formez.Picker.preview.prev();" type="button" class="btn btn-success tomargin">
								<i class="fa fa-chevron-left"></i>
							</button>
							<button onclick="Formez.Picker.preview.next();" type="button" class="btn btn-success">
							<i class="fa fa-chevron-right"></i>
							</button>
							<button onclick="Formez.Picker.preview.dezoom();" type="button" class="btn btn-success tomargin">
								<i class="fa fa-minus"></i>
							</button>
							<button onclick="Formez.Picker.preview.zoom();" type="button" class="btn btn-success">
							<i class="fa fa-plus"></i>
							</button>
						</div>
						<canvas class="formez-service-preview-canvas">
						</canvas>
					</div>
					<div class="panel-footer">
						<button type="button" class="btn btn-danger" onclick='Formez.Picker.preview.destroy();'>Chiudi</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>