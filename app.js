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

app.use((req, res, next) => {
  db.getHomePage()
    .then(page => {
      req.homePage = page;
      next();
    })
    .catch(next);
});

app.get('/', (req, res, next) => {
  res.redirect(`/pages/${req.homePage.id}`);
});

app.get('/pages/:id', (req, res, next) => {
  const currentPgId = req.params.id*1;
  db.getPageContent(currentPgId)
    .then(pageContent => res.send(loadAcmePage(req.pages, pageContent, currentPgId)))
    .catch(next);
});

module.exports = app;
