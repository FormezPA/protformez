<#escape x as jsonUtils.encodeJSONString(x)>
{
	"total": ${total},
	"results": {
		<#list results as result>
		"${result.nodeRef.toString()}": {
			"protocol": "${result.properties["reg:protocolNumber"]}",
			"date": "${result.properties["reg:protocolDate"]?string("dd.MMM.yyyy HH:mm:ss")}",
			"direction": "${result.properties["reg:directionType"]}",
			"status": "${result.properties["reg:status"]}",
			"subject": "${result.properties["reg:subject"]}",
			"hash": "${result.properties["reg:hashCode"]!""}",
			"classification": [
				<#if result.assocs["reg:filing"]??>
					<#list result.assocs["reg:filing"] as filing>
					{
						"name": "${filing.displayPath}/${filing.name}",
						"noderef": "${filing.nodeRef.toString()}"
					}<#if filing_has_next>,</#if>
					</#list>
				</#if>
			],
			"document": [
				<#if result.assocs["reg:protocolDocument"]??>
					<#assign document = result.assocs["reg:protocolDocument"][0]>
					{
						"name": "${document.name}",
						"noderef": "${document.nodeRef.toString()}"
					}
				</#if>
			],
			"senders": [
				<#if result.assocs["reg:sender"]??>
					<#list result.assocs["reg:sender"] as sender>
					{
						"name": "${sender.properties["addbook:name"]}",
						"noderef": "${sender.nodeRef.toString()}"
					}<#if sender_has_next>,</#if>
					</#list>
				</#if>
			],
			"receivers": [
				<#if result.assocs["reg:receiver"]??>
					<#list result.assocs["reg:receiver"] as receiver>
					{
						"name": "${receiver.properties["addbook:name"]}",
						"noderef": "${receiver.nodeRef.toString()}"
					}<#if receiver_has_next>,</#if>
					</#list>
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
			"deliverymode": "${result.properties["reg:deliveryMode"]}",
			"senderprot": {
				"number": "${result.properties["reg:documentProtocolNumber"]!""}",
				<#if result.properties["reg:documentDate"]?? >
				"date": "${result.properties["reg:documentDate"]?string("dd.MMM.yyyy")}"
				<#else>
				"date": ""
				</#if>
			},
			"emergency": {
				"number": "${result.properties["reg:emergencyProtocolNumber"]!""}",
				<#if result.properties["reg:emergencyProtocolDate"]?? >
				"date": "${result.properties["reg:emergencyProtocolDate"]?string("dd.MMM.yyyy")}"
				<#else>
				"date": ""
				</#if>
			},
			"notes": "${result.properties["reg:notes"]}",
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