
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SalesService } from '../services/sales.service';
import { ProductService } from '../services/product.service';
import { YearSalesComponent } from './year-sales/year-sales.component';
import { MonthSalesComponent } from './month-sales/month-sales.component';
import { WeekSalesComponent } from './week-sales/week-sales.component';
import { DailySalesComponent } from './daily-sales/daily-sales.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-sales',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}
openyearsales() : void {
  this.dialog.open(YearSalesComponent, {
    width: '800px',
   height: '600px'
 });}
openmonthsales(): void {
  this.dialog.open(MonthSalesComponent, {
    width: '800px',
   height: '600px'
 });}
openweeksales(): void {
  this.dialog.open(WeekSalesComponent, {
    width: '800px',
   height: '600px'
 });}
opendailysales(): void  {
  this.dialog.open(DailySalesComponent, {
    width: '800px',
   height: '600px'
 });}
 


}