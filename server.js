const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello from hackathon server!');
});

app.listen(PORT, () => {
    console.log(` Serveur test sur http://localhost:${PORT}`);
});