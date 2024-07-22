import http from 'http'

const server = http.createServer((req, res) => {
    console.log(req.url)
    const { url } = req
    if(url==='/') return res.end('hello, this is my server');
    if (url==='/nombre') return res.end('my name is carlos');

});

//local host 8000 -> 127.0.0.1
server.listen(8000, error =>{
    if(error) console.log(error)
        console.log('listening port 8000')
})
