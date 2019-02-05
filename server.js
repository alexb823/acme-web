const app = require("./app");
const db = require('./db');

//For local matchine server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

//For when using cloud 9 server
// app.listen(process.env.PORT, process.env.IP, () => {
//   console.log('Server has started');
// });


db.sync();
