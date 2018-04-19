import { HomeComponent } from './components/home/home.component';
import { AccelerationComponent } from './components/acceleration/acceleration.component';
import { FftComponent } from './components/fft/fft.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'acceleration',
        component: AccelerationComponent
    },
    {
        path: 'fft',
        component: FftComponent
    },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
