const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fetch = require('node-fetch')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
dotenv.config({path: './private/.env'})

const publicDirectoryPath = path.join(__dirname, 'public')
const viewsPath = path.join(__dirname, 'templates/views')
const partialsPath = path.join(__dirname, 'templates/partials')

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//------------------------------------------------------------------

class Country {
    constructor({ Confirmed, Deaths, Recovered}, oldConfirmed, oldDeaths, oldRecovered){
        this.confirmed = Confirmed,
        this.newConfirmed = Confirmed - oldConfirmed,
        this.deaths = Deaths,
        this.newDeaths = Deaths - oldDeaths,
        this.recovered = Recovered,
        this.newRecovered = Recovered - oldRecovered
    }

    confirmedRateCalculation = function(yesterdayConfirmed) {

        if ( this.confirmed == 0 || yesterdayConfirmed == 0 || this.newConfirmed == 0 ) this.confirmedRate = 0;
        else this.confirmedRate = (this.newConfirmed / yesterdayConfirmed * 100).toFixed(2);
    
    }
    
    deathsRateCalculation = function(yesterdayDeaths) {

        if ( this.Deaths == 0 || yesterdayDeaths == 0 || this.newDeaths == 0 ) this.deathsRate = 0;
        else this.deathsRate = (this.newDeaths / yesterdayDeaths * 100).toFixed(2);

    }

    recoveredRateCalculation = function(yesterdayRecovered) {

        if( this.Recovered == 0 || yesterdayRecovered == 0 || this.newRecovered == 0 ) this.recoveredRate = 0;
        else this.recoveredRate = (this.newRecovered / yesterdayRecovered * 100).toFixed(2);

    }

}

dynamicSort = (property) => {
   var sortOrder = 1;

   if(property[0] === "-") {
       sortOrder = -1;
       property = property.substr(1);
   }

   return function (a,b) {
       if(sortOrder == -1){
           return b[property].localeCompare(a[property]);
       }else{
           return a[property].localeCompare(b[property]);
       }        
   }
}
getCountryNames = async () => {
    try {

        const response = await fetch("https://api.covid19api.com/countries");
        let countryNames = await response.json();
        countryNames = await countryNames.filter((country) => country.ISO2 !== "US" && country.ISO2 !== "CN")
        await countryNames.sort(dynamicSort("Country"));
        
        return countryNames;

    } catch (e) {
        console.log("qui c'è un errore nella richiesta [country name]")
        console.log(e)
    }
}

createDoughnutChart = async (country) => {
    try{

        const response = await fetch(`https://api.covid19api.com/country/${country}`);
        const data = await response.json();

        const filteredData = data.filter((country) => country.Province === "")

        const todayData = filteredData[filteredData.length-1];
        const yesterdayData = filteredData[filteredData.length-2];
        const {Confirmed, Deaths, Recovered} = yesterdayData;

        let countryData = new Country(todayData, Confirmed, Deaths, Recovered);
        countryData.confirmedRateCalculation(Confirmed)
        countryData.deathsRateCalculation(Deaths);
        countryData.recoveredRateCalculation(Recovered);
        countryData.name = todayData.Country;

        return countryData;

    } catch(e) {
        console.log("qui c'è un errore nella richiesta [country doughnut]")
        console.log(e)
    }
}

createLineChart = async (country) => {
    try{
        const date = new Date();
        let today = date.getDate();
        const month = date.getMonth();
        const response = await fetch(`https://api.covid19api.com/country/${country}?from=2020-${month+1}-01T00:00:00Z&to=2020-${month+1}-${today}T00:00:00Z`) 
        const data = await response.json();
        let deathsList = [];
        let confirmedList = [];
        let recoveredList = [];
        let daysList = [];
        data.forEach((country, index) => {
            deathsList.push(country.Deaths);
            confirmedList.push(country.Confirmed);
            recoveredList.push(country.Recovered);
            daysList[index] = index+1;
        })

        return {deathsList, recoveredList, confirmedList, daysList};
        
    } catch(e) {
        console.log("qui c'è un errore nella richiesta [country line]")
        console.log(e)
    }
}

//------------------------------------------------------------------
app.get("", async (req, res) => {
    const countryData = await createDoughnutChart("IT");
    const countryNames = await getCountryNames();
    const monthData = await createLineChart("italy");

    res.render("index", {countryData, countryNames, monthData});
})

app.get("/country/:country", async(req,res) => {
    const country = req.params.country;
    const countryData = await createDoughnutChart(country);
    const countryNames = await getCountryNames();
    const monthData = await createLineChart(country);
    res.render("index", {countryData, countryNames, monthData});
})

app.get("/change-country", async(req,res) => {
    const country = req.query.country;
    const countryData = await createDoughnutChart(country);
    const countryNames = await getCountryNames();
    const monthData = await createLineChart(country);
    res.send({countryData, countryNames, monthData});

})

 .listen(80);