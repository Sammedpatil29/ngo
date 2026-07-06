import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
        redirectTo: 'membership-donation',
        pathMatch: 'full'
    },
    {
        path: 'membership-donation',
        loadComponent: () => import('./components/donation/donation.component').then(m => m.DonationComponent)
    },
    {
        path: 'volunteers',
        loadComponent: () => import('./components/valunteers/valunteers.component').then(m => m.ValunteersComponent)
    },
    {
        path: 'services',
        loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent)
    },
    {
        path: 'gallery',
        loadComponent: () => import('./components/gallery/gallery.component').then(m => m.GalleryComponent)
    },
    {
        path: 'donor-form',
        loadComponent: () => import('./components/donor-form/donor-form.component').then(m => m.DonorFormComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'admin-layout',
        loadComponent: () => import('./components/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        children: [
            { path: '', redirectTo: 'admin-banners', pathMatch: 'full' },
            
            {
                path: 'admin-banners',
                loadComponent: () => import('./components/admin-banners/admin-banners.component').then(m => m.AdminBannersComponent)
            },
            {
                path: 'admin-services',
                loadComponent: () => import('./components/admin-services/admin-services.component').then(m => m.AdminServicesComponent)
            },
            {
                path: 'admin-members',
                loadComponent: () => import('./components/admin-members/admin-members.component').then(m => m.AdminMembersComponent)
            },
            {
                path: 'admin-media',
                loadComponent: () => import('./components/admin-news/admin-news.component').then(m => m.AdminNewsComponent)
            },
            {
                path: 'admin-volunteers',
                loadComponent: () => import('./components/admin-volunteers/admin-volunteers.component').then(m => m.AdminVolunteersComponent)
            },
            {
                path: 'admin-images',
                loadComponent: () => import('./components/admin-images/admin-images.component').then(m => m.AdminImagesComponent)
            },
            {
                path: 'admin-donors',
                loadComponent: () => import('./components/admin-donors/admin-donors.component').then(m => m.AdminDonorsComponent)
            },
            {
                path: 'admin-donations',
                loadComponent: () => import('./components/admin-donations/admin-donations.component').then(m => m.AdminDonationsComponent)
            },
            {
                path: 'admin-review',
                loadComponent: () => import('./components/admin-review/admin-review.component').then(m => m.AdminReviewComponent)
            }
        ],
        canActivate: [authGuard]
    }
];
