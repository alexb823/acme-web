const sql = require('sql-template-strings');
const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme-web');

