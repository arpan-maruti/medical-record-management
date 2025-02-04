import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';

declare global {
  interface Window {
    swagger: any;
  }
}
import { isPlatformBrowser } from '@angular/common';


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
    // Run Swagger UI only in the browser
    if (isPlatformBrowser(this.platformId)) {
      const temp1 = this.el;

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          import('swagger-ui').then(SwaggerUI => {
            window.swagger = SwaggerUI.default;
            window.swagger({
              domNode: temp1.nativeElement.querySelector('#swagger-container'),
              url: 'assets/openapi.json',
            });
          });
        }, 1000);
      }
    }
  }
}
