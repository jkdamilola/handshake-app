const express = require('express');
const path = require('path');
const compression = require('compression');
const fallback = require('express-history-api-fallback');

const app = express();

const root = `${__dirname}/dist`;

app.use(express.static(root));
app.use(fallback('index.html', { root }));
app.use(compression());
app.get('*',(req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server is listening on port ${port}`));
