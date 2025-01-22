import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SalesService, Sale } from '../../services/sales.service';

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.scss']
})
export class SalesDetailComponent implements OnInit {
  satis: Sale | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private salesService: SalesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSaleDetails(Number(id));
    } else {
      this.error = true;
      this.loading = false;
      this.showError('Satış ID bulunamadı');
    }
  }

  private loadSaleDetails(id: number): void {
    this.loading = true;
    this.error = false;
    
    this.salesService.getSaleById(id).subscribe({
      next: (data) => {
        this.satis = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Satış detayları yüklenirken hata oluştu:', error);
        this.error = true;
        this.loading = false;
        this.showError('Satış detayları yüklenirken bir hata oluştu');
      }
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Kapat', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
} 