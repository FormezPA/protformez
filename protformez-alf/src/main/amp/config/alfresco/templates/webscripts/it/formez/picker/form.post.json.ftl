<#escape x as jsonUtils.encodeJSONString(x)>
{
	"success":${success?string},
	"noderef":"${node.nodeRef.toString()}"
}
</#escape>