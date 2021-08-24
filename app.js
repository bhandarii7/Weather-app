// search elements
const searchBtn = document.getElementById('submit-btn');
const inputValue = document.getElementById('input-value');
const refreshBtn = document.getElementById('refresh');

// current data showing elements
const currentTempt = document.getElementById('tempt');
const currentPlace = document.getElementById('place');
const currentDesc = document.getElementById('desc');
const currentMax = document.getElementById('max-tempt');
const currentMin = document.getElementById('min-tempt');
const DescIcon = document.getElementById('desc-icon');
const buttonRight = document.getElementById('slideright');
const buttonLeft = document.getElementById('slideleft');

// advance data showing elements
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const UV = document.getElementById('UV');
const pressure = document.getElementById('pressure');
const riseTime = document.getElementById('rise-time');
const setTime = document.getElementById('set-time');


//hourly elements

const hourlyRow = document.getElementById('hourly-row');
const previewData = document.querySelector('.data-available');

// hourly weather's scroll buttons

buttonRight.onclick = function () {
    document.getElementById('hourly-row').scrollLeft += 835;
};
buttonLeft.onclick = function () {
    document.getElementById('hourly-row').scrollLeft -= 835;
};

// daily elements

const dailyRow = document.getElementById('daily-row');
// console.log(dailyRow);


// API call

async function getLocation(CITY) {
    const KEY = '729d3b03b686bf51bc21b551da522d39';
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${KEY}`;
    const currentResponse = await fetch(currentUrl);

    // error handling

    if (currentResponse.status === 200) {
        const currentData = await currentResponse.json();

        // getting currentData
        const getPlace = currentData.name;
        const getCountry = currentData.sys.country;
        const getTempt = currentData.main.temp;
        const getMax = currentData.main.temp_max;
        const getMin = currentData.main.temp_min;
        const getDesc = currentData.weather[0].description;
        const getIcon = currentData.weather[0].icon;
        const lat = currentData.coord.lat;
        const lon = currentData.coord.lon;


        const weeklyUrl =
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}8&lon=${lon}&exclude=minutely&units=metric&appid=${KEY}`;
        const weeklyResponse = await fetch(weeklyUrl);
        const weeklyData = await weeklyResponse.json();
        console.log(weeklyData);
        const getWindSpeed = weeklyData.current.wind_speed;
        const getHumidity = weeklyData.current.humidity;
        const getUV = weeklyData.current.uvi;
        const getPressure = weeklyData.current.pressure;
        const sunRise = weeklyData.current.sunrise;
        const sunSet = weeklyData.current.sunset;
        const hourlyArr = weeklyData.hourly;
        const dailyArr = weeklyData.daily;

        hourlyRow.innerHTML = '';
        hourlyArr.slice(0, 24).map(hours => {
            const getTime = hours.dt;
            const getHourlyIcon = hours.weather[0].icon;
            const getHourlyTempt = hours.temp;
            displayHourly(getTime, getHourlyIcon, getHourlyTempt);
        })

        dailyRow.innerHTML = '';

        dailyArr.map(day => {
            const getDailyDate = day.dt;
            const getDailyIcon = day.weather[0].icon;
            const getDailyMax = day.temp.max;
            const getDailyMin = day.temp.min;
            const getDailyDesc = day.weather[0].description;
            displayDaily(getDailyDate, getDailyIcon, getDailyMax, getDailyMin, getDailyDesc);
        })

        console.log(currentData);
        displayCurrent(getTempt, getCountry, getPlace, getDesc, getMax, getMin, getIcon);
        displayAdvance(getHumidity, getPressure, getWindSpeed, getUV, sunRise, sunSet);

    } else if (currentResponse.status === 404) {
        alert('Place not found');
    }
}




function displayCurrent(tempt, country, place, desc, max, min, icon) {

    currentTempt.innerText = Math.round(tempt);
    currentPlace.innerText = `${place}, ${country}`;
    currentDesc.innerText = desc;
    currentMax.innerText = Math.round(max);
    currentMin.innerText = Math.round(min);
    DescIcon.innerHTML = `
                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="icon">
    `;
    
};

function displayAdvance(setHumidity, setPressure, setWindSpeed, setUV, setRise, setSet) {
    let sunRiseResult = moment.unix(setRise).format('hh:mm A');
    let sunSetResult = moment.unix(setSet).format('hh:mm A');
    console.log(sunRiseResult);
    console.log(sunSetResult);


    riseTime.innerHTML = sunRiseResult;
    setTime.innerHTML = sunSetResult;
    windSpeed.innerText = setWindSpeed;
    humidity.innerText = setHumidity;
    pressure.innerText = setPressure;
    UV.innerText = setUV;

}


function displayHourly(setTime, setIcon, setTempt) {

    const milliseconds = setTime * 1000;
    const dateObject = new Date(milliseconds);
    const time = dateObject.toLocaleString("en-US", {
        hour: "numeric"
    });

    hourlyRow.innerHTML += `
                        <div class="hourly-data">
                            <h5 id="hourly-time">${time}</h5>
                            <h5 id="hourly-icon"><img src="http://openweathermap.org/img/wn/${setIcon}.png" alt="icon"></h5>
                            <h5><span id="hourly-tempt" >${ Math.round(setTempt)}</span><span class="deg-small">&#8451;</span></h5>
                        </div>
    `;
}

function displayDaily(setDate, setIcon, setMax, setMin, setDesc) {

    const milliseconds = setDate * 1000;
    const dateObject = new Date(milliseconds);
    const date = dateObject.toLocaleString("en-US", {
        weekday: "short",
        day: "2-digit"
    });
    dailyRow.innerHTML += `
                        <div id="daily-data" class="daily-data">
                        <h5 id="daily-date">${date}</h5>
                        <h5 id="daily-icon"><img src="http://openweathermap.org/img/wn/${setIcon}.png" alt="icon"> </h5>
                        <div id="daily-max-min">
                          <h5 id="daily-max-tempt">${ Math.round(setMax)}<span class="deg-small">&#8451;</span></h5>
                          <h5 id="daily-min-tempt">${Math.round(setMin)}<span class="deg-small">&#8451;</span></h5>
                        </div>
                        <h5 class="daily-desc">${setDesc}</h5>
                      </div>
    `

}


function clearvalue() {
    inputValue.value = '';
}


function search(e) {
    e.preventDefault();
    getLocation(inputValue.value);
    clearvalue();
}


// search
searchBtn.addEventListener('click', search);

// search when pressed enter
inputValue.addEventListener('keyup', function (e) {
    e.preventDefault();
    if (e.key == 'Enter') {
        searchBtn.click();
    }
});