import { Component } from '@angular/core';
import { faThumbsUp,faThumbsDown ,faFaceSmile,faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css']
})
export class RightPanelComponent {
  faThumbsUp=faThumbsUp; 
  faThumbsDown=faThumbsDown;
  faFaceSmile=faFaceSmile;
  faFaceFrown=faFaceFrown;
 constructor(public wetherService:WeatherService){}

onTodayClick(){
  this.wetherService.isToday=true;
  this.wetherService.isWeek=false;
}
onWeekClick(){
  this.wetherService.isToday=false;
  this.wetherService.isWeek=true;
}
onCelciusClick(){
  this.wetherService.isCelsius=true;
  this.wetherService.isFarenheit=false;
}
onFarenClick(){
  this.wetherService.isFarenheit=true;
  this.wetherService.isCelsius=false;
}

}
