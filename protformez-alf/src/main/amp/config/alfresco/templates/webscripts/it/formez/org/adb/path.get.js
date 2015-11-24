var node = companyhome.childByNamePath("Formez/adb");
if(node==null){
	var formezFolder = companyhome.childByNamePath("Formez");
	if(formezFolder==null){
		formezFolder = companyhome.createFolder("Formez");
		formezFolder.setPermission("Contributor");
	}
	node = formezFolder.createFolder("adb");
}

model.node = node;
