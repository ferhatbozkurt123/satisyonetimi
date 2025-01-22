import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SalesService, Sale } from '../services/sales.service';

@Component({
  selector: 'app-satislar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="sales-container">
      <div class="summary-cards">
        <mat-card class="summary-card" (click)="filterByPeriod('daily')">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>today</mat-icon>
              Günlük Satışlar
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2 class="amount">₺{{dailyTotal | number:'1.2-2'}}</h2>
            <p class="count">{{dailySales}} Satış</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card" (click)="filterByPeriod('weekly')">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>date_range</mat-icon>
              Haftalık Satışlar
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2 class="amount">₺{{weeklyTotal | number:'1.2-2'}}</h2>
            <p class="count">{{weeklySales}} Satış</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card" (click)="filterByPeriod('monthly')">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>calendar_month</mat-icon>
              Aylık Satışlar
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2 class="amount">₺{{monthlyTotal | number:'1.2-2'}}</h2>
            <p class="count">{{monthlySales}} Satış</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card" (click)="filterByPeriod('yearly')">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>calendar_today</mat-icon>
              Yıllık Satışlar
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2 class="amount">₺{{yearlyTotal | number:'1.2-2'}}</h2>
            <p class="count">{{yearlySales}} Satış</p>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="sales-table-card">
        <mat-card-header>
          <mat-card-title>Satış Geçmişi</mat-card-title>
          <div class="period-filters">
            <mat-chip-listbox [(ngModel)]="selectedPeriod" (selectionChange)="onPeriodChange($event)">
              <mat-chip-option value="all">Tümü</mat-chip-option>
              <mat-chip-option value="daily">Günlük</mat-chip-option>
              <mat-chip-option value="weekly">Haftalık</mat-chip-option>
              <mat-chip-option value="monthly">Aylık</mat-chip-option>
              <mat-chip-option value="yearly">Yıllık</mat-chip-option>
            </mat-chip-listbox>
          </div>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="filteredSales" class="sales-table">
            <ng-container matColumnDef="satisID">
              <th mat-header-cell *matHeaderCellDef>Satış No</th>
              <td mat-cell *matCellDef="let sale">{{sale.satisID}}</td>
            </ng-container>

            <ng-container matColumnDef="satisTarihi">
              <th mat-header-cell *matHeaderCellDef>Tarih</th>
              <td mat-cell *matCellDef="let sale">{{sale.satisTarihi | date:'dd/MM/yyyy HH:mm'}}</td>
            </ng-container>

            <ng-container matColumnDef="musteri">
              <th mat-header-cell *matHeaderCellDef>Müşteri</th>
              <td mat-cell *matCellDef="let sale">{{sale.musteri}}</td>
            </ng-container>

            <ng-container matColumnDef="toplamTutar">
              <th mat-header-cell *matHeaderCellDef>Tutar</th>
              <td mat-cell *matCellDef="let sale">₺{{sale.toplamTutar | number:'1.2-2'}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>İşlemler</th>
              <td mat-cell *matCellDef="let sale">
                <button mat-icon-button color="primary" (click)="viewSaleDetails(sale)" matTooltip="Detayları Görüntüle">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="editSale(sale)" matTooltip="Düzenle">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteSale(sale.satisID)" matTooltip="Sil">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .sales-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .summary-card {
      padding: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }

    .summary-card mat-card-header {
      margin-bottom: 15px;
    }

    .summary-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.2em;
      color: #333;
    }

    .summary-card mat-icon {
      color: #1976d2;
    }

    .amount {
      font-size: 2em;
      font-weight: 600;
      color: #1976d2;
      margin: 10px 0;
    }

    .count {
      color: #666;
      font-size: 1.1em;
    }

    .sales-table-card {
      margin-top: 20px;
    }

    .sales-table-card mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .period-filters {
      margin: 15px 0;
    }

    .sales-table {
      width: 100%;
    }

    .mat-column-actions {
      width: 150px;
      text-align: center;
    }

    .mat-column-satisID {
      width: 100px;
    }

    .mat-column-satisTarihi {
      width: 180px;
    }

    .mat-column-toplamTutar {
      width: 120px;
      text-align: right;
    }

    tr.mat-row:hover {
      background-color: #f5f5f5;
    }

    .mat-cell {
      padding: 10px;
    }
  `]
})
export class SatislarComponent implements OnInit {
  displayedColumns: string[] = ['satisID', 'satisTarihi', 'musteri', 'toplamTutar', 'actions'];
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  selectedPeriod: string = 'all';

  // Summary metrics
  dailyTotal: number = 0;
  weeklyTotal: number = 0;
  monthlyTotal: number = 0;
  yearlyTotal: number = 0;
  dailySales: number = 0;
  weeklySales: number = 0;
  monthlySales: number = 0;
  yearlySales: number = 0;

  constructor(
    private salesService: SalesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.salesService.getSales().subscribe({
      next: (data: Sale[]) => {
        this.sales = data;
        this.filteredSales = data;
        this.calculateSummaries();
      },
      error: (error: Error) => {
        console.error('Satışlar yüklenirken hata:', error);
        this.showError('Satışlar yüklenirken bir hata oluştu');
      }
    });
  }

  calculateSummaries() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    this.resetSummaries();

    this.sales.forEach(sale => {
      const saleDate = new Date(sale.satisTarihi);
      
      if (saleDate >= today) {
        this.dailyTotal += sale.toplamTutar;
        this.dailySales++;
      }
      
      if (saleDate >= weekStart) {
        this.weeklyTotal += sale.toplamTutar;
        this.weeklySales++;
      }
      
      if (saleDate >= monthStart) {
        this.monthlyTotal += sale.toplamTutar;
        this.monthlySales++;
      }

      if (saleDate >= yearStart) {
        this.yearlyTotal += sale.toplamTutar;
        this.yearlySales++;
      }
    });
  }

  resetSummaries() {
    this.dailyTotal = 0;
    this.weeklyTotal = 0;
    this.monthlyTotal = 0;
    this.yearlyTotal = 0;
    this.dailySales = 0;
    this.weeklySales = 0;
    this.monthlySales = 0;
    this.yearlySales = 0;
  }

  filterByPeriod(period: string) {
    this.selectedPeriod = period;
    this.onPeriodChange({ value: period });
  }

  onPeriodChange(event: any) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    switch (this.selectedPeriod) {
      case 'daily':
        this.filteredSales = this.sales.filter(sale => 
          new Date(sale.satisTarihi) >= today
        );
        break;
      case 'weekly':
        this.filteredSales = this.sales.filter(sale => 
          new Date(sale.satisTarihi) >= weekStart
        );
        break;
      case 'monthly':
        this.filteredSales = this.sales.filter(sale => 
          new Date(sale.satisTarihi) >= monthStart
        );
        break;
      case 'yearly':
        this.filteredSales = this.sales.filter(sale => 
          new Date(sale.satisTarihi) >= yearStart
        );
        break;
      default:
        this.filteredSales = this.sales;
    }
  }

  viewSaleDetails(sale: Sale) {
    // TODO: Implement sale details dialog
    console.log('Sale details:', sale);
  }

  editSale(sale: Sale) {
    // TODO: Implement sale edit dialog
    console.log('Edit sale:', sale);
  }

  deleteSale(id: number) {
    if (confirm('Bu satışı silmek istediğinizden emin misiniz?')) {
      this.salesService.deleteSale(id).subscribe({
        next: () => {
          this.sales = this.sales.filter(s => s.satisId !== id);
          this.filteredSales = this.filteredSales.filter(s => s.satisId !== id);
          this.calculateSummaries();
          this.showSuccess('Satış başarıyla silindi');
        },
        error: (error: Error) => {
          console.error('Satış silinirken hata:', error);
          this.showError('Satış silinirken bir hata oluştu');
        }
      });
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Tamam', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Tamam', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
} 