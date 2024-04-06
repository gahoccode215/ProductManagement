const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const routesClient = require("./routes/client/index.route");
const routesAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const path = require('path');
const moment = require('moment');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

dotenv.config();
database.connect();


const app = express();
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.set("views", "./views");
app.set("view engine", "pug");


app.use(express.static("public"));


/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// flash
app.use(cookieParser('KJJSLKASASASA'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Routes Admin
routesAdmin(app);
// Routes Client
routesClient(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});