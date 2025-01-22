import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SatisOlustur, SatisResponse, SatisGuncelle, SatisOzeti } from '../models/satis.model';

export interface Sale {
  satisId: number;
  satisTarihi: string;
  musteri: string;
  toplamTutar: number;
  satisDetaylari: SaleDetail[];
}

export interface SaleDetail {
  satisDetayId: number;
  satisId: number;
  urunId: number;
  miktar: number;
  birimFiyat: number;
  toplamFiyat: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'https://localhost:7294/api/Satislar';

  constructor(private http: HttpClient) { }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  getSaleById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  createSale(satis: SatisOlustur): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, satis);
  }

  updateSale(id: number, satis: SatisOlustur): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, satis);
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSalesByCustomer(musteri: string): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/musteri/${musteri}`);
  }

  getSalesByDateRange(baslangic: Date, bitis: Date): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/tarih-araligi`, {
      params: {
        baslangic: baslangic.toISOString(),
        bitis: bitis.toISOString()
      }
    });
  }

  getSalesSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ozet`);
  }
}