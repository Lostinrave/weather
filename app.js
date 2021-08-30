const {forecast, places}=require('./forecast');
const http=require('http'); //Prisidedame HTTP moduli
const fs=require('fs');     //Prisidedame FS moduli
const path=require('path'); //Prisidedam path moduli

function generatePlacesSelect(places){
    // Generuojame select ir ji patalpinsime index.html
    let s='<select class="form-control select2" name="place">';
    places.forEach((d)=>{
        s+="<option value='"+d.code+"'>"+d.name+"</option>";
    })
    s+='</select>'
    return s;
}

const server=http.createServer((req, res)=>{
    let url=req.url;

    if(url==='/'){
        //Pasiimame places ir vykdome asinchronine funkcija
        places((places)=>{
            let stream=fs.readFileSync('./template/index.html', 'utf-8');
            stream=stream.replace('{{places}}', generatePlacesSelect(places));
            res.setHeader('Content-Type','text/html');
            res.write(stream);
            return res.end();
        });
    }

    let getData = url.split('?');
    if(getData[0]==='/forecast'){

     // /forecast?place=Kaunas

        let place = getData[1].split('=')[1];
        places((places)=>{
            forecast(place,(temp, place)=>{
                res.setHeader('Content-Type', 'text/html');
                let s='<table class="table">';
                temp.forEach((d)=>{
                    s+='<tr> <td>'+d.time+'</td> <td>'+d.temp+'</td> </tr>'
                });
                s+='</table>';
                let stream=fs.readFileSync('./template/temp.html', 'utf-8');
                stream=stream.replace('{{places}}', generatePlacesSelect(places));
                stream=stream.replace('{{place}}', place);
                stream=stream.replace('{{temperature}}', s);

                const chartData=[];
                temp.forEach((d)=>{
                    chartData.push({
                        x:d.time,
                        y:d.temp
                    });
                });
                console.log(JSON.stringify(temp));
                stream=stream.replace('TemperatureData', JSON.stringify(chartData));

                res.write(stream);
                res.end();
            });
        });
    }
});

server.listen(process.env.PORT);
console.log("Listening: "+process.env.PORT);


// forecast('kaunas', (data)=>{
//     console.log("Temperature forecast: ");
//     data.forEach((d) => {
//         console.log("Day: "+d.time+"\t Temperature:"+d.temp);
//     });
