var task = workflow.getTask(args.tid);
var properties = task.properties;

function pad(number) {
  if ( number < 10 ) {
    return '0' + number;
  }
  return number;
}
 
function convertDate(data) {
	return data.getUTCFullYear() +
    '-' + pad(data.getUTCMonth() + 1 ) +
    '-' + pad(data.getUTCDate() ) +
    'T' + pad(data.getUTCHours() ) +
    ':' + pad(data.getUTCMinutes() ) +
    ':' + pad(data.getUTCSeconds() ) +
    '.' + (data.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    'Z';
}

var tid, noderefs = null;
var props = {}
for(var a in args){
	if(a=="bpm:package"){
		//
	} else if(a!="tid" && a!="alf_ticket"){
		props[a] = args[a];
	}
}

for(var p in props){
	if(p.indexOf("|")>-1){
		var value = props[p];
		var propSplit = p.split("|");
		var propName = propSplit[0].replace(" ","");
		var datatype = propSplit[1].replace(" ","");
		if(value!=null){
			if(datatype=="boolean"){
				properties[propName] = value=="true"?true:false;
			} else if(datatype=="date"){
				if(value!=""){
					valueSplit = value.split("/");
					var data = new Date(valueSplit[2],valueSplit[1]-1,valueSplit[0],"12","0","0");
					properties[propName] = convertDate(data).toString();
					//properties[propName] = new Date(valueSplit[2],valueSplit[1]-1,valueSplit[0],"12","0","0");//Probably Bug
					//properties[propName] = new Date(valueSplit[2],valueSplit[1]-1,valueSplit[0],"12","0","0").toISOString(); //ONLY in ALFRESCO 5
					//logger.warn("PRP:        " + properties[propName]);
				} else {
					properties[propName] = null;
				}
			} else if(datatype=="number"){
				if(value!=""){
					properties[propName] = value;
				} else {
					properties[propName] = null;
				}
			} else {
				properties[propName] = value;
			}
		}
	}
	else{//Is Association
		var value = props[p];
		if(value!=null){
			properties[p] = value;
		}		
	}
}

task.setProperties(properties);
task.endTask(null);

model.success = true;
