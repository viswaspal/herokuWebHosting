const http=require("http");
const fs =require("fs");
var requests=require("requests");

var homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",Math.round((orgVal.main.temp-273.15)));
    temperature=temperature.replace("{%tempmin%}",Math.round((orgVal.main.temp_min-273.15)));
    temperature=temperature.replace("{%tempmax%}",Math.round((orgVal.main.temp_max-273.15)));
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country)
    temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main)
    return temperature;
}

const  server=http.createServer((req,res)=>{
    if(req.url == "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Kanpur&appid=7c40fda1f0e6bf67d61b4f622222afa9"
        )
            .on("data",function (chunk){
                const objData = JSON.parse(chunk);
                const arrData=[objData];
                // console.log(objData);
             
                const realTimeData = arrData.map((val)=>
                    // console.log(val.main);
                    replaceVal(homeFile,val))
                    .join("");
                    res.write(realTimeData);
                    // console.log(realTimeData);
                    
                })

            .on("end",function (err){
                if(err){
                    return console.log("Connection closes",err);            
                }
                res.end();
    
            });
    }
});
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listen on port 8000");
});