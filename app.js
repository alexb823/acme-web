const express = require('express');
const morgan = require('morgan');
const db = require('./db');
const loadAcmePage = require('./views/acmePage')

const app = express();

app.use(morgan('dev'));

app.use((req, res, next) => {
  db.getPages()
    .then(pages => {
      req.pages = pages;
      next();
    })
    .catch(next);
});

app.get('/', (req, res, next) => {
  const page = req.pages[0];
  res.redirect(`/pages/${page.id}`);
});

app.get('/pages/:id', (req, res, next) => {
  db.getPageContent(req.params.id)
    .then(pageContent => res.send(loadAcmePage(req.pages, pageContent)))
    .catch(next);
});

module.exports = app;
