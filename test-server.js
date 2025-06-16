const express = require('express');
const path = require('path');
const app = express();

console.log('📁 Dossier public:', path.join(__dirname, 'public'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    console.log('🏠 Page d\'accueil demandée');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3001, () => {
    console.log('🚀 Serveur test sur http://localhost:3001');
});