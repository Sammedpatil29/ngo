import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from "@angular/router";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
constructor(private router: Router){}

logOut(){
  sessionStorage.removeItem('adminToken');
  this.router.navigate(['/login']);
}

}
