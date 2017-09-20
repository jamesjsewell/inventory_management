This is a working prototype and is a work in progress, if you would like to work on this project, you must have api keys to the services that
this project makes use of. Read below to see what those services are. If you would like a list of links to each service, please let me know. I will add links to them here when I take the time to do so. 


notes: 
I will sooner than later create some documentation for how to use this project for your own purposes. For now one thing I will add is that if you already know how to use this project for the most part or wish to explore it, I do have a few tips below. 

TO KEEP YOUR API KEYS SAFE:

create a file in the main directory and name it defineEnvironmentVars.js  inside of that file, add this code:

*add any extra environment variables inside of the function*

exports.setEnvironmentVariables = function() {
	process.env["FILESTACK_KEY"] = "yourFilestackKey"
	process.env["NODEMAILER_USERNAME"] = "yourEmailForNodeMailerDelivery"
	process.env["NODEMAILER_PASSWORD"] = "yourPass"
	process.env["AUTH_SECRET"] = "yourSecret"
	process.env["GOOGLE_MAPS_KEY"] = "yourGoogleMapsKey"
}

*add the defineEnvironmentVars.js file to your .gitignore file*
now, when you are ready to build your code, just run "npm run build" this will prepare a javascript file for production, and it will swap out the setEnvironmentVariables.js's function with an empty function, thereby keeping the sensitive info out of your production file.

for development do npm run go, this will set you up for development and also it will replace the empty function inside of setEnvironmentVars.js with the function from the defineEnvironmentVars.js file to ensure that your process.env will have those variables set when the server is started.

to add your changes to git, instead of using "git add ." I created a script to run that will hide sensitive info and then will run the "git add ." command for you. To use this, just run the command "npm run git"
