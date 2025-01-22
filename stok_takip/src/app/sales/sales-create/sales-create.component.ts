import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { SatisOlustur, SatisDetay } from '../../models/satis.model';

@Component({
  selector: 'app-sales-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h3>Yeni Satış Oluştur</h3>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #salesForm="ngForm">
            <div class="mb-3">
              <label for="musteri" class="form-label">Müşteri Adı</label>
              <input
                type="text"
                class="form-control"
                id="musteri"
                name="musteri"
                [(ngModel)]="satis.musteri"
                required
                #musteri="ngModel"
              >
              @if (musteri.invalid && (musteri.dirty || musteri.touched)) {
                <div class="alert alert-danger">
                  Müşteri adı gereklidir
                </div>
              }
            </div>

            <div class="mb-3">
              <h4>Ürünler</h4>
              @for (detay of satis.detaylar; track $index) {
                <div class="card mb-2">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-3">
                        <label class="form-label">Ürün ID</label>
                        <input
                          type="number"
                          class="form-control"
                          [(ngModel)]="detay.urunId"
                          [name]="'urunId' + $index"
                          required
                        >
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">Miktar</label>
                        <input
                          type="number"
                          class="form-control"
                          [(ngModel)]="detay.miktar"
                          [name]="'miktar' + $index"
                          required
                          min="1"
                        >
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">Birim Fiyat</label>
                        <input
                          type="number"
                          class="form-control"
                          [(ngModel)]="detay.birimFiyat"
                          [name]="'birimFiyat' + $index"
                          required
                          min="0"
                          step="0.01"
                        >
                      </div>
                      <div class="col-md-3 d-flex align-items-end">
                        <button
                          type="button"
                          class="btn btn-danger"
                          (click)="removeProduct($index)"
                        >
                          Ürünü Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }

              <button
                type="button"
                class="btn btn-secondary"
                (click)="addProduct()"
              >
                Ürün Ekle
              </button>
            </div>

            <div class="d-flex justify-content-between">
              <button
                type="button"
                class="btn btn-secondary"
                routerLink="/satislar"
              >
                İptal
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="!salesForm.form.valid || satis.detaylar.length === 0"
              >
                Satışı Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; }
  `]
})
export class SalesCreateComponent {
  satis: SatisOlustur = {
    musteri: '',
    detaylar: []
  };

  constructor(
    private salesService: SalesService,
    private router: Router
  ) {}

  addProduct(): void {
    this.satis.detaylar.push({
      urunId: 0,
      miktar: 1,
      birimFiyat: 0
    });
  }

  removeProduct(index: number): void {
    this.satis.detaylar.splice(index, 1);
  }

  onSubmit(): void {
    if (this.satis.detaylar.length === 0) {
      alert('En az bir ürün eklemelisiniz');
      return;
    }

    this.salesService.createSale(this.satis).subscribe({
      next: (response) => {
        console.log('Satış başarıyla oluşturuldu:', response);
        this.router.navigate(['/satislar']);
      },
      error: (error) => {
        console.error('Satış oluşturulurken hata oluştu:', error);
        // TODO: Hata mesajını kullanıcıya göster
      }
    });
  }
} 