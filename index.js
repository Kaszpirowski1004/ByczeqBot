const Discord = require("discord.js");
var fs = require("fs");

const config = require("./config.json");
const client = new Discord.Client();

const PREFIX = "/";

var interval;
var AktualnyCzas = new Date(Date.now());
var KoncowyCzas = new Date(Date.now());

var HourSet = false;
var MinutesSet = false;

var isStart = false;


client.on("ready",() => {
	console.log("Wbi³em na Serwer. Zaczynamy! Nie wiesz jak rozpocz¹æ? Wpisz !komendy");
})


client.on('message', function (message) {
	if (message.content == "!clear") {

		message.channel.bulkDelete(100);
	}
});

client.on('message', function (message) {
	if (message.content === "!komendy") {
		message.channel.send("Przykladowe komendy:");
		message.channel.send("* !start - rozpoczecie liczenia,");
		message.channel.send("* !stop - zakonczenie liczenia,");
		message.channel.send("* !seth 16 - ustawienie godziny zakonczenia pracy na 16:??,");
		message.channel.send("* !setm 25 - ustawienie minuty zakonczenia pracy na ??:25,");
		message.channel.send("* !show - wyswietla godzine zakonczenia pracy.");
		message.channel.send("* !clear - wyczysc kanal ze starych wiadomosci.");
	}
});

client.on('message', function (message) {
	if (message.content === "!show") {
		message.channel.send("Zakonczenie pracy zostalo ustalone na godzine : " + KoncowyCzas.getHours() + ":" + KoncowyCzas.getMinutes());
	}
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


client.on('message', function (message) {
	if (message.content === "!rzuc") {
		
		
		var number = getRandomIntInclusive(0, 1);
		if(number === 0)
		{
			message.channel.send("Reszka byczqu!");
		}
		else
		{
			message.channel.send("Orzelek byczqu!");
		}
		
		
	}
});



client.on('message', function (message) {

	if (message.content === "!start" && HourSet === true && MinutesSet === true && isStart === false) {
		message.channel.bulkDelete(100);
		message.channel.send("Zaczynamy byczqu!");
		interval = setInterval(function () {
			AktualnyCzas = new Date(Date.now());
			var Minutes = (KoncowyCzas - AktualnyCzas) / (1000 * 60);

			if (Math.floor(Minutes / 60) <= 0 && Math.floor(Minutes % 60) <= 0) {
				message.channel.send("Skonczyles juz robote byczqu! Czmychaj do domu!");
				clearInterval(interval);
				isStart = false;
			}
			else {
				message.channel.bulkDelete(1);
				message.channel.send("Koniec pracy za: " + Math.floor(Minutes / 60) + " godzin  oraz " + Math.floor(Minutes % 60) + " minut!")
			}
		}, 1 * 60000);
		isStart = true;
	}
	else if (message.content === "!start" && ( HourSet === false || MinutesSet === false)) {
		message.channel.send("Niepoprawnie dodana godzina lub minuta zakonczenia pracy! Uzyj komendy !seth i !setm by poprawnie ustawic czas!");
	}
	else if (message.content === "!start" && (isStart===true)) {
		message.channel.send("Odmierzam juz czas byczqu. Wyluzuj!");
	}
	else if (message.content === "!stop" && isStart === true) {
		clearInterval(interval);
		isStart = false;
		message.channel.send("Uff. To juz koniec byczqu!");
	}
	else if (message.content === "!stop" && isStart === false) {
		message.channel.send("Przeciez nie pracuje byczqu!");
	}
	

});

client.on('message', async message => {

		let arg = message.content.substring(PREFIX.length).split(" ");


		switch (arg[0])
		{
		
			case 'seth':
				if(!arg[1]) 
				{
					message.channel.send("Podaj godzine zakoñczenia pracy np. !seth 16")
				}
				else if(Number.parseInt(arg[1])<24 && Number.parseInt(arg[1])>=0)
				{ 
					KoncowyCzas = new Date(Date.now());
					KoncowyCzas.setHours(Number.parseInt(arg[1]));
					AktualnyCzas = new Date(Date.now());
				
					HourSet = true;
					
				}
				else
				{
					message.channel.send("Niepoprawnie dodana GODZINA!");
				}				 		 
				break;
			case 'setm':
				if (!arg[1]) {
					message.channel.send("Podaj minute zakoñczenia pracy np. !setm 30")
				}
				else if (Number.parseInt(arg[1]) < 60 && Number.parseInt(arg[1]) >= 0) {
					//KoncowyCzas = new Date(Date.now());
					KoncowyCzas.setMinutes(Number.parseInt(arg[1]));
					AktualnyCzas = new Date(Date.now());

					MinutesSet = true;
				}
				else {
					message.channel.send("Niepoprawnie dodane MINUTY!");
				}
				break;
		}
	
});



client.login(process.env.token);
