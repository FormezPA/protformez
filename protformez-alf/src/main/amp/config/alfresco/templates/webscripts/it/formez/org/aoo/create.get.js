model.success = false;

var name = args.name;
var prefix = args.prefix.toLowerCase();
// controllo che non esista già un sito col lo stesso prefix
if(siteService.getSite(prefix)!=null){
	throw("Prefisso già utilizzato per altro aoo!");
}

var aoo = siteService.createSite("formez-site", prefix, name, name, "PRIVATE");
if(aoo==null){
	throw("Errore durante la creazione dell'aoo");
}

// creo tutti i container
var doclib = aoo.createContainer("documentLibrary", "tit:baseFolder");
Packages.it.formez.reg.service.ProtocolService.createProtocolContainer(prefix);
var org = aoo.createContainer("org", "org:nodeUo");
var roles = aoo.createContainer("roles");
aoo.createContainer("auditLists");
aoo.createContainer("pec");
aoo.createContainer("shared");
aoo.createContainer("homes");
aoo.createContainer("daily");
aoo.createContainer("cos", "cos:base");
aoo.createContainer("ldi");
aoo.createContainer("h2h");

doclib.addAspect("tit:counters");
doclib.properties["tit:counterTitolo"] = "1";
doclib.properties["tit:counterClasse"] = "1";
doclib.properties["tit:counterFascicolo"] = "1";
doclib.save();

// nella doclib creo delle cartelle di default (e audit)
var titolo = doclib.createNode("Documenti Digitali", "tit:titolo", {"tit:titoloStato":"Aperto" , "tit:baseFolderNumber": "1"});
Packages.it.formez.reg.service.AuditService.createTit(titolo.nodeRef);
var classe = titolo.createNode(new Date().getFullYear(), "tit:classe", {"tit:baseFolderNumber": "1"});
Packages.it.formez.reg.service.AuditService.createTit(classe.nodeRef);
var fascicolo = classe.createNode("Da Lavorare", "tit:fascicolo", {"tit:fascicoloStato":"Aperto",  "tit:baseFolderNumber": "1"});
Packages.it.formez.reg.service.AuditService.createTit(fascicolo.nodeRef);

// creo i ruoli di default
var admin = roles.createNode("Amministratore","org:role");
admin.properties["org:canAdmin"] = true;
admin.save();
var arch = roles.createNode("Archivista","org:role");
arch.properties["org:canTitolario"] = true;
arch.properties["org:canFascicoli"] = true;
arch.save();
var prot = roles.createNode("Protocollatore","org:role");
prot.properties["org:canProtocolReadIn"] = true;
prot.properties["org:canProtocolReadEnt"] = true;
prot.properties["org:canProtocolReadUsc"] = true;
prot.properties["org:canProtocolCreateIn"] = true;
prot.properties["org:canProtocolCreateUsc"] = true;
prot.properties["org:canProtocolCreateEnt"] = true;
prot.properties["org:canProtocolEdit"] = true;
prot.properties["org:canProtocolReport"] = true;
prot.properties["org:canProtocolPrenotation"] = true;
prot.properties["org:canProtocolCancel"] = true;
prot.properties["org:canProtocolAudit"] = true;
prot.save();

// associo l'utente corrente a org
org.createAssociation(person, "org:usersAssoc");

// aggiungo ruolo admin
org.createAssociation(admin, "org:rolesAssoc");

// aggiungo gli aspetti delle configurazioni al sito
// aoo configuration
aoo.node.addAspect("cfg:aoo");
// servizi postali
aoo.node.addAspect("cfg:h2h");
// legaldoc
aoo.node.addAspect("cfg:ldi");
// conservazione
aoo.node.addAspect("cfg:cos");

// sys hidden (no site visible from share)
//aoo.node.addAspect("sys:hidden");

// fine
model.aoo = aoo.node;
model.success = true;