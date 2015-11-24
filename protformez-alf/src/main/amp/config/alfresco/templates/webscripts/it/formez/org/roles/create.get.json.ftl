<#escape x as jsonUtils.encodeJSONString(x)>
{
	"noderef": "${role.nodeRef.toString()}",
	"role": {
		"name": "${role.name}",
		"canAdmin": ${role.properties["org:canAdmin"]?string},
		"canProtocolReadEnt": ${role.properties["org:canProtocolReadEnt"]?string},
		"canProtocolReadUsc": ${role.properties["org:canProtocolReadUsc"]?string},
		"canProtocolReadIn": ${role.properties["org:canProtocolReadIn"]?string},
		"canProtocolCreateEnt": ${role.properties["org:canProtocolCreateEnt"]?string},
		"canProtocolCreateUsc": ${role.properties["org:canProtocolCreateUsc"]?string},
		"canProtocolCreateIn": ${role.properties["org:canProtocolCreateIn"]?string},
		"canProtocolEdit": ${role.properties["org:canProtocolEdit"]?string},
		"canProtocolCancel": ${role.properties["org:canProtocolCancel"]?string},
		"canProtocolPrenotation": ${role.properties["org:canProtocolPrenotation"]?string},
		"canProtocolReport": ${role.properties["org:canProtocolReport"]?string},
		"canProtocolAudit": ${role.properties["org:canProtocolAudit"]?string},
		"canTitolario": ${role.properties["org:canTitolario"]?string},
		"canFascicoli": ${role.properties["org:canFascicoli"]?string}
	}
}
</#escape>