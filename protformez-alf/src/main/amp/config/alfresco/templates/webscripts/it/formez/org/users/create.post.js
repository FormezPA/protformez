var user = people.getPerson(args.user);
if(user==null){
	model.user = people.createPerson(args.user, args.name, args.surname, args.email, args.pass, true);
} else {
	model.user = null;
}
