(function() {
	
	var program = chinachu.getProgramById(request.param.id, data.recording);
	
	if (program === null) return response.error(404);
	
	switch (request.method) {
		case 'GET':
			response.head(200);
			response.end(JSON.stringify(program, null, '  '));
			return;
		
		case 'DELETE':
			if (chinachu.killProcess(program.pid)) {
				response.head(200);
				response.end('{}');
			} else {
				response.error(500);
			}
			return;
	}

})();