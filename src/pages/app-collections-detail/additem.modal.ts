import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Item, ItemCollection } from '../../models/Collection';
import { Attr } from '../../models/CollectionTypes';

@Component({
  template: `
    <ion-header>

      <ion-navbar color="primary">
        <ion-buttons start>
          <button color="light" ion-button (click)="dismiss()">Close</button>
        </ion-buttons>
        <ion-title>{{ mode === 'add' ? 'Add New Item' : 'Edit Item' }}</ion-title>
      </ion-navbar>

    </ion-header>


    <ion-content padding>
      <ion-list>
        <ion-item *ngFor="let column of columns">
          
          <ion-label *ngIf="column.type !== 'boolean'" stacked> {{ column.name }}</ion-label>
          <ion-label *ngIf="column.type === 'boolean'">{{ column.name }}</ion-label>
          
          <ion-input *ngIf="column.type === 'string'" 
                     type="text"
                     [placeholder]="column.name" 
                     (keyup.enter)="submit()"
                     [(ngModel)]="item[column.prop]"></ion-input>

          <ion-input *ngIf="column.type === 'number'"
                     type="number" 
                     [placeholder]="column.name"
                     (keyup.enter)="submit()"
                     [(ngModel)]="item[column.prop]"></ion-input>

          <ion-input *ngIf="column.type === 'money'" 
                     type="number" 
                     [placeholder]="column.name"
                     (keyup.enter)="submit()"
                     [(ngModel)]="item[column.prop]"></ion-input>

          <ion-checkbox *ngIf="column.type === 'boolean'" [(ngModel)]="item[column.prop]"></ion-checkbox>
                      
        </ion-item>
      </ion-list>

    </ion-content>
    
    <ion-footer>
      <ion-toolbar>
        <ion-buttons end>
          <button ion-button (click)="dismiss()">Cancel</button>
          <button ion-button (click)="submit(item)" color="primary" outline [disabled]="!canSubmit()">{{ mode === 'add' ? 'Add Item' : 'Edit Item' }}</button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `
})
export class AddItemModal implements OnInit {

  public item: any;
  public collection: ItemCollection;
  public columns: Attr[] = [];

  private mode: 'add'|'edit' = 'add';

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {}

  ngOnInit() {
    this.collection = this.navParams.get('collection');
    this.columns = this.navParams.get('columns');
    this.item = this.navParams.get('item');

    if(this.item) {
      this.mode = 'edit';
    } else {
      this.item = {};
    }
  }

  canSubmit(): boolean {
    return !!this.item.name;
  }

  submit(item?: Item) {
    if(!this.canSubmit()) return;
    this.dismiss({ item, mode: this.mode });
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}