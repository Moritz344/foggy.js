

async function getCityData(city) {

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&fields=latitude,longitude `;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(response.status);
    }else{
      const data = await response.json();
 
      let lat = data.results[0]["latitude"];
      let long = data.results[0]["longitude"];
      return { lat, long }

    }
  }catch(error) {
    console.log(error);
  }


  


}
async function getWeatherData(lat,long) {


  const url = ` https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,weathercode&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode`;



  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(response.status);
    }else {
      const data = await response.json();

      return data;

    }

  } catch(error) {
    console.log(error);
  }


}



module.exports = {
				getWeatherData,
				getCityData
}

