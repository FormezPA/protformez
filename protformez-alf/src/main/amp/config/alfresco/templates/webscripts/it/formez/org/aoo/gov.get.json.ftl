<#escape x as jsonUtils.encodeJSONString(x)>
{
	"noderef": "${gov.nodeRef.toString()}",
	"name": "${gov.properties["org:govName"]!""}",
	"code": "${gov.properties["org:govCode"]!""}"
}
</#escape>