<#escape x as jsonUtils.encodeJSONString(x)>
{
	"items": [
	<#list items?keys as key>
		{
			"noderef":"${key}",
			"number":"${items[key]}"
		}<#if key_has_next>,</#if>
	</#list>
	],
	"date":"${date}",
	"success":"${success}"
}
</#escape>