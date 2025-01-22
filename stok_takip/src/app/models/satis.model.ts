// Satış detayı için interface
export interface SatisDetay {
    urunId: number;
    miktar: number;
    birimFiyat: number;
}

// Yeni satış oluşturma için interface
export interface SatisOlustur {
    musteri: string;
    detaylar: SatisDetay[];
}

// Satış detayı response interface'i
export interface SatisDetayResponse {
    satisDetayId: number;
    urunId: number;
    urunAdi: string;
    miktar: number;
    birimFiyat: number;
    toplamFiyat: number;
}

// Satış response interface'i
export interface SatisResponse {
    satisId: number;
    satisTarihi: Date;
    musteri: string;
    toplamTutar: number;
    satisDetaylari: SatisDetayResponse[];
}

// Satış güncelleme için interface
export interface SatisGuncelle {
    satisId: number;
    musteri: string;
    satisDetaylari: SatisDetay[];
}

// Satış özeti için interface
export interface SatisOzeti {
    gunlukToplam: number;
    haftalikToplam: number;
    aylikToplam: number;
    yillikToplam: number;
} 