<#escape x as jsonUtils.encodeJSONString(x)>
{
	"success": ${success?string},
	"noderef": "${folder.nodeRef.toString()}"
}
</#escape>