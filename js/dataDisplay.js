let errorMsg;


//display current date and time
function displayTime(){

    setInterval(()=>{

        fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
        .then(res => res.json())
        .then(json => {
    
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let timestamp = Date.parse(json.datetime);
            let date = new Date(timestamp);
            let year = date.getFullYear(); // prints the year (e.g. 2021)
            let month = months[date.getMonth()]; // prints the month (0-11, where 0 = January)
            let day = date.getDate(); // prints the day of the month (1-31)
            let hour = date.getHours(); // prints the hour (0-23)
            let min = date.getMinutes(); // prints the minute (0-59)
            let sec = date.getSeconds(); // prints the second (0-59)
    
            document.getElementById("displayDate").innerHTML = day + ", " + month + " " + year + "<br>" + hour+":"+min+":"+sec;
    
        })
        .catch((error) => errorMsg = error.message)
      
    },1000)

}
/*------------------------------------------------------------------------------------------------------------------------------------------------*/

//function to display additional weather information

function displayData(){
    const storedValues = [];
    const storedKeys = [];
    const storedAirKeys = [];
    const storedAirValues = [];
    const storedLocKeys = [];
    const storedLocValues = [];

    let storedValuesf = [];
    let storedKeysf = [];
  
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const city = urlParams.get('city');
    const type = urlParams.get('type');
    const days = urlParams.get('days');

    if(type === "current")
        {
            fetch("http://api.weatherapi.com/v1/current.json?key=b6c462720ea9421a933195817241206&q="+city+"&aqi=yes")
            //fetch("http://api.weatherapi.com/v1/current.json?key=b6c462720ea9421a933195817241206&q=Guwahati&aqi=yes")
            .then(res => res.json())
            .then(json => {
                    
                    storedValues.push(json.current.uv,json.current.cloud,json.current.dewpoint_c,json.current.feelslike_c,json.current.heatindex_c,json.current.precip_in,json.current.pressure_in,json.current.wind_mph,json.current.wind_dir,json.current.wind_degree,json.current.gust_kph);
                    storedKeys.push("UV index","Cloud","Dew point (c)","Temperature feels like (c)","Heat index (c)","Precipitation amount (in)","Pressure (in)","Wind (m/h)","Wind direction","wind degree","Wind gust (k/h)");
       
                    let table1 = document.getElementById("table1");
                    for(let i=0; i<storedKeys.length; i++)
                    {
                        let row = document.createElement("tr");
                        let col1 = document.createElement("td");
                        let col2 = document.createElement("td");
                        col1.innerHTML = storedKeys[i];
                        col1.style.padding = "2px";
                        col1.style.fontSize = "small"
                        col2.innerHTML = storedValues[i];
                        col2.style.padding = "2px";
                        col2.style.fontSize = "small"
                        row.appendChild(col1);
                        row.appendChild(col2);
                        row.style.padding = "2px";
                        table1.appendChild(row);
                        table1.style.margin = "6px";
                        row.classList.add("sides");
                        col1.classList.add("sides");
                        col2.classList.add("sides");
                    }

                    storedAirKeys.push("Carbon Monoxide (μg/m3)","Ozone (μg/m3)","Nitrogen dioxide (μg/m3)","Sulphur dioxide (μg/m3)","PM2.5 (μg/m3)","PM10 (μg/m3)");
                    storedAirValues.push(json.current.air_quality.co,json.current.air_quality.o3,json.current.air_quality.no2,json.current.air_quality.so2,json.current.air_quality.pm2_5,json.current.air_quality.pm10)
       
                    let table2 = document.getElementById("table2");
                    for(let i=0; i<storedAirKeys.length; i++)
                    {
                        let row = document.createElement("tr");
                        let col1 = document.createElement("td");
                        let col2 = document.createElement("td");
                        col1.innerHTML = storedAirKeys[i];
                        col1.style.padding = "2px";
                        col1.style.fontSize = "small"
                        col2.innerHTML = storedAirValues[i];
                        col2.style.padding = "2px";
                        col2.style.fontSize = "small"
                        row.appendChild(col1);
                        row.appendChild(col2);
                        row.style.padding = "2px";
                        table2.appendChild(row);
                        table2.style.margin = "6px";
                        row.classList.add("sides");
                        col1.classList.add("sides");
                        col2.classList.add("sides");
                    }

                    storedLocKeys.push("Country","Latitude","Longitude","Local time","Local time epoch","City","Region","Time Zone");
                    storedLocValues.push(json.location.country,json.location.lat,json.location.lon,json.location.localtime,json.location.localtime_epoch,json.location.name,json.location.region,json.location.tz_id)
       
                    let table4 = document.getElementById("table4");
                    for(let i=0; i<storedLocKeys.length; i++)
                    {
                        let row = document.createElement("tr");
                        let col1 = document.createElement("td");
                        let col2 = document.createElement("td");
                        col1.innerHTML = storedLocKeys[i];
                        col1.style.padding = "2px";
                        col1.style.fontSize = "small"
                        col2.innerHTML = storedLocValues[i];
                        col2.style.padding = "2px";
                        col2.style.fontSize = "small"
                        row.appendChild(col1);
                        row.appendChild(col2);
                        row.style.padding = "2px";
                        table4.appendChild(row);
                        table4.style.margin = "6px";
                        row.classList.add("sides");
                        col1.classList.add("sides");
                        col2.classList.add("sides");
                    }
                })

        }
    else if(type === "forecast")
        {

            fetch("http://api.weatherapi.com/v1/forecast.json?key=b6c462720ea9421a933195817241206&q="+city+"&days="+days+"&aqi=yes&alerts=yes")
            //fetch("http://api.weatherapi.com/v1/forecast.json?key=b6c462720ea9421a933195817241206&q=Guwahati&days="+days+"&aqi=yes&alerts=yes")
            .then(res => res.json())
            .then(json => {

           
                let div = document.createElement("div");

                for(let i=1; i<json.forecast.forecastday.length; i++)
                    {

                        let date = (json.forecast.forecastday[i].date == null)?"_":json.forecast.forecastday[i].date;
                        let uv = (json.forecast.forecastday[i].day.uv == null)?"_":json.forecast.forecastday[i].day.uv;
                        let totalsnow_cm = (json.forecast.forecastday[i].day.totalsnow_cm == null)?"_":json.forecast.forecastday[i].day.totalsnow_cm.toFixed(2);
                        let totalprecip_mm = (json.forecast.forecastday[i].day.totalprecip_mm == null)?"_":json.forecast.forecastday[i].day.totalprecip_mm.toFixed(2);
                        let daily_will_it_rain = (json.forecast.forecastday[i].day.daily_will_it_rain == null)?"_":json.forecast.forecastday[i].day.daily_will_it_rain;
                        let daily_will_it_snow = (json.forecast.forecastday[i].day.daily_will_it_snow == null)?"_":json.forecast.forecastday[i].day.daily_will_it_snow;
                        let avghumidity = (json.forecast.forecastday[i].day.avghumidity == null)?"_":json.forecast.forecastday[i].day.avghumidity;
                        
                        storedKeysf.push("Date","UV index","Total Snow (cm)","Total Precipitation (in)","Will it rain?","Will it snow?","Avg Humidity (%)");
                        storedValuesf.push(date,uv,totalsnow_cm,totalprecip_mm,daily_will_it_rain,daily_will_it_snow,avghumidity);
                        let table = document.createElement("table");
                        table.classList.add("tdesign");
                        table.style.width = "280px";
                        
                        
                        for(let x=0;x<storedKeysf.length;x++)
                            {
                               
                                let tr = document.createElement("tr");
                                let td1 = document.createElement("td");
                                let td2 = document.createElement("td");
                                td1.innerHTML = storedKeysf[x];
                                td1.classList.add("tdesign");
                                td2.innerHTML = storedValuesf[x];
                                td2.classList.add("tdesign");
                                tr.append(td1);
                                tr.append(td2);
                                table.append(tr);
                            }

                        div.append(table);
                        div.classList.add("tableFlow");
                        storedKeysf = [];
                        storedValuesf = [];
                    }
            
                    document.getElementById("div1").insertBefore(div,document.getElementById("table1"));
                    storedKeysf = [];
                    storedValuesf = [];

                    {
                        let country = (json.location.country == null)?"_":json.location.country;
                        let lat = (json.location.lat == null)?"_":json.location.lat.toFixed(2);
                        let lon = (json.location.lon == null)?"_":json.location.lon.toFixed(2);
                        let localtime = (json.location.localtime == null)?"_":json.location.localtime;
                        let name = (json.location.name == null)?"_":json.location.name;
                        let region = (json.location.region == null)?"_":json.location.region;
                        let tz_id = (json.location.tz_id == null)?"_":json.location.tz_id;

                        storedKeysf.push("Country","Latitude","Longitude","Local Time","City","Region","Time Zone ID");
                        storedValuesf.push(country,lat,lon,localtime,name,region,tz_id);
                        let table = document.createElement("table");
                        table.classList.add("tdesign");
                        table.style.width = "280px";
                        let div2 = document.createElement("div");
                        
                        for(let x=0;x<storedKeysf.length;x++)
                        {
                                    
                            let tr = document.createElement("tr");
                            let td1 = document.createElement("td");
                            let td2 = document.createElement("td");
                            td1.innerHTML = storedKeysf[x];
                            td1.classList.add("tdesign");
                            td2.innerHTML = storedValuesf[x];
                            td2.classList.add("tdesign");
                            tr.append(td1);
                            tr.append(td2);
                            table.append(tr);
                        }
        
                        div2.append(table);
                        div2.classList.add("tableFlow");
                        storedKeysf = [];
                        storedValuesf = [];
                        document.getElementById("div4").insertBefore(div2,document.getElementById("table4"));

                    }

                    let div3 = document.createElement("div");

                    for(let i=1; i<json.forecast.forecastday.length; i++)
                    {
                        let date = (json.forecast.forecastday[i].date == null)? "_":json.forecast.forecastday[i].date;
                        let co = (json.forecast.forecastday[i].day.air_quality.co == null)? "_":json.forecast.forecastday[i].day.air_quality.co.toFixed(2);
                        let no2 = (json.forecast.forecastday[i].day.air_quality.no2 == null)? "_":json.forecast.forecastday[i].day.air_quality.no2.toFixed(2);
                        let o3 = (json.forecast.forecastday[i].day.air_quality.o3 == null)? "_":json.forecast.forecastday[i].day.air_quality.o3.toFixed(2);
                        let so2 = (json.forecast.forecastday[i].day.air_quality.so2 == null)? "_":json.forecast.forecastday[i].day.air_quality.so2.toFixed(2);
                        let pm2_5 = (json.forecast.forecastday[i].day.air_quality.pm2_5 == null)? "_":json.forecast.forecastday[i].day.air_quality.pm2_5.toFixed(2);
                        let pm10 = (json.forecast.forecastday[i].day.air_quality.pm10 == null)? "_":json.forecast.forecastday[i].day.air_quality.pm10.toFixed(2);

                        storedKeysf.push("Date","Carbon Monoxide (μg/m3)","Nitrogen dioxide (μg/m3)","Ozone (μg/m3)","Sulphur dioxide (μg/m3)","PM2.5 (μg/m3)","PM10 (μg/m3)");
                        storedValuesf.push(date,co,no2,o3,so2,pm2_5,pm10);
                       
                        let table = document.createElement("table");
                        table.classList.add("tdesign");
                        table.style.width = "280px";
                        
                        for(let x=0;x<storedKeysf.length;x++)
                            {
                               
                                let tr = document.createElement("tr");
                                let td1 = document.createElement("td");
                                let td2 = document.createElement("td");
                                td1.innerHTML = storedKeysf[x];
                                td1.classList.add("tdesign");
                                td2.innerHTML = storedValuesf[x];
                                td2.classList.add("tdesign");
                                tr.append(td1);
                                tr.append(td2);
                                table.append(tr);
                            }

                        div3.append(table);
                        div3.classList.add("tableFlow");
                        storedKeysf = [];
                        storedValuesf = [];
                    }
            
                    document.getElementById("div2").insertBefore(div3,document.getElementById("table2"));
                    storedKeysf = [];
                    storedValuesf = [];
    

            })

        }

    }

displayData()

/*------------------------------------------------------------------------------------------------------------------------------------------------*/

