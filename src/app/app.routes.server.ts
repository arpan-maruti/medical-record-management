import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'case-management/main-case-view/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ id: '1' }]
  },
  {
    path: 'case-management/upload-sub-case/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ id: '1' }]
  },
  {
    path: 'case-management/sub-case-view/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ id: '1' }]
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];