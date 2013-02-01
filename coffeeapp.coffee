express = require("express")

app = express()

app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "ejs"
  app.use express.bodyParser()
  app.use express.methodOverride()

app.use app.router
app.use express.static(__dirname + "/public")
 
app.get "/", (req, res) ->
  res.render "index", title: "Express"
 
app.listen 3000
console.log "Express server listening on port 3000"
