const request = require('postman-request');


const forecast=(place, callback)=>{

    const url='https://api.meteo.lt/v1/places/'+place+'/forecasts/long-term';

    request({url:url}, (error, response)=>{
        const data=response.body;
        const weather=JSON.parse(data);
        // console.log(weather.place.name);
        let fc=[];
        weather.forecastTimestamps.forEach((d)=>{
            fc.push({
                time:d.forecastTimeUtc,
                temp:d.airTemperature
            });

        });
        callback(fc, weather.place.name);
    });
};
// Funkcija kuri grazins is API per callback funkcija grazins vietoviu sarasa
const places=(callback)=>{
    //API url'as
    const url='https://api.meteo.lt/v1/places';
    request({url:url},(error,response)=>{
        const data=response.body;
        const places=JSON.parse(data);
        const p=[];
        places.forEach((d)=>{
            p.push({
                code:d.code,
                name:d.name
            });
        });
        callback(p);
    });

};

module.exports={forecast, places};