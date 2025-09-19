const os = require('os');
const fs = require('fs');
const path = require('path');

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

const dataToShow = JSON.parse(
				fs.readFileSync(path.join(__dirname,'config.json'),'utf-8')
);

const commands = [
				{
								name: "version",
								value: pkg.version,
								desc: "show the current version"
				},
				{
								name: "city",
								desc: "specify a city"
				},
				{
								name: "help",
								desc: "Print command-specific usage"
				}
];


function main(){
				if (process.argv.length > 1) {

								let arg_1 = process.argv[2];
								
								if (arg_1 === "version") {
												console.log(commands[0].value);
								}else if(arg_1 === "city") {
												if (process.argv[3]) {
																let city = process.argv[3] || "Berlin";
																sendRequestAndGetData(city);
												}
												
								}else{
												for (let i=0;i<commands.length;i++) {
																console.log(commands[i].name,"--",commands[i].desc);
												}
								}
				
				}
		
}

main()


async function sendRequestAndGetData(city) {
				let { lat, long } = await getCityData(city);
				let data = await getWeatherData(lat,long);

				const weatherData = [{
								...(dataToShow.dataToDisplay.temp ? { temp: data.current["temperature_2m"] } : {}),
								...(dataToShow.dataToDisplay.humidity? { humidity: data.current["relative_humidity_2m"] } : {}),
								...(dataToShow.dataToDisplay.weather? { weather: data.current["weathercode"] } : {}),
				}];
				let timeString = new Date();
				timeString = timeString.getHours() + ":" +  timeString.getMinutes()

				let weatherDesc = weatherCodes[weatherData[0].weather];
			const prettyOutput = `
   Weather   ${weatherDesc}
   Temp      ${weatherData[0].temp}°C
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

	
				console.log(prettyOutput);


}


