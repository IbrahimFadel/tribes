const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
var fs = require('file-system');

app.get('/', (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/css/index.css', (req, res, next) => {
	res.sendFile(__dirname + '/css/index.css');
});

app.get('/scripts/game.js', (req, res, next) => {
	res.sendFile(__dirname + '/scripts/game.js');
});

app.listen(PORT, () => {
	console.log("Server listening on port: " + PORT + "");
});

function Terrain() {
	this.conVeldt = "Veldt"
	this.conMarsh = "Marsh"
	this.conForest = "Forest"
	this.conHills = "Hills"
	this.nGameTrackVeldt = null;
	this.nGameTrackMarsh = null;
	this.nGameTrackForest = null;
	this.nGameTrackHills = null;
}

function Tribe() {
	this.grain = 0;
	this.food = 0;
	this.humans = []; // created an array of variables of type Human
	this.currentTerrain = null;
	this.cCalendar = null;
	this.cTerrain = new Terrain();
	this.cTerrain.nGameTrackVeldt = 1;
	this.cTerrain.nGameTrackMarsh = 1;
	this.cTerrain.nGameTrackForest = 1;
	this.cTerrain.nGameTrackHills = 1;
	this.currentTerrain = this.cTerrain.conVeldt;
	this.cCalendar = new Calendar();  // Needs to be re-thought
	this.cCalendar.IsWarmSeason = true;


	NewTribeButton = document.getElementById("NewTribeButton");
	NewTribeButton.style.display = "none";

	var hiddenOnLaunch = document.getElementsByClassName("hiddenOnLaunch");
	for(let i = 0; i < hiddenOnLaunch.length; i++) {
		hiddenOnLaunch[i].style.display = "inline";
	}

	var cGameSettings = new GameSettings();
	var nHumans = cGameSettings.nHumansStart; 
	for(let i = 0; i < nHumans; i++) {
		this.humans.push(new Human());
	}

	this.SaveHumanData = function() {
		var Name;
		var PrimarySkill; // Need to assing it to the humans!!!!!
		var PlayerSkillTable = document.getElementById("PlayerSkillTable");
		var PrimarySkillOptions;
		var Gender;
		for(i = 0; i < nHumans; i++) {
			PrimarySkillOptions = document.getElementById("Human" + (i+1) + "Options");
			GenderOptions = document.getElementsByName("Gender" + (i+1));
			Name = document.getElementById("Human" + (i+1) + "Name").value;
			PrimarySkill = PrimarySkillOptions.options[PrimarySkillOptions.selectedIndex].value;
			for(let x = 0, length = GenderOptions.length; x < length; x++) {
				if(GenderOptions[x].checked) {
					Gender = GenderOptions[x].value;
					break;
				}
			}
			this.humans[i].Name = Name;
			this.humans[i].PrimarySkill = PrimarySkill;
			this.humans[i].Gender = Gender;
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
	this.HasBasket = false;

	this.Gather = function() {
		//Roll three dice
		// Increase by 1/decrease 1 if strong
		// Non-gatherers always get -3 to roll
		// cold season penalized
		// Gathering always yeilds results
		// Common way to get grain
		// With basket = two rolls, both rolls count
		// Use rolls 1 die, if 1 or 2, basket is lost
		// Only one human can use a basket per season
		var cCalendar = cTribe.cCalendar;
		//console.log(cTribe.currentTerrain);
		var bGatheringSeasonCold = cCalendar.IsColdSeason;

		var nRollOneVal = 0;
		var nRollTwoVal = 0;

		nRollOneVal = rollSixSidedDice() + rollSixSidedDice() + rollSixSidedDice();
		if(this.HasBasket) {
			nRollTwoVal += rollSixSidedDice() + rollSixSidedDice() + rollSixSidedDice();
		}
		if(bGatheringSeasonCold) {
			nRollOneVal -= 3;
		}
		if(this.PrimarySkill != "Gatherer") {
				nRollOneVal -= 3;
		}
		if(this.HasBasket) {
			nRollTwoVal += rollSixSidedDice() + rollSixSidedDice() + rollSixSidedDice();

			if(bGatheringSeasonCold) {
				nRollTwoVal -= 3;
			}

			if(this.PrimarySkill != "Gatherer") {
				nRollTwoVal -= 3;
			}

			let basketRoll = rollSixSidedDice();

			if(basketRoll == 1 || basketRoll == 2) {
				this.HasBasket = false;
			}
		}

		var nGatheringRollValue = 0; 
		if(this.HasBasket) {
			nRollTwoVal += rollSixSidedDice() + rollSixSidedDice() + rollSixSidedDice();
		}

		var nGatheringRollValue = nRollOneVal + nRollTwoVal;

		console.log("Roll One: " + nRollOneVal + ', Roll Two: ' + nRollTwoVal)
		console.log(nGatheringRollValue);

		if(cTribe.currentTerrain == cTribe.cTerrain.conVeldt) {
			console.log("Veldt")
			if(nGatheringRollValue >= 15) {
				cTribe.grain += 6;
			} else if(nGatheringRollValue >= 13 && nGatheringRollValue <= 14) {
				cTribe.food += 6;
			} else if(nGatheringRollValue  >= 11 && nGatheringRollValue <= 12) {
				cTribe.food += 5;
			} else if(nGatheringRollValue == 10) {
				cTribe.food += 4;
			} else if(nGatheringRollValue == 9) {
				cTribe.grain += 3;
			} else if(nGatheringRollValue == 8) {
				cTribe.food += 3;
			} else if(nGatheringRollValue <= 7) {
				cTribe.food += 2;
			}
		} else if(cTribe.currentTerrain == cTribe.currentTerrainconForest) {
			if(nGatheringRollValue >= 15) {
				cTribe.food += 12;
			} else if(nGatheringRollValue >= 13 && nGatheringRollValue <= 14) {
				cTribe.food += 8;
			} else if(nGatheringRollValue  >= 11 && nGatheringRollValue <= 12) {
				cTribe.food += 7;
			} else if(nGatheringRollValue == 10) {
				cTribe.food += 6;
			} else if(nGatheringRollValue == 9) {
				cTribe.food += 5;
			} else if(nGatheringRollValue == 8) {
				cTribe.grain += 3;
			} else if(nGatheringRollValue <= 7) {
				cTribe.food += 3;
			}
		} else if(cTribe.currentTerrain == cTribe.currentTerrainconMarsh) {
			if(nGatheringRollValue >= 17 && nGatheringRollValue <= 18) {
				cTribe.grain += 12;
			} else if(nGatheringRollValue >= 14 && nGatheringRollValue <= 16) {
				cTribe.grain += 6;
			} else if(nGatheringRollValue >= 12 && nGatheringRollValue <= 13) {
				cTribe.food += 8;
			} else if(nGatheringRollValue >= 10 && nGatheringRollValue <= 11) {
				cTribe.food += 7;
			} else if(nGatheringRollValue == 9) {
				cTribe.food += 6;
			} else if(nGatheringRollValue == 8) {
				cTribe.food += 5;
			} else if(nGatheringRollValue <= 7) {
				cTribe.food += 4;
			}
		} else if(cTribe.currentTerrain == cTribe.currentTerrainconHills) {
			if(nGatheringRollValue >= 16) {
				cTribe.food += 12;
			} else if(nGatheringRollValue >= 14 && nGatheringRollValue <= 15) {
				cTribe.grain += 4;
			} else if(nGatheringRollValue >= 12 && nGatheringRollValue <= 13) {
				cTribe.food += 6;
			} else if(nGatheringRollValue >= 10 && nGatheringRollValue <= 11) {
				cTribe.food += 5;
			} else if(nGatheringRollValue == 9) {
				cTribe.food += 4;
			} else if(nGatheringRollValue == 8) {
				cTribe.food += 3;
			} else if(nGatheringRollValue <= 7) {
				cTribe.food += 2;
			}
		}

		console.log(cTribe.food + " " + cTribe.grain);
	}

	this.hunt = function() {
		var cCalendar = cTribe.cCalendar;
		var bGatheringSeasonCold = cCalendar.IsColdSeason;
	}
}

function Calendar() {
	this.nYear = 0;
	this.IsWarmSeason = false;
	this.IsColdSeason = false;
}

function GameSettings() {
	this.nHumansStart = 4;
}

function rollSixSidedDice() {
	return Math.floor(Math.random() * (6 - 1 + 1)) + 1;
}