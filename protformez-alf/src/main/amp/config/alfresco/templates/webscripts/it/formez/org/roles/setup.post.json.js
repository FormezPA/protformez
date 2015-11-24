var jsonObj = jsonUtils.toObject(json); 
var role = search.findNode(jsonObj.noderef);
role.properties["org:canAdmin"] = jsonObj.canAdmin;
role.properties["org:canProtocolReadEnt"] = jsonObj.canProtocolReadEnt;
role.properties["org:canProtocolReadUsc"] = jsonObj.canProtocolReadUsc;
role.properties["org:canProtocolReadIn"] = jsonObj.canProtocolReadIn;
role.properties["org:canProtocolCreateEnt"] = jsonObj.canProtocolCreateEnt;
role.properties["org:canProtocolCreateUsc"] = jsonObj.canProtocolCreateUsc;
role.properties["org:canProtocolCreateIn"] = jsonObj.canProtocolCreateIn;
role.properties["org:canProtocolEdit"] = jsonObj.canProtocolEdit;
role.properties["org:canProtocolCancel"] = jsonObj.canProtocolCancel;
role.properties["org:canProtocolPrenotation"] = jsonObj.canProtocolPrenotation;
role.properties["org:canProtocolReport"] = jsonObj.canProtocolReport;
role.properties["org:canProtocolAudit"] = jsonObj.canProtocolAudit;
role.properties["org:canTitolario"] = jsonObj.canTitolario;
role.properties["org:canFascicoli"] = jsonObj.canFascicoli;
role.save();

model.role = role;
