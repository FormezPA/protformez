<#escape x as jsonUtils.encodeJSONString(x)>
{
	"total": ${results?size},
	"results": {
		<#list results as result>
		"${result.nodeRef.toString()}": {
			"protocol": "${result.properties["reg:protocolNumber"]}",
			"date": "${result.properties["reg:protocolDate"]?string("dd.MMM.yyyy HH:mm:ss")}",
			"direction": "${result.properties["reg:directionType"]}",
			"subject": "${result.properties["reg:subject"]}",
			"document": [
				<#if result.assocs["reg:protocolDocument"]??>
					<#assign document = result.assocs["reg:protocolDocument"][0]>
					{
						"name": "${document.name}",
						"noderef": "${document.nodeRef.toString()}"
					}
				</#if>
			],
			"attachs": [
				<#if result.assocs["reg:attachments"]??>
					<#list result.assocs["reg:attachments"] as attach>
					{
						"name": "${attach.name}",
						"noderef": "${attach.nodeRef.toString()}"
					}<#if attach_has_next>,</#if>
					</#list>
				</#if>
			],
			"assign": "${result.properties["reg:assignState"]!""}",
			"users": [
				<#if result.properties["reg:assignUsers"]??>
					<#list result.properties["reg:assignUsers"] as user>
					<#assign person = people.getPerson(user)>
					{
						"username": "${user}",
						"name": "${person.properties["cm:firstName"]!""} ${person.properties["cm:lastName"]!""}"
					}<#if user_has_next>,</#if>
					</#list>
				</#if>
			]
		}<#if result_has_next>,</#if>
		</#list>
	}
}
</#escape>