import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationData } from '../models/Location';
import { WeatherDetails } from '../models/weatherDetails';
import { TemparatureData } from '../models/temparatureData';
import { TodayData } from '../models/TodayData';
import { WeekData } from '../models/WeekData';
import { TodaysHighlight } from '../models/TodaysHighlight';
import { Observable } from 'rxjs';
import { EnvironmentVariables } from '../Environment/EnvironmentVariables';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // variables for Api response raw data
  locationData?:LocationData;
  WeatherDetails?:WeatherDetails;
  // variables for API global storage
  temparatureData?:TemparatureData; //for left container
  todayData?:TodayData[]=[]; //for right container
  weekData?:WeekData[]=[]; //for right container
  todaysHighlight?:TodaysHighlight; //for right container

  // variables for api parameters
  cityName:string='Pune';
  language:string='en-US';
  date:string='20200622';
  units:string='m';
  currentTime:Date;
// booleans for containers
isToday:boolean=false;
isWeek:boolean=true;
isFarenheit:boolean=false;
isCelsius:boolean=true;

  constructor(private http:HttpClient) {
    this.getData();
   }

  getLocationDetails(cityName:string,language:string):Observable<LocationData> {
    return this.http.get<LocationData>(EnvironmentVariables.weatherApiLocationBaseUrl,{
      headers:new HttpHeaders()
      .set(EnvironmentVariables.xRapidApiKeyName,EnvironmentVariables.xRapidApiKeyValue)
      .set(EnvironmentVariables.xRapidApiHostName,EnvironmentVariables.xRapidApiHostValue),
      params:new HttpParams()
      .set('query',cityName)
      .set('language',language)
    })
  }

  getWeatherDetails(date:string,latitude:number,longitude:number,language:string,units:string):Observable<WeatherDetails>{
    return this.http.get<WeatherDetails>(EnvironmentVariables.weatherApiForecastBaseUrl,{
      headers:new HttpHeaders()
      .set(EnvironmentVariables.xRapidApiKeyName,EnvironmentVariables.xRapidApiKeyValue)
      .set(EnvironmentVariables.xRapidApiHostName,EnvironmentVariables.xRapidApiHostValue),
      params:new HttpParams()
      .set('date',date)
      .set('latitude',latitude)
      .set('longitude',longitude)
      .set('language',language)
      .set('units',units)
    })
  }

  getData(){
    this.weekData=[];
    this.todayData=[];
    this.temparatureData=new TemparatureData();
    this.todaysHighlight=new TodaysHighlight();
    let latitude=0;
    let longitude=0;
    this.getLocationDetails(this.cityName,this.language).subscribe({
      next:(response)=>{
        this.locationData=response;
        latitude=this.locationData?.location?.latitude[0];
        longitude=this.locationData?.location?.longitude[0];

        this.getWeatherDetails(this.date,latitude,longitude,this.language,this.units).subscribe({
          next:(response)=>{
            this.WeatherDetails=response;

            this.prepareData();
          }
        });
      }
    });

  }
// manipulating data for ui sections
  prepareData(){
    this.fillTemparatureModel();
    this.fillWeekSection();
    this.fillTodaySection();
    this.fillHighlightSection();
    console.log("Temparature ", this.temparatureData);
    console.log("Week ",this.weekData);
    console.log("Today ",this.todayData);
    console.log("Highlight ",this.todaysHighlight);
  }
  celsiusToFahrenheit(celsius:number){
    return +((celsius * 1.8) + 32).toFixed(2);
  }
  fahrenHeitToCelsius(fahrenHeit:number){
    return +((fahrenHeit - 32) * 0.555).toFixed(2);
  }
  
  fillTemparatureModel(){
    this.temparatureData=new TemparatureData();
    this.currentTime=new Date();
    this.temparatureData.day=this.WeatherDetails['v3-wx-observations-current']?.dayOfWeek;
    this.temparatureData.time=`${String(this.currentTime.getHours()).padStart(2,'0')}:${String(this.currentTime.getHours()).padStart(2,'0')}`
    this.temparatureData.temperature=this.WeatherDetails['v3-wx-observations-current']?.temperature;
    this.temparatureData.location=`${this.locationData?.location?.city[0]},${this.locationData?.location?.country[0]}`
    this.temparatureData.rainPercentage=this.WeatherDetails['v3-wx-observations-current']?.precip24Hour;
    this.temparatureData.temperaturePhrase=this.WeatherDetails['v3-wx-observations-current']?.cloudCoverPhrase;
    this.temparatureData.summaryImage=this.getImage(this.WeatherDetails['v3-wx-observations-current']?.cloudCoverPhrase);
  }

  getImage(summary:String){
    var baseAddress = 'assets/'
    let cloudySunny='cloudy.png';
    let rainySunny='rainy-and-sunny.png';
    let windy='wind.png';
    let sunny='sun.png';
    let rainy='raining.png';
    if(String(summary).includes("Partly Cloudy") || String(summary).includes("P Cloudy")) return baseAddress + cloudySunny;
    else if(String(summary).includes("Partly Rainy") || String(summary).includes("P Rainy")) return baseAddress + rainySunny;
    else if(String(summary).includes("wind")) return baseAddress + windy;
    else if(String(summary).includes("rain")) return baseAddress + rainy;
    else if(String(summary).includes("Sun")) return baseAddress + sunny;

    return baseAddress + cloudySunny;
  }

  fillWeekSection(){
    for(let i=0;i<4;i++){
      this.weekData.push(new WeekData());
      let resEachDay=i;
      this.weekData[i].day=this.WeatherDetails['v3-wx-forecast-daily-15day']?.dayOfWeek[resEachDay].slice(0,3);
      this.weekData[i].tempMax = this.WeatherDetails['v3-wx-forecast-daily-15day']?.calendarDayTemperatureMax[resEachDay];
      this.weekData[i].tempMin = this.WeatherDetails['v3-wx-forecast-daily-15day']?.calendarDayTemperatureMin[resEachDay];
      this.weekData[i].summaryImage = this.getImage(this.WeatherDetails['v3-wx-forecast-daily-15day']?.narrative[resEachDay]);
    }
    for(let i=0;i<3;i++){
      this.weekData.push(new WeekData());
      let remainingIndex=i+4;
      this.weekData[remainingIndex].day=this.weekData[i].day;
      this.weekData[remainingIndex].tempMax = this.weekData[i].tempMax ;
      this.weekData[remainingIndex].tempMin = this.weekData[i].tempMin ;
      this.weekData[remainingIndex].summaryImage = this.weekData[i].summaryImage;
    }
  }

  fillTodaySection(){
    // let resEachDay=0;
    for(let i=0;i <  4; i++){
      let resEachDay=i;
      this.todayData.push(new TodayData());
      this.todayData[resEachDay].time = this.WeatherDetails['v3-wx-forecast-hourly-10day']?.validTimeLocal[i].slice(11,16);
      this.todayData[resEachDay].temparature = this.WeatherDetails['v3-wx-forecast-hourly-10day']?.temperature[i];
      this.todayData[resEachDay].summaryImage = this.getImage(this.WeatherDetails['v3-wx-forecast-hourly-10day']?.wxPhraseShort[i]);
    }
    for(let i=0;i<3;i++){
      let remainingIndex=i+4;
      this.todayData.push(new TodayData());
      this.todayData[remainingIndex].time= this.todayData[i].time;
      this.todayData[remainingIndex].temparature =this.todayData[i].temparature;
      this.todayData[remainingIndex].summaryImage=this.todayData[i].summaryImage;
    }
  }

  fillHighlightSection(){
    this.todaysHighlight.airQuality=this.WeatherDetails['v3-wx-globalAirQuality']?.globalairquality?.airQualityIndex;
    this.todaysHighlight.humidity=this.WeatherDetails['v3-wx-observations-current']?.relativeHumidity;
    this.todaysHighlight.sunrise= this.getExtractedTime(this.WeatherDetails['v3-wx-observations-current']?.sunriseTimeLocal);
    this.todaysHighlight.sunset= this.getExtractedTime(this.WeatherDetails['v3-wx-observations-current']?.sunsetTimeLocal);
    this.todaysHighlight.uvIndex=this.WeatherDetails['v3-wx-observations-current']?.uvIndex;
    this.todaysHighlight.windStatus=this.WeatherDetails['v3-wx-observations-current']?.windSpeed;
    this.todaysHighlight.visibility=this.WeatherDetails['v3-wx-observations-current']?.visibility;
  }
  getExtractedTime(time:string){
    return time.slice(11,16);
  }
}
