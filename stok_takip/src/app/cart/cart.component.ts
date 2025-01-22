import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../services/sales.service';
import { SatisOlustur, SatisDetay } from '../models/satis.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface CartItem {
  urunId: number;
  urunAdi: string;
  miktar: number;
  birimFiyat: number;
  toplamFiyat: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  template: `
    <div class="cart-container">
      <div class="cart-header">
        <mat-icon>shopping_cart</mat-icon>
        <h3>Sepetim</h3>
      </div>

      @if (cartItems.length === 0) {
        <div class="empty-cart">
          <mat-icon>remove_shopping_cart</mat-icon>
          <p>Sepetiniz boş</p>
        </div>
      }

      <div class="cart-items">
        @for (item of cartItems; track item.urunId) {
          <div class="cart-item">
            <div class="item-details">
              <span class="item-name">{{item.urunAdi}}</span>
              <span class="item-price">₺{{item.birimFiyat | number:'1.2-2'}}</span>
            </div>
            <div class="quantity-controls">
              <button mat-icon-button color="primary" (click)="decreaseQuantity(item)">
                <mat-icon>remove</mat-icon>
              </button>
              <span class="quantity">{{item.miktar}}</span>
              <button mat-icon-button color="primary" (click)="increaseQuantity(item)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            <div class="item-actions">
              <span class="item-total">₺{{item.toplamFiyat | number:'1.2-2'}}</span>
              <button mat-icon-button color="warn" (click)="removeItem(item)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        }
      </div>

      @if (cartItems.length > 0) {
        <div class="cart-summary">
          <div class="summary-row total">
            <span>Toplam Tutar</span>
            <span class="total-amount">₺{{getTotal() | number:'1.2-2'}}</span>
          </div>
        </div>

        <div class="customer-info">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Müşteri Adı</mat-label>
            <input matInput [(ngModel)]="customerName" placeholder="Müşteri adını giriniz">
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>
        </div>

        <button 
          mat-raised-button 
          color="primary"
          class="make-sale-btn" 
          [disabled]="!canMakeSale()" 
          (click)="makeSale()">
          <mat-icon>point_of_sale</mat-icon>
          Satış Yap
        </button>
      }
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 20px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      margin: 0 auto;
    }

    .cart-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }

    .cart-header h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }

    .cart-header mat-icon {
      color: #1976d2;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .empty-cart {
      text-align: center;
      padding: 40px 0;
      color: #666;
    }

    .empty-cart mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #999;
    }

    .cart-items {
      margin: 15px 0;
      max-height: 400px;
      overflow-y: auto;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin-bottom: 10px;
      background-color: #f8f9fa;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .cart-item:hover {
      background-color: #f0f0f0;
      transform: translateX(5px);
    }

    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .item-name {
      font-weight: 500;
      color: #333;
    }

    .item-price {
      color: #666;
      font-size: 0.9em;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .quantity {
      min-width: 40px;
      text-align: center;
      font-weight: 500;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .item-total {
      font-weight: 500;
      color: #1976d2;
      min-width: 80px;
      text-align: right;
    }

    .cart-summary {
      margin-top: 20px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.1em;
      font-weight: 500;
    }

    .total-amount {
      color: #1976d2;
      font-size: 1.2em;
      font-weight: 600;
    }

    .customer-info {
      margin: 20px 0;
    }

    .full-width {
      width: 100%;
    }

    .make-sale-btn {
      width: 100%;
      padding: 12px;
      font-size: 1.1em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .make-sale-btn mat-icon {
      margin-right: 8px;
    }

    /* Scrollbar Styling */
    .cart-items::-webkit-scrollbar {
      width: 6px;
    }

    .cart-items::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .cart-items::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    .cart-items::-webkit-scrollbar-thumb:hover {
      background: #666;
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  customerName: string = '';

  constructor(
    private salesService: SalesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  addToCart(urunId: number, urunAdi: string, birimFiyat: number) {
    const existingItem = this.cartItems.find(item => item.urunId === urunId);
    
    if (existingItem) {
      existingItem.miktar++;
      existingItem.toplamFiyat = existingItem.miktar * existingItem.birimFiyat;
    } else {
      this.cartItems.push({
        urunId,
        urunAdi,
        birimFiyat,
        miktar: 1,
        toplamFiyat: birimFiyat
      });
    }
    
    this.saveCartToStorage();
  }

  increaseQuantity(item: CartItem) {
    item.miktar++;
    item.toplamFiyat = item.miktar * item.birimFiyat;
    this.saveCartToStorage();
  }

  decreaseQuantity(item: CartItem) {
    if (item.miktar > 1) {
      item.miktar--;
      item.toplamFiyat = item.miktar * item.birimFiyat;
      this.saveCartToStorage();
    }
  }

  removeItem(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.saveCartToStorage();
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.toplamFiyat, 0);
  }

  canMakeSale(): boolean {
    return this.cartItems.length > 0 && this.customerName.trim().length > 0;
  }

  makeSale() {
    if (!this.canMakeSale()) return;

    const satis: SatisOlustur = {
      musteri: this.customerName,
      detaylar: this.cartItems.map(item => ({
        urunId: item.urunId,
        miktar: item.miktar,
        birimFiyat: item.birimFiyat
      }))
    };

    this.salesService.createSale(satis).subscribe({
      next: () => {
        this.snackBar.open('Satış başarıyla tamamlandı', 'Tamam', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.cartItems = [];
        this.customerName = '';
        this.saveCartToStorage();
      },
      error: (error) => {
        console.error('Satış oluşturulurken hata:', error);
        this.snackBar.open('Satış oluşturulurken bir hata oluştu', 'Tamam', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }
} 