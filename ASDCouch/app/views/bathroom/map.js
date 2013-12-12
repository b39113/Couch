function(doc){
	if(doc.type === "bathroom"){
		emit(doc._id, {
			"Category": doc.type,
			"Title": doc.Title,
			"srDate": doc.srDate,
			"srName": doc.srName,
			"srPhone": doc.srPhone,
			"srWarranty": doc.srWarranty,
			"srExpires": doc.srExpires,
			"srDesc": doc.srDesc
		});
	}
};