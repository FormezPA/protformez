<#escape x as jsonUtils.encodeJSONString(x)>
{
	"total": ${parents?size},
	"items": [
		<#list parents as parent><#noescape>${parent}</#noescape><#if parent_has_next>,</#if>
		</#list>
	]
}
</#escape>