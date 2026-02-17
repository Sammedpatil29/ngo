import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./components/landing-page/landing-page.component').then(m => m.LandingPageComponent)
    },
    {
        path: 'donation',
        loadComponent: () => import('./components/donation/donation.component').then(m => m.DonationComponent)
    },
    {
        path: 'volunteers',
        loadComponent: () => import('./components/valunteers/valunteers.component').then(m => m.ValunteersComponent)
    },
    {
        path: 'services',
        loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent)
    }
];
