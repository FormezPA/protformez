/**
 * Formez @Picker Module
 * @namespace Formez
*/

(function(){
	
/**
 * @Picker module
 */
Formez.Picker = {
	// localhost url and check
	localurl: "http://localhost:18888/",
	checkLocalhost: function(){
		$.ajax({
			dataType: "json",
			url: this.localurl,
			error: function(){
				Formez.poptime("Ricorda di scaricare e avviare l'eseguibile","warning");
			},
			timeout: 2000
		});
	},
	// collection of node returned from server
	nodes: {},
	// current picker div
	doclib: null,
	/**
	 * function to open doclib picker
	 * config object:
	 * 		multiple: boolean to choose if multiple selection is active. default is true
	 * 		upload: boolean to choose if upload div is displayed. default is true
	 * 		type: custom type for selection. default id "cm:content"
	 * 		root: archive to choose (doclib, user or shared). if null, doclib is root
	 * 		callback: callback function for selection nodes (name, noderef)
	 * 	 	selectselected: true/false
	 * 		element: html element to get selected value
	 */
	openDoclib: function(config){
		// get dom objects
		var doclib = function(config){
			this.picker = $(".formez-service-doclib");
			this.selected = this.picker.find(".formez-service-doclib-selected");
			this.selected.html("<li class='toremove list-group-item'>Nessun elemento selezionato</li>");
			this.parent = this.picker.find(".formez-service-doclib-parent");
			this.uploadDivs = this.picker.find(".formez-service-doclib-upload");
			// get picker options
			this.upload = (config.upload==null ? true : config.upload);
			this.multiple = (config.multiple==null ? true : config.multiple);
			this.selectable = config.selectable || function(){return true;};
			this.root = config.root || "doclib";
			this.callback = config.callback || function(){};
			this.destination = null;
			this.selectselected = (config.selectselected==null ? false : config.selectselected);
			this.element = config.element;
			// show upload if type is d
			if(this.upload){
				this.uploadDivs.removeClass("hide");
				Formez.Docs.getUserHome(function(temp){
					Formez.Picker.doclib.destination = temp.nodeRef;
					if(navigator.appVersion.indexOf("MSIE 9.0")>-1 || navigator.appVersion.indexOf("MSIE 8.0")>-1){
						Formez._ieResponseUpload = function(res){
							Formez.Docs.docs[res.nodeRef] = {properties:{"cm:name":res.fileName}};
							Formez.Picker.doclib.select(res.nodeRef, true);
						}
						var liEl = $(".formez-service-doclib-upli");
						liEl.attr("onclick","$('.formez-service-doclib-upload').popover('show');");
						var buttonEl = $(".formez-service-doclib-upload");
						buttonEl.attr("data-toggle","popover");
						buttonEl.popover("destroy");
						buttonEl.popover({
							container: "body",
							placement: "left",
							html: true,
							trigger: "manual",
							content: function(){
								var html = "<div class='formez-service-doclib-upload-ie'><span class='btn btn-success'>Seleziona file</span></div>";
								return html;
							}
						}).on("shown.bs.popover",function(){
							$(".formez-service-doclib-upload-ie").uploadFile({
								url: Formez.alf_url+"api/upload.html?success=window.parent.Formez._ieResponseUpload",
								multiple: true,
								fileName: "filedata",
								returnType: "script",
								dragDrop: false,
								showCancel: false,
								showAbort: false,
								showDone: false,
								showError: false,
								showFileCounter: false,
								showStatusAfterSuccess: false,
								dynamicFormData: function(){
									Formez.wait("Upload in corso...");
									return {destination:Formez.Picker.doclib.destination,overwrite:false};
								},
								onSuccess: function(files,data,xhr){
									Formez.waitOff();
									Formez._closePopover();
									Formez.poptime("Upload effettuato con successo");
									//alert(data);
									//Formez.Docs.docs[res.nodeRef] = {properties:{"cm:name":res.fileName}};
									//Formez.Picker.doclib.select(res.nodeRef, true);
								},
								onError: function(){
									Formez.waitOff();
									Formez._closePopover();
									Formez.alert("Errore durante l'upload del file","danger");
								}
							});
						});
					} else {
						$(".formez-service-doclib-input .ajax-file-upload").remove();
						$(".formez-service-doclib-input-ajax").uploadFile({
							url: Formez.alf_url+"api/upload",
							multiple: true,
							fileName: "filedata",
							returnType: "json",
							dragDrop: false,
							showCancel: false,
							showAbort: false,
							showDone: false,
							showError: false,
							showFileCounter: false,
							showStatusAfterSuccess: false,
							dynamicFormData: function(){
								Formez.wait("Upload in corso...");
								return {destination:Formez.Picker.doclib.destination,overwrite:false};
							},
							onSuccess: function(name, res){
								Formez.waitOff();
								Formez.poptime("Upload effettuato con successo");
								Formez.Docs.docs[res.nodeRef] = {properties:{"cm:name":res.fileName}};
								Formez.Picker.doclib.select(res.nodeRef, true);
								// remove hidden form (bug uploader)
								$(".formez-service-doclib-input form").first().remove();
							},
							onError: function(){
								Formez.waitOff();
								Formez.alert("Errore durante l'upload del file","danger");
							}
						});
					}
				});
			} else {
				this.uploadDivs.addClass("hide");
			}
			// function to open scan
			this.scan = function(){
				Formez.Picker.scan({
					destination: Formez.Picker.doclib.destination,
					direct: true,
					callback: function(nodes){
						for(var n in nodes){
							var node = nodes[n];
							Formez.Docs.docs[node.noderef] = {properties:{"cm:name":node.name}};
							Formez.Picker.doclib.select(node.noderef, true);
						}
					}
				});
			}
			// previous parent for level up
			this.parents = new Array();
			// function to choose archive
			this.chooseArchive = function(archive){
				if(archive==null){
					Formez.Picker.doclib.root = "doclib";
				} else {
					Formez.Picker.doclib.root = archive;
				}
				Formez.Picker.doclib.getChildren();
			}
			// function to scroll children
			this.getChildren = function(parentRef){
				if(parentRef==null){
					$(".formez-service-doclib-archives button").removeClass("active");
					$(".formez-service-doclib-archives-"+Formez.Picker.doclib.root).addClass("active");
					Formez.Picker.doclib.parents = new Array();
					var openArchive = function(doclib){
						Formez.Picker.doclib.root = doclib.nodeRef;
						Formez.Picker.doclib.getChildren(doclib.nodeRef);
					}
					if(Formez.Picker.doclib.root=="user"){
						Formez.Docs.getUserHome(openArchive);
					} else if(Formez.Picker.doclib.root=="shared"){
						Formez.Docs.getContainer("shared", openArchive);
					} else if(Formez.Picker.doclib.root=="cos"){
						Formez.Docs.getContainer("cos", openArchive);
					} else {
						Formez.Docs.getContainer("documentLibrary", openArchive);
					}
					return;
				}
				Formez.Docs.children(parentRef, function(nodes){
					var html = "<ul class='list-group formez-service-doclib-archive'>";
					for(var n in nodes){
						var node = nodes[n];
						if(node.aspects.indexOf("sys:hidden")==-1){
							var nodeRef = node.nodeRef;
							var nodeName = node.properties["cm:name"];
							html += "<li class='list-group-item'>";
							if(Formez.Picker.doclib.selectable(node)){
								html += "<button class='btn' type='button' onclick='Formez.Picker.doclib.select(\""+nodeRef+"\", false);'><i class='fa fa-plus-circle'></i></button> ";
							}
							if(node.isContainer){
								html += "<a onclick='Formez.Picker.doclib.getChildren(\""+nodeRef+"\")'><i class='fa fa-folder-open'></i> "+nodeName+"</a>";
							} else {
								html += "<a class='formez-service-doclib-isfile' onclick='Formez.Picker.showPreview({noderef:\""+nodeRef+"\"});'>";
								html += Formez.Docs.icon(nodeName)+nodeName+"</a>"
							}
							html += "</li>";
						}
					}
					html += "</ul>";
					var parent = Formez.Picker.doclib.parent;
					var panel = parent.parent();
					parent.empty();
					parent.append("<button class='btn' type='button' onclick='Formez.Picker.doclib.up();'><i class='fa fa-level-up'></i></button> ");
					if(Formez.Docs.docs[parentRef].aspects.indexOf("st:siteContainer")>-1){
						parent.append("<ul class='formez-service-doclib-breadcrump'><li><i class='fa fa-folder-open'></i> Archivio</li></ul>");
					} else {
						Formez.Picker.doclib.parents.push(parentRef);
						var parents = Formez.Picker.doclib.parents;
						var breadcrump = "<ul class='formez-service-doclib-breadcrump'><li><i class='fa fa-folder-open'></i> Archivio</li>";
						for(var i=0;i<parents.length;i++){
							var ref = parents[i];
							breadcrump += "<li><i class='fa fa-folder-open'></i> "+(Formez.Docs.docs[ref] ? Formez.Docs.docs[ref].properties["cm:name"] : "Archivio")+"</li>";
						}
						breadcrump += "</ul>";
						parent.append(breadcrump);
					}
					panel.find(".formez-service-doclib-archive").remove();
					panel.append(html);
				});
			}
			// function to up level children
			this.up = function(){
				if(this.parents.length>1){
					var ref = this.parents[this.parents.length-2];
					this.parents.pop();
					this.parents.pop();
					this.getChildren(ref);
				} else {
					if(this.parents.length>0){
						this.parents.pop();
					}
					this.getChildren(this.root);
				}
			}
			this.select = function(noderef, isUpload){
				if(this.selected.find("[data-noderef='"+noderef+"']").length==0){
					// recupero il nodo completo in background per eventuali return
					Formez.Docs.get(noderef,function(){});
					// se sono in modalità singolo documento, rimuovo eventuali altri docs
					if(!this.multiple){
						this.selected.empty();
					}
					this.selected.find(".toremove").remove();
					var node = Formez.Docs.docs[noderef];
					var nodeName = node.properties["cm:name"];
					var html = "<li class='list-group-item' data-noderef='"+noderef+"' data-isupload='"+isUpload+"'>";
					if(node.isContainer){
						html += "<i class='fa fa-folder-open'></i> "+nodeName;
					} else {
						html += Formez.Docs.icon(nodeName)+nodeName;
					}
					html += "<button class='pull-right btn btn-xs btn-default' onclick='Formez.Picker.doclib.checkAndRemove($(this).parent());'><i class='fa fa-times'></i></button></li>";
					this.selected.append(html);
				}
			}
			this.checkAndRemove = function(domnode){
				var isupload = domnode.data("isupload");
				if(isupload==true){
					Formez.Docs.Actions.deleteNode(domnode.data("noderef"), function(){});
				}
				domnode.remove();
			}
			this.ok = function(){
				var selected = [];
				this.selected.find("li[data-noderef]").each(function(){
					var ref = $(this).data("noderef");
					selected.push({
						noderef: ref,
						name: Formez.Docs.docs[ref].properties["cm:name"]
					});
				});
				this.callback(selected);
				this.destroy();
			}
			this.destroy = function(withDelete){
				if(withDelete){
					this.selected.children().each(function(){
						Formez.Picker.doclib.checkAndRemove($(this));
					});
				}
				if($(".formez-service:visible").length==1)$("#wrapper").removeClass("formez-service-isopen");
				this.picker.hide().width("0px");
				Formez.Picker.doclib = null;
				Formez._closePopover();
			}
			// show picker
			this.picker.show().width("100%");
			$("#wrapper").addClass("formez-service-isopen");
		}
		
		this.doclib = new doclib(config);
		this.doclib.getChildren();
		
		if (this.doclib.selectselected && this.doclib.element){
			var nodes = this.doclib.element.children("input").val(); //If the val is in input!!!!
			if (nodes){
				var uri = Formez.formez_url + "picker/generalget?nodes="+nodes;
				$.getJSON(uri, function(res){
					for(var e in res.elements){
						var element = res.elements[e];
						Formez.Docs.docs[e] = {properties:{"cm:name":element.name}};
					}
					var values = nodes.split(';');
					for (var v = 0; v < values.length; v++){
						if (values[v].length >= 25){ //MIN NODEREF LENGTH
							Formez.Picker.doclib.select(values[v]);
						}
					}						
				});
			}
		}
	},
	// adb picker instance
	adb: null,
	/**
	 * function to open addressbook picker
	 * config object:
	 * 		multiple: boolean to choose if multiple selection is active. default is true
	 * 		callback: callback function for selection nodes (name, noderef)
	 * 	 	selectselected: true/false
	 * 		element: html element to get selected value
	 */
	openAdb: function(config){
		// get dom objects
		var adb = function(config){
			this.picker = $(".formez-service-adb");
			this.selected = this.picker.find(".formez-service-adb-selected");
			this.selected.html("<li class='toremove list-group-item'>Nessun contatto selezionato</li>");
			this.input = this.picker.find(".formez-service-adb-search");
			this.input.find("input").val("");
			// get picker options
			this.multiple = (config.multiple==null ? true : config.multiple);
			this.callback = config.callback || function(){};
			if (config.selectselected){
				this.selectselected = true;
			}
			else{
				this.selectselected = false;
			}
			if (config.element){
				this.element = config.element
			}
			// function to scroll children
			this.search = function(isenter, event){
				if(isenter){
					if(event.keyCode!=13) return;
				}
				var q = Formez.Picker.adb.input.find("input").val();
				var uri = Formez.formez_url + "org/adb/list?q="+q;
				$.getJSON(uri, function(res){
					var html = "<ul class='list-group formez-service-adb-contacts'>";
					for(var c in res.contacts){
						var contact = res.contacts[c];
						Formez.Picker.nodes[c] = contact;
						html += "<li class='list-group-item'>";
						html += "<button class='btn' type='button' onclick='Formez.Picker.adb.select(\""+c+"\");'>";
						html += "<i class='fa fa-plus-circle'></i></button> <b>"+contact.name+"</b>";
						html += "<span class='pull-right text-right'>";
						if(contact.email.length>0){
							html += " <i class='fa fa-envelope'></i> "+contact.email+"<br/>";
						}
						if(contact.address.length>0 && contact.city.length>0 && contact.cap.length>0 && contact.district.length>0){
							html += " <i class='fa fa-building'></i> "+contact.address+", "+contact.city+" "+contact.cap+" "+contact.district;
						}
						html += "</span></li>";
					}
					html += "</ul>";
					var panel = Formez.Picker.adb.input.parents(".panel-default");
					panel.find(".formez-service-adb-contacts").remove();
					panel.append(html);
				});
			}
			this.select = function(noderef){
				if(this.selected.find("[data-noderef='"+noderef+"']").length==0){
					if(!this.multiple){
						this.selected.empty();
					}
					this.selected.find(".toremove").remove();
					var html = "<li class='list-group-item' data-noderef='"+noderef+"'>"+Formez.Picker.nodes[noderef].name;
					html += "<button class='pull-right btn btn-xs btn-default' onclick='$(this).parent().remove();'><i class='fa fa-times'></i></button></li>";
					this.selected.append(html);
				}
			}
			this.add = function(){
				Formez.Protocol.getContactFolder(function(noderef){
					Formez.Picker.getForm({
					    type:"addbook:contact",
					    mode:"new",
					    noderef:noderef,
					    callback:function(res){
					    	Formez.Docs.get(res, function(contact){
					    		Formez.Picker.nodes[contact.nodeRef] = {name: contact.properties["addbook:name"]};
								Formez.Picker.adb.select(contact.nodeRef);
					    	});
					    }
					});
				});
			}
			this.ok = function(){
				var selected = [];
				this.selected.find("li[data-noderef]").each(function(){
					var ref = $(this).data("noderef");
					selected.push({
						noderef: ref,
						name: Formez.Picker.nodes[ref].name
					});
				});
//				if(selected.length>0){
					this.callback(selected);
//				}
				this.destroy();
			}
			this.destroy = function(){
				if($(".formez-service:visible").length==1)$("#wrapper").removeClass("formez-service-isopen");
				this.picker.hide().width("0px");
				Formez.Picker.adb = null;
			}
			// show picker
			this.picker.show().width("100%");
			$("#wrapper").addClass("formez-service-isopen");
		}
		
		this.adb = new adb(config);
		this.adb.search(false);
		if (this.adb.selectselected){
			if (this.adb.element){
				var nodes = this.adb.element.children("input").val(); //If the val is in input!!!!
				if (nodes){
					var uri = Formez.formez_url + "picker/generalget?nodes="+nodes;
					$.getJSON(uri, function(res){
						for(var e in res.elements){
							var element = res.elements[e];
							Formez.Picker.nodes[e] = element;
						}
						var values = nodes.split(';');
						for (var v = 0; v < values.length; v++){
							Formez.Picker.adb.select(values[v]);
						}						
					});
				}
			}
		}
	},
	// user picker instance
	users: null,
	/**
	 * function to open user picker
	 * config object:
	 * 		multiple: boolean to choose if multiple selection is active. default is true
	 * 		callback: callback function for selection users
	 */
	searchUsers: function(config){
		// get dom objects
		var users = function(config){
			this.picker = $(".formez-service-user");
			this.selected = this.picker.find(".formez-service-user-selected");
			this.selected.html("<li class='toremove list-group-item'>Nessun contatto selezionato</li>");
			this.input = this.picker.find(".formez-service-user-search");
			this.input.find("input").val("");
			this.uos = this.picker.find(".formez-service-user-uos");
			// get picker options
			this.multiple = (config.multiple==null ? true : config.multiple);
			this.callback = config.callback || function(){};
			// function to scroll children
			this.search = function(isenter, event){
				if(isenter){
					if(event.keyCode!=13) return;
				}
				var q = $.trim(Formez.Picker.users.input.find("input").val());
				if(q.length==0 || q=="*"){
					Formez.poptime("Inserisci almeno un carattere!", "warning");
					return;
				}
				Formez.Org.searchUsers(q, true, false, 10, function(users){
					Formez.Picker.users.draw(users);
				});
			}
			// function for user draw
			this.draw = function(users){
				var html = "<ul class='list-group formez-service-user-users'>";
				for(var u in users){
					var user = users[u];
					html += "<li class='list-group-item' data-user='"+user.username+"'>";
					html += "<button class='btn' type='button' onclick='Formez.Picker.users.select(this);'>";
					html += "<i class='fa fa-plus-circle'></i></button> <b>"+user.name+" "+(user.surname||"")+"</b></li>";
				}
				html += "</ul>";
				var panel = Formez.Picker.users.input.parents(".panel-default");
				panel.find(".formez-service-user-users").remove();
				panel.append(html);
			}
			// function for select
			this.select = function(btnEl){
				var liEl = $(btnEl).parent();
				var username = liEl.data("user");
				if(this.selected.find("[data-user='"+username+"']").length==0){
					if(!this.multiple){
						this.selected.empty();
					}
					this.selected.find(".toremove").remove();
					var html = "<li class='list-group-item' data-user='"+username+"'>"+liEl.children("b").text();
					html += "<button class='pull-right btn btn-xs btn-default' onclick='$(this).parent().remove();'><i class='fa fa-times'></i></button></li>";
					this.selected.append(html);
				}
			}
			// function for retrieve uos
			this.loadUos = function(){
				var me = this;
				Formez.Org.getUos(function(res){
					var html = "<option value=''>Scegli un UO...</option>";
					var level = -1;
					var drawUo = function(ref){
						var uo = res.uos[ref];
						level++;
						var minus = "";
						for(var i=0;i<level;i++){
							minus += "--";
						}
						if(minus.length>0){
							minus += " ";
						}
						html += "<option value='"+ref+"'>"+minus+uo.name+"</option>";
						for(var j=0;j<uo.children.length;j++){
							drawUo(uo.children[j]);
						}
						level--;
					}
					drawUo(res.root);
					me.uos.empty();
					me.uos.append(html);
				});
			}
			this.loadUos();
			// function on select uo from select
			this.uoSelect = function(){
				var uo = Formez.Picker.users.uos.val();
				if(uo!=""){
					var uoObj = Formez.Org.getUo(uo);
					if(uoObj.users.length>0){
						this.draw(uoObj.users);
					}
				}
			}
			this.ok = function(){
				var selected = [];
				this.selected.find("li[data-user]").each(function(){
					var liEl = $(this);
					var username = liEl.data("user");
					selected.push({
						username: username,
						name: liEl.text()
					});
				});
				if(selected.length>0){
					this.callback(selected);
				}
				this.destroy();
			}
			this.destroy = function(){
				if($(".formez-service:visible").length==1)$("#wrapper").removeClass("formez-service-isopen");
				this.picker.hide().width("0px");
				Formez.Picker.users = null;
			}
			// show picker
			this.picker.show().width("100%");
			$("#wrapper").addClass("formez-service-isopen");
		}
		
		this.users = new users(config);
	},
	// mail picker instance
	sendmail: null,
	/**
	 * function to open mail picker
	 * config object:
	 * 		account: account noderef to use for send email
	 * 		mode: (optional, default is "new") new, forward, reply, replyall
	 * 		attachs: (optional) attachments to show in form
	 * 		email: (optional) if reply/forward, specify original email noderef
	 */
	sendMail: function(config){
		// get dom objects
		var sendmail = function(config){
			this.picker = $(".formez-service-sendmail");
			this.form = this.picker.find("#formez-service-sendmail-form");
			this.editor = this.picker.find("#formez-service-sendmail-msg");
			this.from = this.picker.find("#formez-service-sendmail-from");
			this.to = this.picker.find("#formez-service-sendmail-to");
			this.cc = this.picker.find("#formez-service-sendmail-cc");
			this.subject = this.picker.find("#formez-service-sendmail-subject");
			this.attachs = this.picker.find("#formez-service-sendmail-attachs");
			// get picker options
			this.callback = config.callback || function(){};
			this.mode = config.mode || "new";
			this.email = null;
			if(this.mode!="new"){
				this.email = Formez.Pec.getEmail(config.email);
			}
			this.account = Formez.Pec.getAccount(config.account);
			// set from input
			this.from.val(this.account.name+" <"+this.account.username+">");
			// set editor init value
			if(this.mode=="new"){
				this.editor.val("");
			} else {
				this.editor.val("<br/>---<br/>"+this.email.text);
			}
			// function to check recipients
			this.checkRecipients = function(recsArray){
				var recs = [];
				for(var r in recsArray){
					var rec = recsArray[r];
					if(rec.indexOf("<")>-1){
						rec = $.trim(rec.split("<")[1].split(">")[0]);
					}
					if(rec!=this.account.username){
						recs.push(rec);
					}
				}
				return recs.toString();
			}
			this.addAttachs = function(){
				Formez.Picker.openDoclib({
					multiple: true,
					selectable: function(n){return !n.isContainer},
					upload: true,
					callback: function(nodes){
						if(nodes.length>0){
							var ulEl = Formez.Picker.sendmail.attachs;
							if(ulEl.find(".toremove")){
								ulEl.find(".toremove").remove();
							};
							for(var n in nodes){
								var node = nodes[n];
								// se non è stato già selezionato
								if(ulEl.find("li[data-noderef='"+node.noderef+"']").length==0){
									var html = "<li data-noderef='"+node.noderef+"' class='list-group-item'>"+Formez.Docs.icon(node.name);
									html += node.name+"<span class='pull-right'><a onclick='$(this).parent().parent().remove();'";
									html += " class='btn btn-danger btn-xs'><i class='fa fa-times'></i></a></span></li>";
									ulEl.append(html);
								}
							}
						}
					}
				});
			}
			// set to e cc if is a reprly/forward
			if(this.mode=="reply"){
				this.to.val(this.checkRecipients([this.email.from]));
				this.cc.val("");
				this.subject.val("Re: "+this.email.subject);
			} else if(this.mode=="replyall"){
				this.to.val(this.checkRecipients([this.email.from]));
				this.cc.val(this.checkRecipients($.merge(this.email.to,this.email.cc)));
				this.subject.val("Re: "+this.email.subject);
			} else if(this.mode=="forward"){
				this.subject.val("I: "+this.email.subject);
				this.to.val("");
				this.cc.val("");
			} else {
				this.subject.val("");
				this.to.val("");
				this.cc.val("");
			}
			// add original attahments if is a forward
			if(this.mode=="forward"){
				for(var a in this.email.attachments){
					var node = this.email.attachments[a];
					var html = "<li data-noderef='"+node.noderef+"' class='list-group-item'>"+Formez.Docs.icon(node.name);
					html += node.name+"<span class='pull-right'><a onclick='$(this).parent().parent().remove();'";
					html += " class='btn btn-danger btn-xs'><i class='fa fa-times'></i></a></span></li>";
					this.attachs.append(html);
				}
			} else {
				this.attachs.empty();
				this.attachs.append("<li class='list-group-item toremove'>Nessun allegato...</li>");
			}
			// setup text editor
			this.editor.tinymce({
				theme : "modern",
				width: "100%",
				plugins: ["link image textcolor"],
				toolbar: "bold italic underline | alignleft aligncenter alignright alignjustify" +
				" | bullist numlist outdent indent | forecolor backcolor",
				language: "it"
			});
			// function for email sending
			this.send = function(){
				// check if "to" is valid
				var to = this.to.val();
				if(to.length<6 || to.indexOf("@")==-1){
					Formez.poptime("Campo 'To' non valido!","danger");
					return;
				}
				// check if "cc" is valid
				var cc = this.cc.val();
				if(cc.length>0 && cc.indexOf("@")==-1){
					Formez.poptime("Campo 'Cc' non valido!","danger");
					return;
				}
				// check if "cc" is valid
				var subject = this.subject.val();
				if($.trim(subject.length)==0){
					Formez.poptime("Inserisci un oggetto per la mail!","danger");
					return;
				}
				// get attachs noderefs
				var attachsRefs = [];
				this.attachs.find("li[data-noderef]").each(function(){
					attachsRefs.push($(this).data("noderef"));
				});
				var buttons = this.picker.find(".panel-footer button.btn");
				buttons.prop("disabled", true);
				Formez.wait("Invio dell'email in corso...");
				Formez.Pec.send({
					from: config.account,
					to: to,
					cc: cc,
					subject: subject,
					msg: this.editor.tinymce().getContent(),
					attachs: attachsRefs.toString(),
					callback: function(res){
						if(res.success){
							Formez.poptime("Email inviata con successo!");
							Formez.Picker.sendmail.callback.call(Formez);
							Formez.Picker.sendmail.destroy();
						} else {
							Formez.alert("Errore durante l'invio dell'email!", "danger");
						}
						Formez.waitOff();
						buttons.prop("disabled", false);
					}
				});
			}
			this.destroy = function(){
				this.editor.tinymce().destroy();
				if($(".formez-service:visible").length==1)$("#wrapper").removeClass("formez-service-isopen");
				this.picker.hide().width("0px");
				Formez.Picker.sendmail = null;
			}
			// show picker
			this.picker.show().width("100%");
			$("#wrapper").addClass("formez-service-isopen");
		}
		
		this.sendmail = new sendmail(config);
	},
	// scan picker instance
	scanner: null,
	/**
	 * function to open scan picker
	 * config object:
	 * 		direct: boolean for callback call
	 * 		destination: noderef for upload
	 * 		callback: callback function for selection nodes (name, noderef)
	 */
	scan: function(config){
		// get dom objects
		var scanner = function(config){
			this.picker = $(".formez-service-scan");
			this.selected = this.picker.find(".formez-service-scan-selected");
			this.selected.html("<li class='toremove list-group-item'>Nessun documento...</li>");
			this.scanners = this.picker.find("#formez-service-scan-scanners");
			this.scanners.html("<option value>Carica la lista degli scanner...</option>");
			this.dpi = this.picker.find("#formez-service-scan-dpi");
			this.adf = this.picker.find("#formez-service-scan-adf");
			this.lang = this.picker.find("#formez-service-scan-lang");
			this.ocr = this.picker.find("#formez-service-scan-ocr");
			this.type = this.picker.find("#formez-service-scan-type");
			this.name = this.picker.find("#formez-service-scan-name");
			this.name.val("");
			this.ticket = "";
			// get destination from config
			this.destination = config.destination;
			this.direct = (config.direct==null ? false : config.direct);
			this.callback = config.callback || function(){};
			// cache counter
			this.cache = 0;
			// function for retrieve scanner list
			this.getScanners = function(){
				Formez.wait("Caricamento scanners...");
				$.getJSON(Formez.Picker.localurl+"scan/list", function(res){
					Formez.waitOff();
					if(res.success){
						if(res.scanners.length==0){
							Formez.Picker.scanner.scanners.html("<option value>Nessuno scanner...</option>");
						} else {
							Formez.Picker.scanner.scanners.empty();
							for(var s in res.scanners){
								var scanner = res.scanners[s].split("|");
								var text = scanner[1];
								var value = scanner[0];
								Formez.Picker.scanner.scanners.append("<option value='"+value+"'>"+text+"</option>")
							}
						}
					} else {
						Formez.alert("Impossibile recuperare gli scanner!","warning");
					}
				}).fail(function() {
					Formez.waitOff();
					Formez.poptime("Ricorda di scaricare e avviare l'eseguibile","warning");
				});
			}
			// function to start scanning
			this.start = function(){
				// controllo che sia selezionato uno scanner
				var scanner = this.scanners.val();
				if($.trim(scanner).length==0){
					Formez.poptime("Devi selezionare uno scanner!", "warning");
					return;
				}
				// controllo che ci sia un nome
				var name = this.name.val();
				if($.trim(name).length==0){
					Formez.poptime("Devi specificare un nome per il file!", "warning");
					return;
				}
				// controllo che se è stato scelto ocr sia selezionato
				if(this.ocr.prop("checked") && this.type.val()!=".pdf"){
					Formez.poptime("L'OCR è attivabile solo sul formato PDF!", "warning");
					return;
				}
				this.ticket = "";
				// wait popup
				Formez.wait("Connessione allo scanner in corso...");
				$.ajax({
				    type: "POST",
				    url: Formez.formez_url+"scan/ticket",
				    data: {
				    	language: this.lang.val(),
				    	ocr: this.ocr.prop("checked"),
				    	filetype: this.type.val(),
				    	name: name,
				    	type: "cmis:document",
				    	destination: this.destination
				    },
				    contentType: "application/x-www-form-urlencoded",
				    dataType: 'json',
					success: function(res){
						Formez.Picker.scanner.ticket = res.ticket;
						var url = Formez.Picker.localurl+"scan/start";
						url += "?ticket="+res.ticket;
						url += "&alfticket="+res.alf_ticket;
						url += "&serverurl="+encodeURI(location.host);
						url += "&scanner="+encodeURI(scanner);
						url += "&dpi="+Formez.Picker.scanner.dpi.val();
						url += "&adf="+Formez.Picker.scanner.adf.prop("checked");
						$.getJSON(url, function(res){
							if(res.success){
								setTimeout(Formez.Picker.scanner.progress, 1000);
							} else {
								Formez.alert("Impossibile partire con la scansione...", "danger");
							}
						});
					},
					error: function(){
						Formez.waitOff();
						Formez.alert("Impossibile partire con la scansione...", "danger");
					}
				});
			}
			// function for progress.
			this.progress = function(message){
				$.getJSON(Formez.Picker.localurl+"scan/state?cache="+(++Formez.Picker.scanner.cache), function(res){
					if(res.error){
						Formez.waitOff();
						Formez.alert(res.message, "danger");
					} else {
						if(res.end){
							Formez.Picker.scanner.end();
						} else {
							Formez.wait(res.message);
							setTimeout(Formez.Picker.scanner.progress, 1000);
						}
					}
				});
			}
			// function for close scan process
			this.end = function(){
				// wait popup
				Formez.wait("Caricamento documento/i su alfresco...");
				$.getJSON(Formez.formez_url+"scan/endscan?ticket="+this.ticket).done(function(res){
					// wait popup stop
					Formez.waitOff();
					Formez.alert("Scansione effettuata con successo.<br/>Acquisito/i "+res.noderefs.length+" documento/i");
					Formez.Picker.scanner.selected.find(".toremove").remove();
					for(var r in res.noderefs){
						var node = res.noderefs[r];
						Formez.Picker.scanner.selected.append("<li class='list-group-item' data-noderef='"+node.nodeRef+"'>"+node.fileName+"</li>");
					}
					if(Formez.Picker.scanner.direct){
						Formez.Picker.scanner.ok();
					}
				}).fail(function(){
					Formez.waitOff();
					Formez.alert("Errore durante il caricamento del file su alfresco...","danger");
					Formez.Picker.scanner.destroy();
				});
			}
			this.ok = function(){
				var selected = [];
				this.selected.find("li[data-noderef]").each(function(){
					selected.push({
						noderef: $(this).data("noderef"),
						name: $(this).text()
					});
				});
				if(selected.length>0){
					this.callback(selected);
				}
				this.destroy();
			}
			this.destroy = function(){
				if($(".formez-service:visible").length==1)$("#wrapper").removeClass("formez-service-isopen");
				this.picker.hide().width("0px");
				Formez.Picker.scanner = null;
			}
			// show picker
			this.picker.show().width("100%");
			$("#wrapper").addClass("formez-service-isopen");
		}
		
		var platform = navigator.platform.toLowerCase();
		if(platform.indexOf("x11")>-1 || platform.indexOf("linux")>-1){
			Formez.poptime("Scansione non disponibile su sistemi Unix/Linux","warning");
		} else {
			this.scanner = new scanner(config);
			this.checkLocalhost();
		}
		
	},
	// sign picker instance
	signer: null,
	/**
	 * function to open sign picker
	 * config object:
	 * 		noderefs: noderefs to sign
	 * 		callback: callback function with boolean for success
	 */
	sign: function(config){
		// get dom objects
		var signer = function(config){
			this.picker = $(".formez-service-sign");
			this.selected = this.picker.find(".formez-service-sign-selected");
			this.selected.empty();
			this.certs = this.picker.find("#formez-service-sign-certs");
			this.certs.html("<option value>Carica certificati...</option>");
			this.driver = this.picker.find("#formez-service-sign-driver");
			this.pin = this.picker.find("#formez-service-sign-pin");
			this.pin.val("");
			this.callback = config.callback;
			// show docs
			this.noderefs = config.noderefs;
			for(var n in this.noderefs){
				var drawLine = function(ul, noderef, name){
					var html = "<li class='list-group-item' data-noderef='"+noderef+"'>"+name+"</li>";
					ul.append(html);
				}
				var noderef = this.noderefs[n];
				if(Formez.Docs.docs[noderef]==null){
					var ul = this.selected;
					Formez.Docs.get(noderef, function(item){
						drawLine(ul, noderef, item.properties["cm:name"]);
					});
				} else {
					drawLine(this.selected, noderef, Formez.Docs.docs[noderef].properties["cm:name"]);
				}
			}
			// function for retrieve certificates list
			this.getCertificates = function(){
				var pin = this.pin.val();
				if($.trim(pin)==""){
					Formez.poptime("Inserire il PIN!","warning");
					return;
				}
				this.certs.empty();
				this.certs.append("<option value=''>Caricamento in corso. Attendere...</option>");
				$.getJSON(Formez.Picker.localurl+"sign/certs?driver="+this.driver.val()+"&pin="+pin, function(res){
					if(res.success){
						Formez.Picker.signer.certs.empty();
						for(var c in res.certs){
							var cert = res.certs[c];
							Formez.Picker.signer.certs.append("<option value='"+cert+"'>"+cert.split("|")[0]+"</option>");
						}
					} else {
						Formez.alert(res.error, "danger");
					}
				});
			}
			// function to start signing
			this.sign = function(){
				var cert = this.certs.val().split("|");
				if(cert.length<2){
					Formez.poptime("Certificato non selezionato!","warning");
					return;
				}
				Formez.wait("Seleziono il certificato sul token...");
				$.getJSON(Formez.Picker.localurl+"sign/select?cert="+encodeURI(cert[0]), function(res){
					if(res.success){
						Formez.wait("Calcolo hash del documento...");
						$.ajax({
							type: "POST",
							url: Formez.formez_url+"sign/hash",
							data: {
								noderef: Formez.Picker.signer.noderefs[0],
								cert: cert[1]
							},
							contentType: "application/x-www-form-urlencoded",
							dataType: "json",
							success: function(res){
								if(res.success){
									Formez.wait("Firma dell'hash in corso...");
									$.getJSON(Formez.Picker.localurl+"sign/sign?fingerprint="+res.fingerprint, function(res){
										if(res.success){
											Formez.wait("Applicazione firma sul documento...");
											$.ajax({
												type: "POST",
												url: Formez.formez_url+"sign/signer",
												data: {
													noderef: Formez.Picker.signer.noderefs[0],
													signed: res.signed 
												},
												contentType: "application/x-www-form-urlencoded",
												dataType: "json",
												success: function(res){
													if(res.success){
														Formez.waitOff();
														Formez.poptime("Firma eseguita con successo!");
														Formez.Picker.signer.callback();
														Formez.Picker.signer.destroy();
													} else {
														Formez.waitOff();
														Formez.alert("Errore durante il processo di firma!","danger");
														Formez.Picker.signer.destroy();
													}
												}
											});
										} else {
											Formez.waitOff();
											Formez.alert("Errore durante il processo di firma!","danger");
											Formez.Picker.signer.destroy();
										}
									});
								} else {
									Formez.waitOff();
									Formez.alert("Errore durante il processo di firma!","danger");
									Formez.Picker.signer.destroy();
									return;
								}
							}
						});
					} else {
						Formez.waitOff();
						Formez.alert(res.error, "danger");
						Formez.Picker.signer.destroy();
					}
				});
			}
			this.destroy = function(){
				if($(".formez-service:visible").length==1)$("#wrapper").removeClass("formez-service-isopen");
				this.picker.hide().width("0px");
				Formez.Picker.signer = null;
			}
			// show picker
			this.picker.show().width("100%");
			$("#wrapper").addClass("formez-service-isopen");
		}
		
		this.signer = new signer(config);
		this.checkLocalhost();
		
	},
	// form picker instance
	form: null,
	/**
	 * function to open form picker
	 * config object:
	 * 		mode: 'new' or 'edit' (default is new)
	 * 		type: type to create or edit
	 * 		noderef: parent for mode new, node for mode edit
	 * 		form: name of form to draw (default is "create")
	 * 		callback: callback function with boolean for success
	 */
	getForm: function(config){
		// get dom objects
		var form = function(config){
			this.picker = $(".formez-service-form");
			this.form = this.picker.find(".formez-service-form-form");
			this.header = this.picker.find(".formez-service-form-header");
			// config object
			this.mode = config.mode || "new";
			this.formName = config.form || "create";
			this.type = config.type;
			this.noderef = config.noderef;
			this.callback = config.callback;
			// empty form
			this.form.empty();
			var buildForm = function(node){
				// if mode is "edit", props values are in this array
				var propsValues = null;
				if(this.mode=="edit"){
					propsValues = node.properties;
				} else {
					propsValues = {}
				}
				// get type definition
				var typeDef = Formez.types[this.type];
				// build html form
				this.mode=="new" ? this.header.html("Nuovo "+typeDef.name) : this.header.html("Modifica "+typeDef.name);
				this.form.append("<input type='hidden' name='type' value='"+this.type+"' />");
				this.form.append("<input type='hidden' name='noderef' value='"+this.noderef+"' />");
				this.form.append("<input type='hidden' name='mode' value='"+this.mode+"' />");
				for(var p in typeDef.props){
					var prop = typeDef.props[p];
					if(prop.form.indexOf(this.formName)>-1){
						var html = "<div class='form-group'>";
						html += "<label class='control-label col-sm-3'>"+prop.title+"</label>";
						html += "<div class='col-sm-8'>";
						if(prop.type=="string" || prop.type=="number"){
							html += "<input type='text' name='"+prop.name+"|"+prop.type+"' class='form-control' ";
							if(prop.help){
								html += "placeholder='Help: "+prop.help+"' "
							} else {
								html += "placeholder='Inserisci "+prop.title.toLowerCase()+"...' "
							}
							if(prop.mandatory){
								html += "data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!' ";
							}
							if(prop.range){
								var range = prop.range.split(",");
								html += "data-bv-between='true' data-bv-between-message='Campo non valido!' data-bv-between-min='"+range[0]+"' ";
								html += "data-bv-between-max='"+range[1]+"' data-bv-between-inclusive='false' ";
							}
							if(prop.check=="email"){
								html += "data-bv-emailaddress='true' data-bv-emailaddress-message='Email non valida!' ";
							}
							if(prop.type=="number"){
								if(prop.decimal){
									html += "data-bv-numeric='true' data-bv-numeric-message='Il campo deve essere numerico!' ";
								} else {
									html += "data-bv-integer='true' data-bv-integer-message='Il campo deve essere numerico!' ";
								}
							}
							html += "value='"+(propsValues[prop.name] || "")+"' ";
							html += "/>";
						}
						else if(prop.type=="password"){
							html += "<input type='password' name='"+prop.name+"|"+prop.type+"' class='form-control' placeholder='Inserisci "+prop.title.toLowerCase()+"...' ";
							if(prop.mandatory){
								html += "data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!' ";
							}
							html += "value='"+(propsValues[prop.name] || "")+"' ";
							html += "/>";
						}
						else if(prop.type=="select"){
							var selectValue = propsValues[prop.name] || "";
							html += "<select class='form-control' name='"+prop.name+"|"+prop.type+"'>";
							var choices = prop.choices.split(",");
							for(var c in choices){
								var choice = choices[c];
								var optionName, optionValue = "";
								if(choice.indexOf("|")>-1){
									var options = choice.split("|");
									optionValue = options[0];
									optionName = options[1];
								} else {
									optionValue = choice;
									optionName = choice;
								}
								html += "<option value='"+optionValue+"' "+(selectValue==optionValue?"selected":"")+">"+optionName+"</option>";
							}
							html += "</select>"
						}
						else if(prop.type=="boolean"){
							html += "<input type='checkbox' data-name='"+prop.name+"|"+prop.type+"' class='formez-service-form-checkbox' ";
							html += (propsValues[prop.name]=="true"?"checked='checked'":"") + ">";
						}
						else if(prop.type=="textarea"){
							html += "<textarea class='form-control' name='"+prop.name+"|"+prop.type+"' rows='5'>"+(propsValues[prop.name] || "")+"</textarea>";
						}
						else if(prop.type=="date"){
							html += "<input type='text' name='"+prop.name+"|"+prop.type+"' placeholder='Inserisci "+prop.title.toLowerCase()+"...' class='form-control formez-service-form-date'";
							if(prop.mandatory){
								html += " data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!'";
							}
							var dateValue = "";
							if(propsValues[prop.name]){
								dateValue = Formez.formatIsoDate(propsValues[prop.name]).split(" ")[0];
							}
							html += " value='"+dateValue+"' ";
							html +=" />";
						}
						else if(prop.type=="zipcode"){
							html += "<input type='text' name='"+prop.name+"|"+prop.type+"' class='form-control' ";
							if(prop.help){
								html += "placeholder='Help: "+prop.help+"' "
							} else {
								html += "placeholder='Inserisci "+prop.title.toLowerCase()+"...' "
							}
							if(prop.mandatory){
								html += "data-bv-notempty='true' data-bv-notempty-message='Campo obbligatorio!' ";
							}
							html += "data-bv-zipcode='true' data-bv-zipcode-country='IT' data-bv-zipcode-message='CAP non valido' ";
							html += "data-bv-stringlength='true' data-bv-stringlength-min='5' data-bv-stringlength-message=' ' ";
							html += "value='"+(propsValues[prop.name] || "")+"' ";
							html += " />";
						}
						html += "</div></div>";
						this.form.append(html);
					}
				}
				this.form.find(".formez-service-form-checkbox").bootstrapSwitch({
					size: "small"
				});
				this.form.find(".formez-service-form-date").datepicker({
			    	format: "dd/mm/yyyy",
				    todayBtn: "linked",
				    language: "it",
				    autoclose: true,
				    todayHighlight: true,
				    weekStart: 1
			    }).on("changeDate", function(){
			    	// ### fix bootstrap validator bug: not set "NOT_VALIDATED" without key event
			    	$(this).data("bv.result.notEmpty","NOT_VALIDATED");
			    });
				this.form.bootstrapValidator({
					excluded: [':hidden'],
					feedbackIcons: {
				        valid: 'glyphicon glyphicon-ok',
				        invalid: 'glyphicon glyphicon-remove',
				        validating: 'glyphicon glyphicon-refresh'
				    },
				    live: 'enabled'
				});
			}
			// if mode is "edit", retrieve node for existing values
			if(this.mode=="edit"){
				Formez.Docs.get(this.noderef, function(item){
					buildForm.call(Formez.Picker.form, item);
				});
			} else {
				buildForm.call(this, null);
			}
			this.go = function(){
				this.form.data('bootstrapValidator').validate();
				if(this.form.data('bootstrapValidator').isValid()){
					var data = this.form.serialize();
					this.form.find(".formez-service-form-checkbox").each(function(){
						var el = $(this);
						data += "&"+el.data("name")+"="+el.prop("checked");
					});
					$.ajax({
						type: "POST",
						url: Formez.formez_url+"picker/form",
						data: data,
						contentType: "application/x-www-form-urlencoded",
						datatype: "json",
						success: function(res){
							if(res.success){
								var mode = Formez.Picker.form.mode=="new" ? "creato" : "modificato";
								Formez.poptime(Formez.types[Formez.Picker.form.type].name+" "+mode+" correttamente!");
								Formez.Picker.form.callback(res.noderef);
								Formez.Picker.form.destroy();
							} else {
								alert("Errore imprevisto!");
								location.reload();
							}
						}
					});
				}
			}
			this.destroy = function(){
				this.form.removeData('bootstrapValidator');
				if($(".formez-service:visible").length==1)$("#wrapper").removeClass("formez-service-isopen");
				this.picker.hide().width("0px");
				Formez.Picker.form = null;
			}
			// show picker
			this.picker.show().width("100%");
			$("#wrapper").addClass("formez-service-isopen");
		}
		
		this.form = new form(config);
		
	},
	// preview picker instance
	preview: null,
	/**
	 * function to open doc preview
	 * config object:
	 * 		noderef: noderef to preview
	 */
	showPreview: function(config){
		// wait...
		Formez.wait("Caricamento in corso...");
		// get dom objects
		var preview = function(config){
			this.picker = $(".formez-service-preview");
			this.name = this.picker.find(".formez-service-preview-name");
			this.name.empty();
			this.current = this.picker.find(".formez-service-preview-page");
			this.current.empty();
			this.canvas = this.picker.find(".formez-service-preview-canvas");
			this.canvas.addClass("hide");
			this.inputPage = this.picker.find(".formez-service-preview-numpage");
			this.noderef = config.noderef;
			this.node = Formez.Docs.docs[this.noderef];
			// properties for viewer
			this.pdf = null;
			this.scale = 1;
			this.page = 0;
			this.pages = 0;
			// me variable for scope injection
			var me = this;
			// function for start preview
			this.preview = function(node){
				me.name.html("Anteprima: "+node.properties["cm:name"]);
				PDFJS.getDocument(Formez.formez_url+"picker/preview?noderef="+node.nodeRef).then(function(pdf){
					me.pdf = pdf;
					me.pages = pdf.numPages;
					me.drawPage(1);
					me.canvas.removeClass("hide");
					Formez.waitOff();
				});
			}
			// function for draw a page
			this.drawPage = function(number){
				me.page = number;
				me.current.html("Pagina "+number+" di "+me.pages);
				me.inputPage.val(number);
				me.pdf.getPage(number).then(function(page){
					var height = window.innerHeight*0.8;
					var viewport = page.getViewport(1);
					// me.scale is for zoom function
					var scale = height / viewport.height * me.scale;
					viewport = page.getViewport(scale);
					// controllo che nonostante lo scale, il width sia troppo grande (succede per formati diversi da A4)
					if(viewport.width>window.innerWidth/2){
						viewport = page.getViewport(window.innerWidth / 2 * scale / viewport.width);
					}
					var canvas = me.canvas[0];
					var context = canvas.getContext('2d');
					canvas.height = viewport.height;
					canvas.width = viewport.width;
					var renderContext = {
						canvasContext: context,
						viewport: viewport
					};
					page.render(renderContext);
				});
			}
			// draw next page
			this.next = function(){
				if(this.page<this.pages){
					this.drawPage(this.page+1);
				}
			}
			// draw prev page
			this.prev = function(){
				if(this.page>1){
					this.drawPage(this.page-1);
				}
			}
			// zoom current page
			this.zoom = function(){
				if(this.scale<1.41){
					this.scale += 0.1;
					this.drawPage(this.page);
				}
			}
			this.dezoom = function(){
				if(this.scale>0.51){
					this.scale -= 0.1;
					this.drawPage(this.page);
				}
			} 
			// draw to specified page
			this.gotoPage = function(){
				var val = this.inputPage.val();
				if(val.length>0 && !isNaN(parseInt(val))){
					var value = parseInt(val);
					if(value>0 && value<=this.pages){
						this.drawPage(value);
					}
				}
			}
			if(this.node){
				this.preview(this.node);
			} else {
				Formez.Docs.get(this.noderef, function(item){
					Formez.Picker.preview.node = item;
					Formez.Picker.preview.preview(item);
				});
			}
			this.destroy = function(){
				if($(".formez-service:visible").length==1)$("#wrapper").removeClass("formez-service-isopen");
				this.picker.hide().width("0px");
				Formez.Picker.preview = null;
			}
			// show picker
			this.picker.show().width("100%");
			$("#wrapper").addClass("formez-service-isopen");
		}
		
		this.preview = new preview(config);
		
	}
}
	
})();
