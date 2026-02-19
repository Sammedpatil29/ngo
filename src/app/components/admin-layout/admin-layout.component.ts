import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from "@angular/router";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
