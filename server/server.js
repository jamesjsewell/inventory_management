const PROJECT_NAME = "site_template"
const bodyParser = require("body-parser")
const express = require("express")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")
const renderFile = require("ejs").renderFile
const morgan = require("morgan")
const fallback = require("express-history-api-fallback")
const appMiddleWare = require("./config/middleware.js")
const connectToDB = require("./config/db-setup.js").connectToDB
const path = require("path")

const setVars = require("../setEnvironmentVars.js")
setVars.setEnvironmentVariables()

// Import Routers
let router = require("./routing/router.js")

// =========
// RUN APP
// =========
const app = express()
const PORT = process.env.PORT || 3000
app.set("port", PORT)

// =========
// VIEW ENGINE
// =========
app.set("views", "./dist/views")
app.engine("html", renderFile)
app.set("view engine", "html")

// =========
// DATABASE
// =========
connectToDB(PROJECT_NAME)

// =========
// APPLICATION MIDDLEWARE
// =========
app.use(express.static(process.env.ROOT_DIR + "/assets"))
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(appMiddleWare.parseQuery)

// =========
// ROUTERS
// =========

app.use("/api", router)

app.use(appMiddleWare.errorHandler)

app.listen(PORT, function() {
	console.log(
		"\n\n===== listening for requests on port " + PORT + " =====\n\n"
	)
})

app.get("*", function(req, res, next) {
	if (!req.url.includes("api")) {
		app.use(fallback(process.env.ROOT_DIR + "/views/index.html"))
	}
	return next()
})

