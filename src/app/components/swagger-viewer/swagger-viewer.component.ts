import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import SwaggerUI from 'swagger-ui';
import "swagger-ui-dist/swagger-ui.css";

@Component({
  selector: 'app-swagger-viewer',
  templateUrl: './swagger-viewer.component.html',
  styleUrls: ['./swagger-viewer.component.css'],
  encapsulation: ViewEncapsulation.None // Disable view encapsulation
})
export class SwaggerViewerComponent implements AfterViewInit {
  
  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object // Detects the platform (browser/server)
  ) {}

  ngAfterViewInit(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      SwaggerUI({
        domNode: this.el.nativeElement.querySelector('#swagger-container'),
        url: 'assets/openapi.json',
      });
    }
  }
}
