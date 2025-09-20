const os = require('os');
const fs = require('fs');
const path = require('path');

// TODOS: COLORS

const {
				getCityData ,
				getWeatherData 
} = require('./getData.js');

const {
				asciiWeather,
				weatherCodes,
} = require('./display.js');

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname,'package.json'),'utf-8')
);

const settings = JSON.parse(
				fs.readFileSync(path.join(__dirname,'config.json'),'utf-8')
);


const commands = [
				{
								name: "version",
								value: pkg.version,
								desc: "show the current version",
								usage: "Try --help for more information"
				},
				{
								name: "city",
								desc: "specify a city",
								usage: "Try --help for more information"
				},
				{
								name: "help",
								desc: "Print command-specific usage",
								usage: "Try --help for more information"
				}
];


function main(){
				if (process.argv.length > 2) {

								let arg_1 = process.argv[2];
								
								if (arg_1 === "version" || arg_1 === "--version") {
												console.log(commands[0].value);
								}else if(arg_1 === "city" || arg_1 === "--city") {
												if (process.argv[3]) {
																let city = process.argv[3] || "Berlin";
																sendRequestAndGetData(city);
												}else {
																console.log(commands[1].usage);
												}
								}else{
												for (let i=0;i<commands.length;i++) {
																console.log(commands[i].name,"--",commands[i].desc);
												}
								}
				
				}else{
												for (let i=0;i<commands.length;i++) {
																console.log(commands[i].name,"--",commands[i].desc);
												}
				}
		
}

main()

function calculateFahreneinheit(tempCelsius) {
				let result = (temp * 9/5) + 32;
				return result;
}

function calculateKelvin(tempCelsius) {
				let result = tempCelsius + 273.15;
				return result;

}

function convertTemperatureFromCelsius(weatherData,temp) {
				if (weatherData[0].temp) {
								let tempCelsius = weatherData[0].temp;
								let tempScale = settings.settings.temperatureScale;
								if (tempScale === "F") {
												let tempFahreneinheit = calculateFahreneinheit(tempCelsius);
												temp = tempFahreneinheit + tempScale;
												return temp;
								}else if (tempScale === "K") {
												let tempKelvin = calculateKelvin(tempCelsius);
												temp = tempKelvin + tempScale;
												return temp;
								}
								else{
												temp = tempCelsius + tempScale;
												return temp;
								}
				}
}

async function sendRequestAndGetData(city) {
				let { lat, long } = await getCityData(city);
				let data = await getWeatherData(lat,long);

				let timeString = new Date();
				timeString = timeString.getHours() + ":" +  timeString.getMinutes()

				const weatherData = [{
								...(settings.dataToDisplay.temp ? { temp: data.current["temperature_2m"] } : {} ),
								...(settings.dataToDisplay.humidity? { humidity: data.current["relative_humidity_2m"] } : {}),
								...(settings.dataToDisplay.weather? { weather: data.current["weathercode"] } : {}),
				}];

				var temp = weatherData[0].temp;
				temp = convertTemperatureFromCelsius(weatherData,temp);
				

				let weatherDesc = weatherCodes[weatherData[0].weather];

			const colorschemePink = `
  \x1b[35m  Weather   ${weatherDesc}
  \x1b[35m  Temp      ${temp}
  \x1b[35m  Time      ${timeString}
  \x1b[35m  Humidity  ${weatherData[0].humidity}%
				`
			const colorschemeGruvbox = `
  \x1b[38;5;223m  Weather   ${weatherDesc}
  \x1b[38;5;223m  Temp      ${temp}
  \x1b[38;5;223m  Time      ${timeString}
  \x1b[38;5;223m  Humidity  ${weatherData[0].humidity}%
				`

			const colorschemeStandard = `
  Weather   ${weatherDesc}
  Temp      ${temp}
  Time      ${timeString}
  Humidity  ${weatherData[0].humidity}%
				`

				if (weatherDesc.includes("rain") ) {
								console.log(asciiWeather[61]);
				}else if (weatherDesc.includes("snowfall") || weatherDesc.includes("freezing") || weatherDesc.includes("Snow")){
								console.log(asciiWeather[42]);
				}else if (weatherDesc.includes("Thunderstorm")) {
								console.log(asciiWeather[44]);
				}else if (weatherDesc.includes("cloudy")) {
								console.log(asciiWeather[2]);
				}
				else {
								console.log(asciiWeather[weatherData[0].weather] || asciiWeather[0]);
				}

	
				if (settings.settings.colorscheme === "pink") {
								console.log(colorschemePink);
				}else if (settings.settings.colorscheme === "yellow"){
								console.log(colorschemeGruvbox);
				}else{
								console.log(colorschemeStandard);
				}


}


