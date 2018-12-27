const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
//const fs = require(['file-system']);

app.get('/', (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
	console.log("Server listening on port: " + PORT + "");
});

/* Purpose of code above is to serve files when requests are made. */

function Tribe() {
	NewTribeButton = document.getElementById("NewTribeButton");
	NewTribeButton.style.display = "none";
	this.humans = []; // created an array of variables of type Human
	//Ayman suggests changing variable name from "humans" to "arrHumans"

	var hiddenOnLaunch = document.getElementsByClassName("hiddenOnLaunch");
	for(let i = 0; i < hiddenOnLaunch.length; i++) {
		hiddenOnLaunch[i].style.display = "inline";
	}
	/* When NewTribeButton is pressed, user interface displays form to enter data on adult humans of the tribe at year 0. */

	var cGameSettings = new GameSettings();
	var nHumans = cGameSettings.nHumansStart; 
	//nHumansStart is the number of human adults in tribe at year 0.
	for(let i = 0; i < nHumans; i++) {
		this.humans.push(new Human());
	}
	//Add nHumansStart number of humans to array "humans"
	
	this.SaveHumanData = function() {
		var Name;
		var PrimarySkill;
		var PlayerSkillTable = document.getElementById("PlayerSkillTable");
		var PrimarySkillOptions;
		var Gender;
		// The index.html currently does not allow for a variable number of initial human adults in tribe
		for(i = 0; i < nHumans; i++) {
			PrimarySkillOptions = document.getElementById("Human" + (i+1) + "Options");
			GenderOptions = document.getElementsByName("Gender" + (i+1));
			Name = document.getElementById("Human" + (i+1) + "Name").value;
			PrimarySkill = PrimarySkillOptions.options[PrimarySkillOptions.selectedIndex].value;
			for(let i = 0, length = GenderOptions.length; i < length; i++) {
				if(GenderOptions[i].checked) {
					Gender = GenderOptions[i].value;
					break;
				}
			}
			this.humans[i].Name = Name;
			let row = PlayerSkillTable.insertRow(0);
			var rowHuman = row.insertCell(0);
			rowHuman.innerHTML = "Player " + (i+1);
			var rowName = row.insertCell(1);
			rowName.innerHTML = Name;
			var rowPrimarySkill = row.insertCell(2);
			rowPrimarySkill.innerHTML = PrimarySkill;
			var rowGender = row.insertCell(3);
			rowGender.innerHTML = Gender;
			document.getElementById("Human" + (i+1) + "Name").value = "";

			document.getElementById("HumanDataForm").style.display = 'none';
			
		}
	}

	this.relocateSave = function() {

		var TribeData = JSON.stringify(cTribe);
		fs.writeFileSync('data.jsons', TribeData);

		window.location.assign("/save.html");
		//console.log("Alert: Tribe Saved")

		//var retrievedHumans = localStorage.getItem('humans');
		//console.log(retrievedHumans);
	}

	this.saveTribe = function() {
		//var humans = this.humans;
		//localStorage.setItem('humans', JSON.stringify(humans));
		//document.getElementById("saveName1").value = "";
		console.log("ih")
	}
}

function Human() {
	this.PrimarySkill = null;
	this.SecondarySkill = null;
	this.Gender = null;
	this.Mother = null;
	this.Father = null;
	this.IsAdult = false;
	this.IsAlive = true;
	this.Birthdate = null;
	this.Name = null;
}
function GameSettings() {
	this.nHumansStart = 4;
}
