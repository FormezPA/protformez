var name = args.name;
var address = args.address || "";
var city = args.city || "";
var cap = args.cap || "";
var district = args.district || "";

if(name.length>0){
	
	var adbFolder = companyhome.childByNamePath("Formez/adb");
	model.contact = adbFolder.createNode(null, "addbook:contact", {
		"addbook:name":name,
		"addbook:address":address,
		"addbook:cap":cap,
		"addbook:city":city,
		"addbook:district":district
	});
	
} else {
	throw("Parametri non validi!");
}
