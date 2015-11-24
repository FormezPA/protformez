<#escape x as jsonUtils.encodeJSONString(x)>
{
   "name": "${contact.properties["addbook:name"]}",
   "address": "${contact.properties["addbook:address"]}",
   "city": "${contact.properties["addbook:city"]}",
   "cap": "${contact.properties["addbook:cap"]}",
   "district": "${contact.properties["addbook:district"]}", 
   "noderef": "${contact.nodeRef.toString()}"
}
</#escape>