import { Component, OnInit } from "@angular/core";
import { AppConfig } from "app/app.config";
import { SocketService } from "app/providers/socket.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  chartData: Array<any>;
  private dataIntervalTimer: any;
  private dataResponseListener: any;

  constructor(public socketService: SocketService) {}

  ngOnInit() {
    
    this.dataResponseListener = function(data) {
      this.chartData = []
      var xValues=data.map( (d) => {
        return {
          time: d[0],
          acceleration: d[1]
        };
      });
      var yValues=data.map( (d) => {
        return {
          time: d[0],
          acceleration: d[2]
        };
      });
      var zValues=data.map( (d) => {
        return {
          time: d[0],
          acceleration: d[3]
        };
      });
      this.chartData.push({id: 'x', values: xValues});
      this.chartData.push({id: 'y', values: yValues});
      this.chartData.push({id: 'z', values: zValues});

      
    };
    this.socketService.addListener("data-response", this.dataResponseListener.bind(this));

    // give everything a chance to get loaded before starting the animation to reduce choppiness
    setTimeout(() => {
      this.generateData();

      // change the data periodically
      this.dataIntervalTimer = setInterval(() => this.generateData(), 10000);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.dataIntervalTimer) {
      clearInterval(this.dataIntervalTimer);
    }
    this.socketService.removeListener("data-response");
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  generateData() {
    this.socketService.emitEvent("data-request", {
      durationInSeconds: 1,
      rateInHz: 25
    });
  }
}
