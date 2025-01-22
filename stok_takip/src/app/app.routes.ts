// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UrunlerComponent } from './urunler/urunler.component';
import { SalesListComponent } from './sales/sales-list/sales-list.component';
import { SalesDetailComponent } from './sales/sales-detail/sales-detail.component';
import { SalesCreateComponent } from './sales/sales-create/sales-create.component';
import { SalesUpdateComponent } from './sales/sales-update/sales-update.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'urunler', component: UrunlerComponent },
  { path: 'satislar', component: SalesListComponent },
  { path: 'satis/yeni', component: SalesCreateComponent },
  { path: 'satis/detay/:id', component: SalesDetailComponent },
  { path: 'satis/duzenle/:id', component: SalesUpdateComponent },
  { path: 'sales', component: SalesListComponent },
  { path: 'sales/detail/:id', component: SalesDetailComponent },
  { path: 'sales/edit/:id', component: SalesUpdateComponent },
];