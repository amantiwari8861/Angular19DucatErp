import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';
import { Landingpage } from './pages/landingpage/landingpage';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
    {
        path: '',
        component: Landingpage
    },
    {
        path: "home",
        redirectTo: "/",
        pathMatch: "full"
    },
    {
        path: "about",
        component: About
    },
    {
        path: "contact",
        component: Contact
    },
    {
        path: "**",
        component: NotFound
    }
];
