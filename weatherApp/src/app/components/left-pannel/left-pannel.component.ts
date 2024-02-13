import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass,faLocation,faCloud,faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { TemparatureData } from 'src/app/models/temparatureData';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-left-pannel',
  templateUrl: './left-pannel.component.html',
  styleUrls: ['./left-pannel.component.css']
})
export class LeftPannelComponent implements OnInit {
  faMagnifyingGlass:any=faMagnifyingGlass;
  faLocation:any=faLocation;
  faCloud=faCloud;
  faCloudRain=faCloudRain;
  // temparatureData:TemparatureData;
  constructor(public wetherService:WeatherService){}
  ngOnInit(): void {
    // this.temparatureData=this.wetherService?.temparatureData;
  }
  onSearch(location:string){
    this.wetherService.cityName=location;
    this.wetherService.getData();
  }

}
