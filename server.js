const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.COOKIE_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// The express.static() method is a built-in Express.js 
// middleware function that can take all of the contents of a folder 
// and serve them as static assets. This is useful for front-end specific
// files like images, style sheets, and JavaScript files.
app.use(express.static(path.join(__dirname, 'public')));

// use session
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
// If we change the value of the ({ force: }) property to true, 
// then the database connection must sync with the model definitions and associations. 
// By forcing the sync method to true, we will make the tables re-create if there are any association changes
// (performs similarly to DROP TABLE IF EXISTS);
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});