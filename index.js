const port = 8080;
const Net = require('net');
const fs = require('fs');
const server = new Net.Server();

server.listen(port, () => console.log(`Server listening for connection requests on socket localhost:${port}`));

server.on('connection', function (socket) {
    console.log('A new connection has been established.');

    socket.on('data', chunk => {
        const raw = fs.readFileSync('data.json')
        const json = JSON.parse(raw.toString())
        const data = chunk.toString()
        console.log(`Data received from client: ${data}`);

        if (data === 'toggle') {
            const currentJson = JSON.stringify({
                ...json,
                status: json.status === 1 ? 0 : 1,
                temperature: json.status === 1 ? '245.45' : '124.13'
            },null,2)
            socket.write(currentJson);
            fs.writeFileSync('data.json', currentJson)
        }
        if (data === 'get_data') {
            socket.write(raw.toString());
        }
    });

    socket.on('end', function () {
        console.log('Closing connection with the client');
    });

    socket.on('error', function (err) {
        console.log(`Error: ${err}`);
    });
});
