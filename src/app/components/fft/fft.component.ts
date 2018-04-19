import { Component, OnInit } from "@angular/core";
import { AppConfig } from "app/app.config";
import { SocketService } from "app/providers/socket.service";

@Component({
  selector: "app-fft",
  templateUrl: "./fft.component.html",
  styleUrls: ["./fft.component.scss"]
})
export class FftComponent implements OnInit {
  chartData: Array<any>;
  private dataIntervalTimer: any;
  private dataResponseListener: any;

  constructor(public socketService: SocketService) {}

  ngOnInit() {
    
    this.dataResponseListener = function(data) {
      this.chartData = []
      var xValues=data.map( (d) => {
        return {
          frequency: d[0],
          fft: d[1]
        };
      });
      var yValues=data.map( (d) => {
        return {
          frequency: d[0],
          fft: d[2]
        };
      });
      var zValues=data.map( (d) => {
        return {
          frequency: d[0],
          fft: d[3]
        };
      });
      this.chartData.push({id: 'x', values: xValues.slice(1)});
      this.chartData.push({id: 'y', values: yValues.slice(1)});
      this.chartData.push({id: 'z', values: zValues.slice(1)});

      
    };
    this.socketService.addListener("fft-response", this.dataResponseListener.bind(this));

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
    this.socketService.removeListener("fft-response");
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  generateData() {
    this.socketService.emitEvent("fft-request", {
      durationInSeconds: 1,
      rateInHz: 25
    });
  }
}
