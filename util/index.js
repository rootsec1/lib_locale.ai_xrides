module.exports.respond = (error, data, request, response) => {
    if(error) {
        console.log('[!SERVER] '+request.method+' '+request.url);
        response.json({ 'success': false, 'error': error });
    } else response.json({ 'success': true, 'data': data });
};
