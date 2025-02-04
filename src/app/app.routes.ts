import { Routes } from '@angular/router';
import { AvrechComponent } from './avrech/avrech.component';
import { LoginComponent } from './login/login.component';
import { ActionSquaresComponent } from './action-squares/action-squares.component';
import { AddDataComponent } from './add-data/add-data.component';
import { NavbarComponent } from './navbar/navbar.component'
import { MonthlyDataComponent } from './monthly-data/monthly-data.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: '', component: NavbarComponent, outlet: 'navbar' },
    { path: 'action', component: ActionSquaresComponent },
    { path: 'avrechim-list', component: AvrechComponent },
    { path: 'add-data', component: AddDataComponent },
    { path: 'monthly', component: MonthlyDataComponent},
    { path: 'settings', component: SettingsComponent}
];


