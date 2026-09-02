import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { LucideAngularModule, Search, Plus, Upload, Download, Filter, X, Pencil, Trash2, Power, Package, BookOpen, ShoppingCart, Tag, Warehouse, Truck, ClipboardList, CalendarDays, BarChart3, Users, LayoutDashboard, Calculator, LogOut, Menu, ChevronLeft, ChevronRight, AlertTriangle, Check, Info, Sparkles, Eye, EyeOff, Mail, Lock, ArrowLeft, ArrowRight, Settings } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true
    }),
    importProvidersFrom(
      LucideAngularModule.pick({
        Search, Plus, Upload, Download, Filter, X, Pencil, Trash2, Power, Package,
        BookOpen, ShoppingCart, Tag, Warehouse, Truck, ClipboardList, CalendarDays,
        BarChart3, Users, LayoutDashboard, Calculator, LogOut, Menu, ChevronLeft,
        ChevronRight, AlertTriangle, Check, Info, Sparkles, Eye, EyeOff, Mail, Lock,
        ArrowLeft, ArrowRight, Settings
      })
    )
  ]
};