const express = require('express');
const app = express();

app.get('/', (req, res) => res.json({ status: 'ok', version: process.env.APP_VERSION || '1.0' }));
app.get('/health', (req, res) => res.json({ healthy: true }));
app.get('/version', (req, res) => res.json({ version: process.env.APP_VERSION || '1.0', build: 'jenkins-ci' }));

if (require.main === module) {
  app.listen(3000, () => console.log('Running on port 3000'));
}

module.exports = app;
