import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { LeafletDirective } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
/* const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/leaflet/marker-icon.png';
const shadowUrl = 'assets/leaflet/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
}); */

@Component({
  selector: 'app-travel-book',
  imports: [
    NzSplitterModule,
    NzFlexModule,
    CommonModule,
    NzButtonModule,
    NzTypographyModule,
    NzTableModule,
    NzIconModule,
    NzInputModule,
    NzDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzSpaceModule,
    NzAlertModule,
    NzDividerModule,
    NzFloatButtonModule,
    NzPopconfirmModule,
    LeafletDirective,
  ],
  templateUrl: './travel-book.component.html',
  styleUrl: './travel-book.component.css',
})
export class TravelBookComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  markers: L.Marker[] = [];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    this.centerMap();
  }

  private initMap() {
    const baseMapURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    // Centro sulla media Europa (latitudine e longitudine approssimativa)
    const europeCenter: L.LatLngExpression = [50.0, 10.0];

    // Zoom iniziale adeguato per vedere gran parte dell'Europa
    const initialZoom = 4;

    this.map = L.map('map').setView(europeCenter, initialZoom);

    L.tileLayer(baseMapURL, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Esempio marker
    const marker = L.marker([51.5, -0.09]).addTo(this.map);
  }

  private centerMap() {
    // Create a boundary based on the markers
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));

    // Fit the map into the boundary
    this.map.fitBounds(bounds);
  }
}
