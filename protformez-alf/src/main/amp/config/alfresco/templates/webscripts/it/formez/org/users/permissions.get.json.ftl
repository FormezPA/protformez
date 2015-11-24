<#escape x as jsonUtils.encodeJSONString(x)>
{
	"canAdmin": ${perms["canAdmin"]?string},
	"canProtocolReadEnt": ${perms["canProtocolReadEnt"]?string},
	"canProtocolReadUsc": ${perms["canProtocolReadUsc"]?string},
	"canProtocolReadIn": ${perms["canProtocolReadIn"]?string},
	"canProtocolCreateEnt": ${perms["canProtocolCreateEnt"]?string},
	"canProtocolCreateUsc": ${perms["canProtocolCreateUsc"]?string},
	"canProtocolCreateIn": ${perms["canProtocolCreateIn"]?string},
	"canProtocolEdit": ${perms["canProtocolEdit"]?string},
	"canProtocolCancel": ${perms["canProtocolCancel"]?string},
	"canProtocolPrenotation": ${perms["canProtocolPrenotation"]?string},
	"canProtocolReport": ${perms["canProtocolReport"]?string},
	"canProtocolAudit": ${perms["canProtocolAudit"]?string},
	"canTitolario": ${perms["canTitolario"]?string},
	"canFascicoli": ${perms["canFascicoli"]?string}
}
</#escape>