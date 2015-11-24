<#escape x as jsonUtils.encodeJSONString(x)>
{
	"pec": ${pec},
	"ldi": ${ldi?string},
	"h2h": ${h2h?string},
	"modules": {
		"pec": ${companyhome.properties["cfg:modulePec"]?string},
		"cos": ${companyhome.properties["cfg:moduleCos"]?string},
		"flow": ${companyhome.properties["cfg:moduleFlow"]?string},
		"inv": ${companyhome.properties["cfg:moduleInv"]?string},
		"ldi": ${companyhome.properties["cfg:moduleLdi"]?string},
		"h2h": ${companyhome.properties["cfg:moduleH2h"]?string}
	}
}
</#escape>