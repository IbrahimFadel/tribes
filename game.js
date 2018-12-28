const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
//var fs = require('file-system');

app.get('/', (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/css/index.css', (req, res, next) => {
	res.sendFile(__dirname + '/css/index.css');
});

app.get('/game.js', (req, res, next) => {
	res.sendFile(__dirname + '/game.js');
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

/* Purpose of code above is to serve files when requests are made. */


function Tribe() {
	this.nGrain = 0;
	this.nFood = 0;
	this.arrHumans = []; // created an array of variables of type Human
	this.cCurrentTerrain = null;
	this.objTribeCalendar = null;
	this.objTerrain = new Terrain();
	//GameTrack ranges from 1 to 20. The lower the value, the more plentiful game (i.e. hunting) is in the terrain.
	this.objTerrain.nGameTrackVeldt = 1; 
	this.objTerrain.nGameTrackMarsh = 1;
	this.objTerrain.nGameTrackForest = 1;
	this.objTerrain.nGameTrackHills = 1;
	this.cCurrentTerrain = this.objTerrain.conVeldt;
	this.objTribeCalendar = new Calendar();  // Needs to be re-thought
	this.objTribeCalendar.IsWarmSeason = true;


	NewTribeButton = document.getElementById("NewTribeButton");
	NewTribeButton.style.display = "none";

	// Ayman thought the above line unnecessary.
	// this.arrhumans = []; // created an array of variables of type Human
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
		this.arrHumans.push(new Human());
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
			for(let x = 0, length = GenderOptions.length; x < length; x++) {
				if(GenderOptions[x].checked) {
					Gender = GenderOptions[x].value;
					break;
				}
			}
			this.arrHumans[i].Name = Name;
			this.arrHumans[i].PrimarySkill = PrimarySkill;
			this.arrHumans[i].Gender = Gender;
			this.arrHumans[i].nBaskets = 0; //New human starts with zero baskets
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
//Passing the data of the instance of the tribe and moving the user to save.html
		var TribeData = JSON.stringify(objTribe);
		fs.writeFileSync('data.jsons', TribeData);

		window.location.assign("/save.html");
		//console.log("Alert: Tribe Saved")

		//var retrievedHumans = localStorage.getItem('humans');
		//console.log(retrievedHumans);
	}

	this.saveTribe = function() {
		// Save tribe data to local storage
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
	this.nBaskets = null; //number of baskets the human has
	this.nSpearheads = null; // number of spearheads the human has
	// this.Strength = 1;  // 0 = weak, 1 = normal, 2 = strong - Ayman & Ibrahim agreed not to use this variable
	this.IsInjured = false; //Can occur during hunting or after a chance roll
	this.IsPregnant = false;
	this.IsNursing = false;
	this.IsFetus = false; //unborn, conceived
	this.nAge = null; //Age in years

	this.Gather = function() {
		//Ayman: this function assumes that a human who hunts is not injured. Ayman prefers that we build a check into this function for that, but he's not going to code that.

		//Roll three dice
		// Increase by 1/decrease 1 if strong
		// Non-gatherers always get -3 to roll
		// cold season penalized
		// Gathering always yeilds results
		// Common way to get grain
		// With basket = two rolls, both rolls count
		// Use rolls 1 die, if 1 or 2, basket is lost
		// Only one human can use a basket per season
		var objGatherCalendar = objTribe.objTribeCalendar;
		//console.log(objTribe.cCurrentTerrain);
		var bGatheringSeasonCold = objGatherCalendar.IsColdSeason;

		var nRollOneVal = 0;
		var nRollTwoVal = 0;
		var nGatheringPenalty = 0

		nRollOneVal = rollSixSidedDice() + rollSixSidedDice() + rollSixSidedDice();
		// If the gatherer has more than one basket, the game assumes the person is using the basket to gather. A second roll of 3 six-sided die is made.
		if(this.nBaskets > 0) {
			nRollTwoVal += rollSixSidedDice() + rollSixSidedDice() + rollSixSidedDice();
		}
		// If it is cold season, the gathering roll is deducted by three ("3")
		if(bGatheringSeasonCold) {
			nGatheringPenalty -= 3;
			//If a basket is used, the cold penalty is applied again for the 2nd die roll.
			if(this.nBaskets > 0) {
				nGatheringPenalty -= 3;
			}
		}
		// If gathering is not the human's primary skill, the gathering roll is deducted by three ("3").
		if(this.PrimarySkill != "Gatherer") {
			nGatheringPenalty -= 3;
			//If a basket is used, the penalty for not being a gatherer is applied again for the 2nd die roll.
			if(this.HasBasket) {
				nGatheringPenalty -= 3;
			}
		}
		// The value used to check against each terrain's table is Roll 1 + Roll 2 + gathering penalties.
		var nGatheringRollValue = nRollOneVal + nRollTwoVal + nGatheringPenalty; 

		console.log("Roll One: " + nRollOneVal + ', Roll Two: ' + nRollTwoVal + ", Gathering Penalty: " + nGatheringPenalty + ", Num Baskets:" + this.nBaskets)
		console.log(nGatheringRollValue);
				
		//After gathering, a basket is lost on a roll of 1 or 2 on a six-sided dice.
		let nBasketRoll = rollSixSidedDice(); //what is difference between "let" and "var"
		if this.nBaskets > 0 {
			if(nBasketRoll == 1 || basketRoll == 2) {
				this.nBaskets -= 1;
			}
		}
		
		console.log("Basket Roll: " + nBasketRoll, ", Num Baskets after roll: ", this.nBaskets)

// how does this function know "objTribe"? Isn't it out of scope? Ayman

		console.log("Before gathering - Food: " + objTribe.nFood + " Grain: " + objTribe.nGrain);

		if(objTribe.cCurrentTerrain == objTribe.objTerrain.conVeldt) {
			console.log("Veldt")
			if(nGatheringRollValue >= 15) {
				objTribe.nGrain += 6;
			} else if(nGatheringRollValue >= 13 && nGatheringRollValue <= 14) {
				objTribe.nFood += 6;
			} else if(nGatheringRollValue  >= 11 && nGatheringRollValue <= 12) {
				objTribe.nFood += 5;
			} else if(nGatheringRollValue == 10) {
				objTribe.nFood += 4;
			} else if(nGatheringRollValue == 9) {
				objTribe.nGrain += 3;
			} else if(nGatheringRollValue == 8) {
				objTribe.nFood += 3;
			} else if(nGatheringRollValue <= 7) {
				objTribe.nFood += 2;
			}
		} else if(objTribe.cCurrentTerrain == objTribe.cCurrentTerrain.conForest) {
			if(nGatheringRollValue >= 15) {
				objTribe.nFood += 12;
			} else if(nGatheringRollValue >= 13 && nGatheringRollValue <= 14) {
				objTribe.nFood += 8;
			} else if(nGatheringRollValue  >= 11 && nGatheringRollValue <= 12) {
				objTribe.nFood += 7;
			} else if(nGatheringRollValue == 10) {
				objTribe.nFood += 6;
			} else if(nGatheringRollValue == 9) {
				objTribe.nFood += 5;
			} else if(nGatheringRollValue == 8) {
				objTribe.nGrain += 3;
			} else if(nGatheringRollValue <= 7) {
				objTribe.nFood += 3;
			}
		} else if(objTribe.cCurrentTerrain == objTribe.cCurrentTerrain.conMarsh) {
			if(nGatheringRollValue >= 17 && nGatheringRollValue <= 18) {
				objTribe.nGrain += 12;
			} else if(nGatheringRollValue >= 14 && nGatheringRollValue <= 16) {
				objTribe.nGrain += 6;
			} else if(nGatheringRollValue >= 12 && nGatheringRollValue <= 13) {
				objTribe.nFood += 8;
			} else if(nGatheringRollValue >= 10 && nGatheringRollValue <= 11) {
				objTribe.nFood += 7;
			} else if(nGatheringRollValue == 9) {
				objTribe.nFood += 6;
			} else if(nGatheringRollValue == 8) {
				objTribe.nFood += 5;
			} else if(nGatheringRollValue <= 7) {
				objTribe.nFood += 4;
			}
		} else if(objTribe.cCurrentTerrain == objTribe.cCurrentTerrain.conHills) {
			if(nGatheringRollValue >= 16) {
				objTribe.nFood += 12;
			} else if(nGatheringRollValue >= 14 && nGatheringRollValue <= 15) {
				objTribe.nGrain += 4;
			} else if(nGatheringRollValue >= 12 && nGatheringRollValue <= 13) {
				objTribe.nFood += 6;
			} else if(nGatheringRollValue >= 10 && nGatheringRollValue <= 11) {
				objTribe.nFood += 5;
			} else if(nGatheringRollValue == 9) {
				objTribe.nFood += 4;
			} else if(nGatheringRollValue == 8) {
				objTribe.nFood += 3;
			} else if(nGatheringRollValue <= 7) {
				objTribe.nFood += 2;
			}
		}

		console.log("After gathering - Food: " + objTribe.nFood + " Grain: " + objTribe.nGrain);
	}


	this.hunt = function() {
		//Ayman: this function assumes that a human who hunts is not injured. Ayman prefers that we build a check into this function for that, but he's not going to code that.

		var objHuntCalendar = objTribe.objCalendar;
		var bHuntingSeasonCold = objHuntCalendar.IsColdSeason;
		var bUsesSpearHead = false;
		
		// var nHuntingRollValue = 0; Ayman - This variable isn't used in the code. It should be deleted.

		var nHuntingRoll = 0;
		// var nHuntingRollTwoVal = 0; this variable isn't used. Ayman thinks it should be deleted.

		nHuntingRoll = rollSixSidedDice() + rollSixSidedDice() + rollSixSidedDice();
		if this.nSpearheads > 0 {
			bUsesSpearHead = true ;
		}
		if(nHuntingRoll == 6) {
					if(this.PrimarySkill != "Hunter") {
						this.IsInjured = true;
						// Miss next turn
					}
				} else if(nHuntingRoll >= 4 && nHuntingRoll <= 5) {
					this.IsInjured = true;
					// Miss next turn
				} 
		var nHuntingValAfterGameTrack = nHuntingRoll;
		var cHuntTerrain = objTribe.cCurrentTerrain
		var nHuntGameTrack = 0;
		/*Since the game track dice roll modifiying table is the same for all terrains, it is not important to determine the terrain type. But it is important to know the terrain
		to determine which terrain's Game Track to use. Its value is stored in nHuntGameTrack. We also use this opportunity to increment the Game Track for the terrain in which the
		hunt occurs by 1 to reflect "hunting out" the area. */
		if cHuntTerrain = objTribe.objTerrain.conVeldt {
			nHuntGameTrack = objTribe.objTerrain.nGameTrackVeldt; 
			objTribe.objTerrain.nGameTrackVeldt += 1;
		}	else if cHuntTerrain = objTribe.objTerrain.conMarsh {
				nHuntGameTrack = objTribe.objTerrain.nGameTrackMarsh;
				objTribe.objTerrain.nGameTrackMarsh += 1;
			} else if cHuntTerrain = objTribe.objTerrain.conForest {
				nHuntGameTrack = objTribe.objTerrain.nGameTrackForest;
				objTribe.objTerrain.nGameTrackForest += 1;
			} else if cHuntTerrain = objTribe.objTerrain.conHills {
				nHuntGameTrack = objTribe.objTerrain.nGameTrackHills ;
				objTribe.objTerrain.nGameTrackHills += 1 ;
			}
		if nHuntGameTrack <= 3 {
			nHuntingValAfterGameTrack = nHuntingRollaOneVal
		} else if(nHuntGameTrack >= 4 && nHuntGameTrack <= 5) {
			nHuntingValAfterGameTrack = math.min(nHuntingRoll, 17);
		} else if(nHuntGameTrack >= 6 && nHuntGameTrack <= 7) {
			nHuntingValAfterGameTrack = math.min(nHuntingRoll, 15);
		} else if(nHuntGameTrack >= 8 && nHuntGameTrack <= 9) {
			nHuntingValAfterGameTrack = math.min(nHuntingRoll, 14);
		} else if(nHuntGameTrack >= 10 && nHuntGameTrack <= 11) {
			nHuntingValAfterGameTrack = math.min(nHuntingRoll, 13);
		} else if(nHuntGameTrack >= 12 && nHuntGameTrack <= 13) {
			nHuntingValAfterGameTrack = math.min(nHuntingRoll, 12);
		} else if(nHuntGameTrack >= 14 && nHuntGameTrack <= 15) {
			nHuntingValAfterGameTrack = math.min(nHuntingRoll, 11);
		} else if(nHuntGameTrack >= 16 && nHuntGameTrack <= 17) {
			nHuntingValAfterGameTrack = math.min(nHuntingRoll, 10);
		} else if(nHuntGameTrack >= 18 && nHuntGameTrack <= 19) {
			nHuntingValAfterGameTrack = math.min(nHuntingRoll, 9);
		} else if nHuntGameTrack >= 20 {
			nHuntingValAfterGameTrack = math.min(nHuntingRoll, 8);
		}

		/*Ayman is seeking the answer to this in the SJ Games forum. At what point are the skill & cold penalties applied? After the Game Track modification or before? For now, I'm doing it after
		for purposes of finding out how much food is found, but I'm not using it to determine injury. 


		/* In this implementation, Ayman and Ibrahim agreed that strength will not be used.
		if(this.strength == 2) {
			nHuntingRollOneVal += 1;
		} else if(this.strength == 1) {
			nHuntingRollOneVal -= 1;
		}

		if(this.PrimarySkill != 'Hunter') {
			nHuntingRollOneVal -= 3;
		}
		*/

		if(this.bHuntingSeasonCold) {
			this.nHuntingRollOneVal -= 1;
		}

		if(nHuntingRollOneVal < 9) {
			console.log("Hunt Failed");
		} else {
			if(objTribe.cCurrentTerrain == objTribe.cCurrentTerrain.conVeldt) {
				objTribe.cCurrentTerrain.nGameTrackVeldt += 1 
				if(nHuntingRollOneVal >= 18) {
					objTribe.nFood += 80;
				} else if(nHuntingRollOneVal == 17) {
					objTribe.nFood += 50;
				} else if(nHuntingRollOneVal == 16) {
					objTribe.nFood += 40;
				} else if(nHuntingRollOneVal == 15) {
					objTribe.nFood += 30;
				} else if(nHuntingRollOneVal == 14) {
					objTribe.nFood += 25;
				} else if(nHuntingRollOneVal == 13) {
					objTribe.nFood += 20;
				} else if(nHuntingRollOneVal == 12) {
					objTribe.nFood += 15;
				} else if(nHuntingRollOneVal == 11) {
					objTribe.nFood += 8;
				} else if(nHuntingRollOneVal == 10) {
					objTribe.nFood += 2;
				} else if(nHuntingRollOneVal == 9) {
					objTribe.nFood += 2;
				} else if(nHuntingRollOneVal >= 7 && nHuntingRollOneVal <= 8) {
					objTribe.nFood += 0;
				} 

				/* else if(nHuntingRollOneVal == 3) {
					if(this.strength == 2) {
						this.strength = 1
					} else if(this.strength == 1) {
						this.strength = 0;
					}
					Ayman and Ibrahim agreed that we are not using strength in this implementation.
				*/

					// Become severely injured, miss next turn
				}
			} else if(objTribe.cCurrentTerrain == objTribe.cCurrentTerrain.conForest) {
				if(nHuntingRollOneVal >= 18) {
					objTribe.nFood += 60;
				} else if(nHuntingRollOneVal == 17) {
					objTribe.nFood += 50;
				} else if(nHuntingRollOneVal == 16) {
					objTribe.nFood += 40;
				} else if(nHuntingRollOneVal == 15) {
					objTribe.nFood += 30;
				} else if(nHuntingRollOneVal == 14) {
					objTribe.nFood += 25;
				} else if(nHuntingRollOneVal == 13) {
					objTribe.nFood += 25;
				} else if(nHuntingRollOneVal == 12) {
					objTribe.nFood += 15;
				} else if(nHuntingRollOneVal == 11) {
					objTribe.nFood += 8;
				} else if(nHuntingRollOneVal == 10) {
					objTribe.nFood += 4;
				} else if(nHuntingRollOneVal == 9) {
					objTribe.nFood += 2;
				} else if(nHuntingRollOneVal >= 7 && nHuntingRollOneVal <= 8) {
					objTribe.nFood += 0;
				} else if(nHuntingRollOneVal == 6) {
					if(this.PrimarySkill != "Hunter") {
						this.IsInjured = true;
						// Miss next turn
					}
				} else if(nHuntingRollOneVal >= 4 && nHuntingRollOneVal <= 5) {
					this.IsInjured = true;
					// Miss next turn
				} 
				/*
				else if(nHuntingRollOneVal == 3) {
					if(this.strength == 2) {
						this.strength = 1
					} else if(this.strength == 1) {
						this.strength = 0;
					}
				Ayman and Ibrahim have agreed not to implement the strength optional rule
				*/
					// Become severely injured, miss next turn
			} else if(objTribe.cCurrentTerrain == objTribe.cCurrentTerrain.conMarsh) {
				if(nHuntingRollOneVal >= 18) {
					objTribe.nFood += 80;
				} else if(nHuntingRollOneVal == 17) {
					objTribe.nFood += 40;
				} else if(nHuntingRollOneVal == 16) {
					objTribe.nFood += 35;
				} else if(nHuntingRollOneVal == 15) {
					objTribe.nFood += 30;
				} else if(nHuntingRollOneVal == 14) {
					objTribe.nFood += 25;
				} else if(nHuntingRollOneVal == 13) {
					objTribe.nFood += 15;
				} else if(nHuntingRollOneVal == 12) {
					objTribe.nFood += 12;
				} else if(nHuntingRollOneVal == 11) {
					objTribe.nFood += 8;
				} else if(nHuntingRollOneVal == 10) {
					objTribe.nFood += 4;
				} else if(nHuntingRollOneVal == 9) {
					objTribe.nFood += 2;
				} else if(nHuntingRollOneVal >= 7 && nHuntingRollOneVal <= 8) {
					objTribe.nFood += 0;
				} else if(nHuntingRollOneVal == 6) {
					if(this.PrimarySkill != "Hunter") {
						this.IsInjured = true;
						// Miss next turn
					}
				} else if(nHuntingRollOneVal >= 4 && nHuntingRollOneVal <= 5) {
					this.IsInjured = true;
					// Miss next turn
				}
				/*
				 else if(nHuntingRollOneVal == 3) {
					if(this.strength == 2) {
						this.strength = 1
					} else if(this.strength == 1) {
						this.strength = 0;
					}
				Ayman & Ibrahim agreed not to implement optional strength rule
				*/
					// Become severely injured, miss next turn
			} else if(objTribe.cCurrentTerrain == objTribe.cCurrentTerrain.conHills) {
				if(nHuntingRollOneVal >= 18) {
					objTribe.nFood += 50;
				} else if(nHuntingRollOneVal == 17) {
					objTribe.nFood += 45;
				} else if(nHuntingRollOneVal == 16) {
					objTribe.nFood += 35;
				} else if(nHuntingRollOneVal == 15) {
					objTribe.nFood += 30;
				} else if(nHuntingRollOneVal == 14) {
					objTribe.nFood += 25;
				} else if(nHuntingRollOneVal == 13) {
					objTribe.nFood += 15;
				} else if(nHuntingRollOneVal == 12) {
					objTribe.nFood += 12;
				} else if(nHuntingRollOneVal == 11) {
					objTribe.nFood += 8;
				} else if(nHuntingRollOneVal == 10) {
					objTribe.nFood += 4;
				} else if(nHuntingRollOneVal == 9) {
					objTribe.nFood += 2;
				} else if(nHuntingRollOneVal >= 7 && nHuntingRollOneVal <= 8) {
					objTribe.nFood += 0;
				} else if(nHuntingRollOneVal == 6) {
					if(this.PrimarySkill != "Hunter") {
						this.IsInjured = true;
						// Miss next turn
					}
				} else if(nHuntingRollOneVal >= 4 && nHuntingRollOneVal <= 5) {
					this.IsInjured = true;
					// Miss next turn
				} 
				/*
				 else if(nHuntingRollOneVal == 3) {
					if(this.strength == 2) {
						this.strength = 1
					} else if(this.strength == 1) {
						this.strength = 0;
					}
				Ayman & Ibrahim agreed not to implement optional strength rule
				*/

					// Become severely injured, miss next turn
				}
			
		


	
	//In this implementation, we are ignoring "strength" and "illness"
	

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
