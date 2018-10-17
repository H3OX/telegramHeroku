const Telegraf = require('telegraf') //Telegraf API
const app = require('express')()
const request = require('request') //Request API
const emoji = require('node-emoji') //Emoji usage
const token = '561442379:AAEvgdqOeUkybVNa199Q1XJSoh-I2IXR2Xs' //Telegram API token
const bot = new Telegraf(token)
const coordx = 55.753960 //Moscow x coordinates
const coordy = 37.620393 //Moscow y coordinates
const apikey = '7da57778334a1b3fe7e5990a67e0d167' //DarkSky API key
const url = `https://api.darksky.net/forecast/${apikey}/${coordx},${coordy}?units=ca`

var reqTimer = setTimeout(function wakeUp() {
   request("https://telegramweatherbotneox.herokuapp.com/", function() {
      console.log("WAKE UP DYNO");
   });
   return reqTimer = setTimeout(wakeUp, 1200000);
}, 1200000);

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});

//Array of emojis
let emojiArray = ['sunny', 'cloud', 'new_moon', 'rain_cloud', 'snowflake', 'snow_cloud', 'dash',
'foggy', 'sun_behind_cloud', 'sun_small_cloud', 'thermometer', 'droplet', 'balloon', 'flashlight', 'bulb']

//Bot first response
bot.start(ctx => {
    return ctx.reply("Hello! I will show you the current weather. Simply type in the /weather command.")
})

//Request for the GET method to parse JSON weather file
request(url, (err, res, body) => {
    if(err) console.log(err)
    else {

        //JSON parsing
        let d = JSON.parse(body)

        //Dynamic emoji icon switch
        let weatherState = d.currently.icon
        switch(weatherState){
            case 'clear-day':
                weatherState = `${emoji.get(emojiArray[0])}Clear day`
                break
            case 'clear-night':
                weatherState = `${emoji.get(emojiArray[2])}Clear night`
                break
            case 'rain':
                weatherState = `${emoji.get(emojiArray[3])}Rain`
                break
            case 'snow':
                weatherState = `${emoji.get(emojiArray[4])}Snow`
                break
            case 'sleet':
                weatherState = `${emoji.get(emojiArray[5])}Sleet`
                break
            case 'wind':
                weatherState = `${emoji.get(emojiArray[6])}Wind`
                break
            case 'fog':
                weatherState = `${emoji.get(emojiArray[7])}Fog`
                break
            case 'cloudy':
                weatherState = `${emoji.get(emojiArray[1])}Cloudy`
                break
            case 'partly-cloudy-day':
                weatherState = `${emoji.get(emojiArray[9])}Partly cloudy day`
                break
            case 'partly-cloudy-night':
                weatherState = `${emoji.get(emojiArray[1])}${emoji.get(emojiArray[2])}Partly cloudy night`
                break
        }

        // /weather command to get weather info
        bot.command('weather', ctx => {
            return ctx.reply(`
Timezone: ${d.timezone}
${weatherState}
${emoji.get(emojiArray[10])}Temperature: ${d.currently.temperature} °C
${emoji.get(emojiArray[11])}Humidity: ${Math.round(d.currently.humidity * 100)} %
${emoji.get(emojiArray[12])}Pressure: ${d.currently.pressure} PSI
${emoji.get(emojiArray[1])}Cloud cover: ${d.currently.cloudCover * 100} %
${emoji.get(emojiArray[0])}UV index: ${d.currently.uvIndex} UVI
${emoji.get(emojiArray[13])}Visibility: ${d.currently.visibility}
${emoji.get(emojiArray[14])}Ozone: ${d.currently.ozone} DU
`)
        })
    }
})
// Server listening
bot.startPolling()





