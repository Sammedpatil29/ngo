import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-gallery',
  imports: [FooterComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {

  images:any[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
