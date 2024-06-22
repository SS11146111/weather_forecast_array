let errorMsg;

//display intro image
function introfun(){
    displayTime(); 
    document.getElementById("forecastReport").innerHTML = "<img src='/images/intro.gif' id='introImg'/>"; 
}

/**---------------------------------------------------------------------------------------------------------------------------------------------- */

//function to display current date and time
function displayTime(){

    setInterval(()=>{
   
        //fetching current datetime
        fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
            .then(res => res.json())
            .then(json => {
        
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let timestamp = Date.parse(json.datetime);
                let date = new Date(timestamp);
                let year = date.getFullYear(); 
                let month = months[date.getMonth()];
                let day = date.getDate(); 
                let hour = date.getHours(); 
                let min = date.getMinutes(); 
                let sec = date.getSeconds(); 
        
                document.getElementById("displayDate").innerHTML = day + ", " + month + " " + year + "<br>" + hour+":"+min+":"+sec;
            })
            .catch((error) => errorMsg = error.message)
      
    },1000)
}

/*------------------------------------------------------------------------------------------------------------------------------------------------*/


//getting current weather report on search by name
document.getElementById("enter").addEventListener("click",
    function()
    {
        const city = document.getElementById("cityName").value;
        
        if(city != "")
            {
                getCurrentWeatherReport(city);
            }
        else{
            
            document.getElementById("container1").style.display = "none";
            document.getElementById("container2").style.display = "none";
            document.getElementById("msg1").style.display = "block";
            document.getElementById("ok1").addEventListener("click",
                function(){
                    document.getElementById("msg1").style.display = "none";
                    document.getElementById("container1").style.display = "block";
                    document.getElementById("container2").style.display = "block";
                }
            )

        }

    }
)

//function to get current weather report for a city on search by name
function getCurrentWeatherReport(city)
{   
    let flag = false;
    city = city.toUpperCase();
    let storedcityData = JSON.parse(localStorage.getItem("cityData")) || [];
    
    for(let c of storedcityData)
        {
            if(c == city)
                {   
                    flag=true;
                }
        }

    if(flag == false)
        {
            city = city.toUpperCase();
            storedcityData.push(city);
            localStorage.setItem("cityData", JSON.stringify(storedcityData));

        }

    //fetching current weather data
    Promise.race([fetch("http://api.weatherapi.com/v1/current.json?key=b6c462720ea9421a933195817241206&q="+city+"&aqi=no"),
        new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Operation timed out")), 10000);
    })])
    // fetch("http://api.weatherapi.com/v1/current.json?key=b6c462720ea9421a933195817241206&q=Guwahati&aqi=no") (for testing)
    .then(res =>{

        if(res.status == 200)
        {
            return res.json();
            
        }
        else if(res.status == 400 || res.status == 404)
        {
            throw new Error('No matching location found');
        }
        else
        {
                
            throw new Error('Failed to Fetch Data!!!');
        }
    })
    .then(json => {
        //displaying the current weather report
        document.getElementById("report").style.display = "block";

        document.getElementById("myCity").innerHTML = city.toUpperCase();

        let temperature = (json.current.temp_c).toFixed(1);
        document.getElementById("temperature").innerHTML = temperature;
    
        let wind = (json.current.wind_mph).toFixed(1);
        document.getElementById("wind").innerHTML = wind;

        let humidity = json.current.humidity;
        document.getElementById("humidity").innerHTML = humidity;
        
        let visibility = json.current.vis_km;
        document.getElementById("visibility").innerHTML = visibility;

        let src = json.current.condition.icon;
        let desc = json.current.condition.text;
        {
            let firstLetter = desc.charAt(0).toUpperCase();
            let remainingLetters = desc.substring(1);
            desc = firstLetter + remainingLetters;
        }
        
        document.getElementById("weatherCnd").src="http:"+src;
        document.getElementById("weatherDesc").innerHTML = desc;
        document.getElementById("more_data1").addEventListener("click", 
        function(){
            location.href = `/html/moreData.html?city=`+city+`&type=current`;
            //location.href = `/html/moreData.html?city=Guwahati&type=current`; for testing

        })
    })
    .catch((error)=>{
      
        let div = document.getElementById("report")
        div.style.display = "block";
        div.innerHTML = error.message;
        div.style.padding =  "16px";
        div.style.textAlign = "center";
        div.style.fontWeight = "bold";
        const img = document.createElement("img");
        img.src = "/images/not_found_2.png";
        div.appendChild(img);
        setTimeout(()=>{
          location.reload();
        },2000)

    })
}



/*------------------------------------------------------------------------------------------------------------------------------------------------*/

//get current weather report from current position 
function getCurrentByLocation() 
{
    //getting current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showCity1);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
}
  
function showCity1(position) 
{
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    //let latitude = 333333; for testing
    //let longitude = 333333; for testing
    
    //getting city name of current position
    Promise.race([fetch("http://api.openweathermap.org/geo/1.0/reverse?lat="+latitude+"&lon="+longitude+"&limit=1&appid=9a67710d25a248e3b44c5a1fa1391638"),new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Operation timed out")), 10000);
    })])
        .then(res => {
            if(res.status == 200)
                {
                    return res.json();
                    
                }
                else
                {
                        
                    throw new Error('Failed to Fetch Data!!!');
                }
        })
        .then(json => {
            //let j=undefined; for testing
            if(json[0].name != undefined)
                {
                    //getting current weather report
                    getCurrentWeatherReport(json[0].name)
                }
            else{
                    throw new Error('No matching location found');
                }
                
        })
        .catch((error)=>{

            let div = document.getElementById("report")
            div.style.display = "block";
            div.innerHTML = error.message;
            div.style.padding =  "16px";
            div.style.textAlign = "center";
            div.style.fontWeight = "bold";
            const img = document.createElement("img");
            img.src = "/images/not_found_2.png";
            div.appendChild(img);
            setTimeout(()=>{
              location.reload();
            },2000)
        })
    
}

/**---------------------------------------------------------------------------------------------------------------------------------------------- */

//get extended forecast on search by name
 document.getElementById("enterForecast").addEventListener("click",
    function(){
        const cityForecast = document.getElementById("cityForecast").value;
        const days = document.getElementById("days").value;
  
        if(cityForecast != "" && days != "")
            {
                if(days < 1 || days > 14)
                    {
                        document.getElementById("container1").style.display = "none";
                        document.getElementById("container2").style.display = "none";
                        document.getElementById("msg4").style.display = "block";
                        document.getElementById("ok4").addEventListener("click",
                            function(){
                                   
                                document.getElementById("msg4").style.display = "none";
                                document.getElementById("container1").style.display = "block";
                                document.getElementById("container2").style.display = "block";
                            })
                    }
                else{
                    getForecast(cityForecast);
                }
               
            }
        else 
        {
            
            document.getElementById("container1").style.display = "none";
            document.getElementById("container2").style.display = "none";
            document.getElementById("msg2").style.display = "block";
            document.getElementById("ok2").addEventListener("click",
            function(){
                document.getElementById("msg2").style.display = "none";
                document.getElementById("container1").style.display = "block";
                document.getElementById("container2").style.display = "block";
            }
        )}
    })

//function to get extended forecast for a city on search by name
function getForecast(city){
    let flag = false;
    city = city.toUpperCase();
    let storedcityData = JSON.parse(localStorage.getItem("forecastData")) || [];
    
    for(let c of storedcityData)
        {
            if(c == city)
                {   
                    flag=true;
                }
        }

    if(flag == false)
        {
            city = city.toUpperCase();
            storedcityData.push(city);
            localStorage.setItem("forecastData", JSON.stringify(storedcityData));

        }

    document.getElementById("forecastReport").innerHTML = "";
    
    const days = document.getElementById("days").value;
        
    for(let i=1; i<=days; i++)
        {
            const div = document.createElement("div");
            div.className = "style";
            const parent = document.getElementById("forecastReport");
            parent.appendChild(div);
        }

    //fetching extended forecast data
    Promise.race([fetch("http://api.weatherapi.com/v1/forecast.json?key=b6c462720ea9421a933195817241206&q="+city+"&days="+days+"&aqi=no&alerts=no"),new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Operation timed out")), 10000);
    })])
    //fetch("http://api.weatherapi.com/v1/forecast.json?key=b6c462720ea9421a933195817241206&q=Guwahati&days="+days+"&aqi=no&alerts=no") ; for testing
        .then(res => {
            if(res.status == 200)
                {
                    return res.json();
                    
                }
                else if(res.status == 400 || res.status == 404)
                {
                    throw new Error('No matching location found');
                }
                else
                {
                        
                    throw new Error('Failed to Fetch Data!!!');
                }
        })
        .then(json => 
            {
                //displaying extended forecast data
                for(let i = 0; i<days ; i++)
                {
                    const record = json.forecast.forecastday[i];

                    let day = "<tr><td class='text-black font-bold p-2 bg-slate-200 lg:text-sm'>Date:</td><td class='text-black font-bold bg-slate-200 mr-2 lg:text-sm'>"+record.date+"</td></tr>";
                    let max_temp = "<tr><td class='text-blue-800 font-bold p-2 flex flex-row lg:text-sm'>Max Temp (c):</td><td class='lg:text-sm'>"+record.day.maxtemp_c+"</td></tr>";
                    let min_temp = "<tr><td class='text-blue-800 font-bold p-2 bg-slate-200 lg:text-sm'>Min Temp (c):</td><td class='bg-slate-200 lg:text-sm'>"+record.day.mintemp_c+"</td></tr>";
                    let max_wind = "<tr><td class='text-blue-800 font-bold p-2  lg:text-sm'>Max Wind (m/h):</td><td class='lg:text-sm'>"+record.day.maxwind_mph+"</td></tr>";
                    let avg_vis = "<tr><td class='text-blue-800 font-bold p-2 bg-slate-200 lg:text-sm'>Avg Visibility (km):</td><td class='bg-slate-200 lg:text-sm'>"+record.day.avgvis_km+"</td></tr>";
                    let avg_humi = "<tr><td class='text-blue-800 font-bold p-2 lg:text-sm'>Avg Humidity (%):</td><td class='lg:text-sm'>"+record.day.avghumidity+"</td></tr>";
                    let desc = "<p class='text-center text-white font-bold forecastCnd m-2 lg:text-sm'>"+record.day.condition.text+"</p>";
                    let imgSrc =`<img src="http:`+record.day.condition.icon+`" width="60" height="40" class="forecastImg"/>`;

                    document.getElementsByClassName("style")[i].innerHTML = "<div class='bg-white mt-2 ml-4 mr-4 rounded-md'><table>"+day+max_temp+min_temp+max_wind+avg_vis+avg_humi+"</table></div><div class='bg-blue-800 rounded-md m-1 ml-4 mr-4 flex w-64' id='paraCnd'>"+imgSrc+desc+"</div>";

                }
                document.getElementById("more_data2").style.display = "block";
                document.getElementById("more_data2").addEventListener("click",
                    function(){
                        location.href=`/html/moreData.html?city=`+city+`&days=`+days+`&type=forecast`;
                        //location.href=`/html/moreData.html?city=Guwahati&days=`+days+`&type=forecast`; for testing
                    }
                )
            }
        )
    .catch((error) => {
        
                document.getElementById("more_data2").style.display = "none";
                let div = document.getElementById("forecastReport")
                div.style.display = "block";
                div.innerHTML = error.message;
                div.style.padding =  "10px";
                div.style.textAlign = "center";
                div.style.fontWeight = "bold";
                div.style.backgroundImage = "url('/images/not_found_2.png')";
                div.classList.add("notFoundImg");
                setTimeout(()=>{
                    location.reload()
                    },2000)

        
    })
}

/**---------------------------------------------------------------------------------------------------------------------------------------------- */

//get extended forecast on search by current location
document.getElementById("gfl").addEventListener("click",
    function(){
        const days = document.getElementById("days").value;
        if(days!="")
            {
                if(days < 1 || days > 14)
                    {
                        document.getElementById("container1").style.display = "none";
                        document.getElementById("container2").style.display = "none";
                        document.getElementById("msg4").style.display = "block";
                        document.getElementById("ok4").addEventListener("click",
                            function(){
                                   
                                document.getElementById("msg4").style.display = "none";
                                document.getElementById("container1").style.display = "block";
                                document.getElementById("container2").style.display = "block";
                            })
                    }
                    else{
                        getForecastByLocation();
                    }
                
            }     
        else
        {
            document.getElementById("container1").style.display = "none";
            document.getElementById("container2").style.display = "none";
            document.getElementById("msg3").style.display = "block";
            document.getElementById("ok3").addEventListener("click",
            function(){
                document.getElementById("msg3").style.display = "none";
                document.getElementById("container1").style.display = "block";
                document.getElementById("container2").style.display = "block";
            })
            
        }
    }
)

function getForecastByLocation() 
{
  //getting current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showCity2);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
}
  
function showCity2(position) 
{
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    //fetching city name for current position
    Promise.race([fetch("http://api.openweathermap.org/geo/1.0/reverse?lat="+latitude+"&lon="+longitude+"&limit=1&appid=9a67710d25a248e3b44c5a1fa1391638"),new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Operation timed out")), 2000);
    })])
        .then(res => {
            if(res.status == 200)
                {
                    return res.json();
                    
                }
                else
                {
                        
                    throw new Error('Failed to Fetch Data!!!');
                }
        })
        .then(json => {
            if(json[0].name != undefined)
                {
                    //getting extended forecast for city
                    getForecast(json[0].name)
                }
            else{
               
                    throw new Error('No matching location found');
                }
                
        })
        .catch((error)=>{

            
            document.getElementById("more_data2").style.display = "none";
            let div = document.getElementById("forecastReport")
            div.style.display = "block";
            div.innerHTML = error.message;
            div.style.padding =  "10px";
            div.style.textAlign = "center";
            div.style.fontWeight = "bold";
            div.style.backgroundImage = "url('/images/not_found_2.png')";
            div.classList.add("notFoundImg");
            setTimeout(()=>{
                location.reload()
                },2000)
        })

}

/**---------------------------------------------------------------------------------------------------------------------------------------------- */

//dropdown list/city search history for current weather report
document.getElementById("caret").addEventListener("click",
    function(){

       let parent = document.getElementById("history");
       parent.innerHTML = "";
       let storedcityData = JSON.parse(localStorage.getItem("cityData"))
      
       if(storedcityData == null)
       {
            document.getElementById("dropDownContent").style.display ="none";
       }
       else
       {
        document.getElementById("dropDownContent").style.display ="block";
       

         for(let i=0; i<storedcityData.length; i++)
            {
                let b = document.createElement("button");
                b.innerHTML=storedcityData[i];
                b.style.padding = "4px";
                b.classList.add("historyID");
                parent.appendChild(b)
                
            }  
       }
       search()
})

function search(){
    let searchHistory = document.getElementsByClassName("historyID");
    let city;
    for(let i=0; i<searchHistory.length; i++)
        {
            searchHistory[i].addEventListener("click",
                function(){
                    city = searchHistory[i].innerHTML;
                    document.getElementById("cityName").value = city;
                    getCurrentWeatherReport(city)
                }
            )
        }

}

document.getElementById("history").addEventListener("click",
    function(){
        document.getElementById("dropDownContent").style.display = "none";
    }
)

document.getElementById("close").addEventListener("click",
    function(){

       document.getElementById("dropDownContent").style.display ="none";

})

document.getElementById("clr").addEventListener("click",
    function(){
        document.getElementById("history").innerHTML = "";
        localStorage.removeItem("cityData");
        document.getElementById("dropDownContent").style.display ="none";

})
/**---------------------------------------------------------------------------------------------------------------------------------------------- */

//dropdown list/city search history for extended weather report
document.getElementById("caret2").addEventListener("click",
    function(){

       let parent = document.getElementById("history2");
       parent.innerHTML = "";
       let storedcityData = JSON.parse(localStorage.getItem("forecastData"))
      
       if(storedcityData == null)
       {
            document.getElementById("dropDownContent2").style.display ="none";
       }
       else
       {
        document.getElementById("dropDownContent2").style.display ="block";
       

         for(let i=0; i<storedcityData.length; i++)
            {
                let b = document.createElement("button");
                b.innerHTML=storedcityData[i];
                b.style.padding = "4px";
                b.classList.add("historyID2");
                parent.appendChild(b)
                
            }  
       }

       search2()

})

function search2(){
    let searchHistory = document.getElementsByClassName("historyID2");
    let city;
    for(let i=0; i<searchHistory.length; i++)
        {
            searchHistory[i].addEventListener("click",
                function(){
                    city = searchHistory[i].innerHTML;
                    document.getElementById("cityForecast").value = city;
            
                }
            )
        }

}

document.getElementById("history2").addEventListener("click",
    function(){
        document.getElementById("dropDownContent2").style.display = "none";
    }
)

document.getElementById("close2").addEventListener("click",
    function(){

       document.getElementById("dropDownContent2").style.display ="none";

})

document.getElementById("clr2").addEventListener("click",
    function(){
        document.getElementById("history2").innerHTML = "";
        localStorage.removeItem("forecastData");
        document.getElementById("dropDownContent2").style.display ="none";

})

/**--------------------------------------------------------------------------------------------------------------------------------------------- */