import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IonicPage, ModalController, NavController, NavParams,
  PopoverController
} from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Subscription } from 'rxjs/Subscription';
import { Item, ItemCollection } from '../../models/Collection';
import { AddItemModal } from './additem.modal';
import { CollectionTypes } from '../../models/CollectionTypes';

import * as _ from 'lodash';
import { ModifyCollectionPopover } from './modifycollection.popover';
import { ModifyItemPopover } from './modifyitem.popover';

@IonicPage({
  name: 'CollectionsDetail',
  segment: 'collections/:uuid',
  defaultHistory: ['Collections']
})
@Component({
  selector: 'page-app-collections-detail',
  templateUrl: 'app-collections-detail.html',
})
export class AppCollectionsDetailPage implements OnInit, OnDestroy {

  private uuid: string;
  public columns = [];

  private coll$: Subscription;
  private items$: Subscription;
  public allItems: Item[] = [];

  public forceEditTypes: boolean;
  public selectedTypes: any = {};
  public typeSearchQuery = '';

  public get ngxDataTableIcons() {
    return {
      sortAscending: 'ion-md-arrow-dropup',
      sortDescending: 'ion-md-arrow-dropdown',
      pagerPrevious: 'ion-ios-arrow-dropleft-circle',
      pagerNext: 'ion-ios-arrow-dropright-circle',
      pagerLeftArrow: 'ion-ios-arrow-back',
      pagerRightArrow: 'ion-ios-arrow-forward'
    };
  }

  public get types() {
    return CollectionTypes;
  }

  public get hasSelectedTypes(): boolean {
    return Object.keys(this.selectedTypes).length > 0;
  }

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    public firebase: FirebaseProvider
  ) {}

  async ngOnInit() {
    this.uuid = this.navParams.get('uuid');
    await this.firebase.loadCollectionItems(this.uuid);

    this.coll$ = this.firebase.currentCollection.subscribe(coll => {
      if(!coll) return;
      this.updateCollectionTypeColumns(coll);
    });

    this.items$ = this.firebase.currentCollectionItems.subscribe(data => {
      this.allItems = data;
    });
  }

  ngOnDestroy() {
    this.coll$.unsubscribe();
    this.items$.unsubscribe();
  }

  private updateCollectionTypeColumns(coll: ItemCollection) {
    this.columns = [];

    this.columns.push({ name: 'Name', prop: 'name', type: 'string' });

    Object.keys(coll.types).forEach(type => {
      const collTypeRef = _.find(CollectionTypes, { id: type });
      if(!collTypeRef) return;
      this.columns.push(...collTypeRef.props);
    });

    this.columns = _.uniqBy(this.columns, 'prop');
  }

  public selectType(id: string): void {
    this.selectedTypes[id] = !this.selectedTypes[id];
    if(!this.selectedTypes[id]) delete this.selectedTypes[id];
  }

  addTypesToCollection(coll: ItemCollection) {
    this.forceEditTypes = false;

    coll.types = {};
    Object.keys(this.selectedTypes).forEach(key => {
      if(!this.selectedTypes[key]) return;
      coll.types[key] = true;
    });

    this.firebase.updateCollection(coll);
  }

  hasTypes(coll: ItemCollection): boolean {
    if(!coll || !coll.types) return false;
    return Object.keys(coll.types).length > 0;
  }

  addNewItem(collection: ItemCollection, item?: Item) {

    const modal = this.modalCtrl.create(AddItemModal, {
      collection,
      item,
      columns: this.columns
    });

    modal.onDidDismiss((data) => {
      if(!data) return;
      const { item, mode } = data;
      if(!item) return;
      item.collectionUUID = this.uuid;

      if(mode === 'add') {
        this.firebase.addCollectionItem(item);
      } else if(mode === 'edit') {
        this.firebase.updateCollectionItem(item);
      }
    });

    modal.present();
  }

  editCollMenu($event, collection: ItemCollection) {
    const popover = this.popoverCtrl.create(ModifyCollectionPopover,{
      collection,
      columns: this.columns
    });

    popover.onDidDismiss(data => {
      if(!data) return;

      if(data.editTypes) this.forciblyEditTypes(collection);
      if(data.popNav)    this.navCtrl.pop();
    });

    popover.present({
      ev: $event
    });
  }

  private forciblyEditTypes(collection: ItemCollection) {
    this.forceEditTypes = true;
    this.selectedTypes = _.clone(collection.types);
  }

  public onTableContextMenu({ event, content }, collection: ItemCollection) {
    event.stopPropagation();
    event.preventDefault();

    const popover = this.popoverCtrl.create(ModifyItemPopover,{
      collection,
      item: content,
      columns: this.columns,
      addItemCallback: () => this.addNewItem(collection, content)
    });

    popover.present({
      ev: event
    });
  }

}