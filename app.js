var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose");
methodOverride = require("method-override");
expressSanitizer = require("express-sanitizer");

//APP CONFIG							//name of app
mongoose.connect("mongodb://localhost/job_search_app");
app.set("view engine", "ejs"); //Copy this line 
app.use(express.static("public")); //Copy this line 
app.use(bodyParser.urlencoded({extended:true})); //Copy this line 
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE/MODEL CONFIG
var jobSchema = new mongoose.Schema({
	job: String,
	company: String, 
	description: String,  
	dateApplied: {type: Date, default: Date.now} //default value 
});

//Create the Schema model
var Job = mongoose.model("Job", jobSchema);

// Job.create({
// 	job: "Software Developer",
// 	company: "Google",
// 	description: "Hello This is a job post"
// });


//RESTFUL ROUTES 
app.get("/", function(req, res) {
	res.redirect("/jobs")
})

//Index route 
app.get("/jobs", function(req, res){
	Job.find({}, function(err, jobs) {
		if(err) {
			console.log(err);
		}
		else {
			res.render("index", {jobs:jobs});
		}
	});
});

app.listen(3000, function() {
	console.log("Sever has started");
})