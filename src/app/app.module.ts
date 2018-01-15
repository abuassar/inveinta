import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProvidersModule } from '../providers/providers.module';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { AddItemModal } from '../pages/app-collections-detail/additem.modal';
import { ModifyCollectionPopover } from '../pages/app-collections-detail/modifycollection.popover';
import { ModifyItemPopover } from '../pages/app-collections-detail/modifyitem.popover';

@NgModule({
  declarations: [
    MyApp,
    HomePage,

    AddItemModal,
    ModifyCollectionPopover,
    ModifyItemPopover
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ProvidersModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,

    AddItemModal,
    ModifyCollectionPopover,
    ModifyItemPopover
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider
  ]
})
export class AppModule {}
