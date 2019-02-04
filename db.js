const sql = require('sql-template-strings');
const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_web');

const SEED = sql`
  DROP TABLE IF EXISTS content;
  DROP TABLE IF EXISTS pages;
  CREATE TABLE pages(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) unique,
    is_home_page BOOLEAN
  );
  CREATE TABLE content(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    body VARCHAR(255),
    page_id integer references pages(id)
  );
  INSERT INTO pages(name, is_home_page) VALUES('Home', 'true');
  INSERT INTO pages(name, is_home_page) VALUES('Employees', 'false');
  INSERT INTO pages(name, is_home_page) VALUES('Contact', 'false');

  INSERT INTO content(name, body, page_id) VALUES('Welcome to the Home Page', 'So looking forward to having you browser our site', (SELECT id FROM pages WHERE name='Home'));
  INSERT INTO content(name, body, page_id) VALUES('Moe', 'Moe is our CEO!!!', (SELECT id FROM pages WHERE name='Employees'));
  INSERT INTO content(name, body, page_id) VALUES('Larry', 'Larry is our CTO!!!', (SELECT id FROM pages WHERE name='Employees'));
  INSERT INTO content(name, body, page_id) VALUES('Curly', 'Curly is the COO!!!', (SELECT id FROM pages WHERE name='Employees'));
  INSERT INTO content(name, body, page_id) VALUES('Phone', 'call us 212-555-1212', (SELECT id FROM pages WHERE name='Contact'));
  INSERT INTO content(name, body, page_id) VALUES('Fax', 'fax us 212-555-1212', (SELECT id FROM pages WHERE name='Contact'));
`;

client.connect();

const sync =() => {
  return client.query(SEED);
}

const getPages = () => {
  return client.query(sql`SELECT * FROM pages`)
  .then(data => data.rows);
};

const getPage = (id) => {
  return client.query(sql`SELECT * FROM pages WHERE id = $1`, [id])
  .then(data => data.rows[0])
}

const getPageContent = (id) => {
  return client.query(sql`SELECT * content WHERE page_id =$1`, [id])
  .then(data => data.rows)
}

// client
//   .connect()
//   .then(() => client.query(SEED))
//   .then(() => getPages())
//   .then(pages => pages.reduce((acc, page) => {
//     acc[page.name] = page;
//     return acc;
//   }, {} ))
//   .then(pagesObj => {
//     const pageId = pagesObj.Home.id;
//     return getPage(pageId);
//   })
//   .then(page => console.log(page))
//   .catch(ex => console.log(ex));

module.exports = {
  sync,
  getPages,
  getPage,
  getPageContent
}
