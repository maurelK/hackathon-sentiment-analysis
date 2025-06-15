console.log('🚀 Démarrage du serveur...');

const express = require('express');
const app = express();
const PORT = 3000;

console.log('✅ Express chargé');

app.use(express.static('public'));
console.log('✅ Middleware configuré');

app.get('/api/test', (req, res) => {
    console.log('📡 API test appelée');
    res.json({ status: 'OK', message: 'Serveur fonctionne !' });
});

app.get('/', (req, res) => {
    console.log('🏠 Page d\'accueil demandée');
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log('✅ Tout fonctionne !');
});

console.log('📝 Configuration terminée');