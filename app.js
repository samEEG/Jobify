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

//NEW
app.get("/jobs/new", function(req,res) {
	res.render("new");
});


//Create Route 
app.post("/jobs", function(req,res){
	//create blog
	req.body.job.body = req.sanitize(req.body.job.body); 
	Job.create(req.body.job, function(err, newJob){
		if(err){
			//console.log(err);
			res.render("new");
		}
		else {
			res.redirect("/jobs")
		}
	});
	//then, redirect to the index
});

//Show route 
app.get("/jobs/:id", function(req, res){
	Job.findById(req.params.id, function(err, foundJob){
		if(err){
			res.redirect("/jobs");
		}
		else {
			res.render("show", {job:foundJob});
		}
	});
});


app.listen(3000, function() {
	console.log("Sever has started");
})