const express = require('express');
const morgan = require('morgan');
const html = require('html-template-tag');
const db = require('./db');

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
  const id = req.params.id;
  let pageContent;
  
  db.getPageContent(id)
    .then(content => {
        pageContent = content;
      })
    .catch(next);

  db.getPage(id)
    .then(page =>
      res.send(html `
        <html>
          <header>
            <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
            />
          </header>
          <body>
            <div class="container">
              <h1 class="my-2">Acme Web</h1>
              <ul class="nav nav-tabs mb-4">
                ${req.pages.map(page => {
                  return html`
                    <li class="nav-item">
                      <a class="nav-link" href="/pages/${page.id}">${page.name}</a>
                    </li>
                  `;
                })}
              </ul>
              ${pageContent.map(contentRow => {
                return `
                <h2>${contentRow.name}</h2>
                <div class="mb-3">${contentRow.body}</div>
                `;
              })}
            </div>
            <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
          </body>
        </html>
      `)
    )
    .catch(next);
});


module.exports = app;

