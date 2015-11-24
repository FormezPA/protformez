<#escape x as jsonUtils.encodeJSONString(x)>
{
	"total": ${children?size},
	"items": [
		<#list children as child>
		{
			"path": "${path}",
			"node": <#noescape>${child}</#noescape>
		}<#if child_has_next>,</#if>
		</#list>
	]
}
</#escape>