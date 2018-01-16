import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, ViewController } from 'ionic-angular';
import { Item, ItemCollection } from '../../models/Collection';
import { Attr } from '../../models/CollectionTypes';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Actions</ion-list-header>
      <button ion-item (click)="edit()">Edit</button>
      <button ion-item color="danger" (click)="removeItem()">Remove</button>
    </ion-list>
  `
})
export class ModifyItemPopover implements OnInit {

  private item: Item;
  public collection: ItemCollection;
  public columns: Attr[] = [];

  private addItemCallback: Function;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private firebase: FirebaseProvider
  ) {}

  ngOnInit() {
    this.collection = this.navParams.get('collection');
    this.columns = this.navParams.get('columns');
    this.item = this.navParams.get('item');
    this.addItemCallback = this.navParams.get('addItemCallback');
  }

  edit() {
    this.dismiss();
    this.addItemCallback();
  }

  removeItem() {
    this.dismiss();
    this.alertCtrl.create({
      title: 'Remove Item',
      subTitle: 'Are you sure you want to remove this item? This action is irreversible.',
      buttons: [
        'No, keep it',
        {
          text: 'Yes, remove it',
          handler: () => {
            this.firebase.removeCollectionItem(this.item);
          }
        }
      ]
    }).present();
  }

  dismiss(data?) {
    this.viewCtrl.dismiss(data);
  }
}
