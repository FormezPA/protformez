<#escape x as jsonUtils.encodeJSONString(x)>
{"roles":{
	<#list roles as role>
	"${role.nodeRef.toString()}": {
		"name": "${role.name}",
		"canAdmin": ${(role.properties["org:canAdmin"]!false)?string},
		"canProtocolReadEnt": ${(role.properties["org:canProtocolReadEnt"]!false)?string},
		"canProtocolReadUsc": ${(role.properties["org:canProtocolReadUsc"]!false)?string},
		"canProtocolReadIn": ${(role.properties["org:canProtocolReadIn"]!false)?string},
		"canProtocolCreateEnt": ${(role.properties["org:canProtocolCreateEnt"]!false)?string},
		"canProtocolCreateUsc": ${(role.properties["org:canProtocolCreateUsc"]!false)?string},
		"canProtocolCreateIn": ${(role.properties["org:canProtocolCreateIn"]!false)?string},
		"canProtocolEdit": ${(role.properties["org:canProtocolEdit"]!false)?string},
		"canProtocolCancel": ${(role.properties["org:canProtocolCancel"]!false)?string},
		"canProtocolPrenotation": ${(role.properties["org:canProtocolPrenotation"]!false)?string},
		"canProtocolReport": ${(role.properties["org:canProtocolReport"]!false)?string},
		"canProtocolAudit": ${(role.properties["org:canProtocolAudit"]!false)?string},
		"canTitolario": ${(role.properties["org:canTitolario"]!false)?string},
		"canFascicoli": ${(role.properties["org:canFascicoli"]!false)?string}
	}<#if role_has_next>,</#if>
	</#list>
}}
</#escape>