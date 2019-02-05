const html = require('html-template-tag');

function loadAcmePage(pages, pageContent) {
  return html`
    <!DOCTYPE html>
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
            ${pages.map(page => {
              return html`
                <li class="nav-item">
                  <a class="nav-link" href="/pages/${page.id}">${page.name}</a>
                </li>
              `;
            })}
          </ul>
          ${pageContent.map(content => {
            return html`
              <h2>${content.name}</h2>
              <div class="mb-3">${content.body}</div>
            `;
          })}
        </div>
      </body>
    </html>
  `;
}

module.exports = loadAcmePage;
