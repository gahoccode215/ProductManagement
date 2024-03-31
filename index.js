const express = require("express");
const dotenv = require("dotenv");
const routesClient = require("./routes/client/index.route");
const routesAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");

dotenv.config();
database.connect();


const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");


app.use(express.static("public"));

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes Admin
routesAdmin(app);
// Routes Client
routesClient(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});