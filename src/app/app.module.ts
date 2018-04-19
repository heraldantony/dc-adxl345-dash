import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { ElectronService } from './providers/electron.service';
import { SocketService } from './providers/socket.service';


import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AccelerationComponent } from './components/acceleration/acceleration.component';
import { FftComponent } from './components/fft/fft.component';
import { LineChartComponent } from './shared/line-chart/line-chart.component';
import { MultiLineChartComponent } from './shared/multi-line-chart/multi-line-chart.component';
import { AccelerationChartComponent } from './shared/acceleration-chart/acceleration-chart.component';
import { FftChartComponent } from './shared/fft-chart/fft-chart.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccelerationComponent,
    FftComponent,
    WebviewDirective,
    LineChartComponent,
    MultiLineChartComponent,
    AccelerationChartComponent,
    FftChartComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [ElectronService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
