function(doc){
	if(doc.type === "sr"){
		emit(doc._id, {
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