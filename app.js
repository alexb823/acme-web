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
  db.getPage(req.params.id)
    .then(page =>
      res.send(html`
        <html>
          <header>
            <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
              integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
              crossorigin="anonymous"
            />
          </header>
          <body>
            <div class="container">
              <h1>Acme Web</h1>
              <ul class="nav nav">
                ${req.pages.map(page => {
                  return html`
                    <li class="nav-item">
                      <a class="nav-link" href="/pages/${page.id}"
                        >${page.name}</a
                      >
                    </li>
                  `;
                })}
              </ul>
            </div>
          </body>
        </html>
      `)
    )
    .catch(next);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));

db.sync();
