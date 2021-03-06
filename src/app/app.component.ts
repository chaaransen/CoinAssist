import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ProfitCalcPage } from '../pages/profit-calc/profit-calc';
import { ApiDataProvider } from '../providers/api-data/api-data';
import { NewsPage } from '../pages/news/news';
import { QuantityCalcPage } from '../pages/quantity-calc/quantity-calc';
import * as Constants from '../constants/api-constants';
import { FCM } from '@ionic-native/fcm';
import { RateStatus } from '../models/api-urls';
import { NativeTransitionOptions, NativePageTransitions } from '@ionic-native/native-page-transitions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  tab1Root = HomePage;
  tab2Root = QuantityCalcPage;
  tab3Root = ProfitCalcPage;
  tab4Root = NewsPage;
  apiUrls: any;
  pages: Array<{ title: string, component: any }>;
  usesUntilPrompt: number;
  rateFlag: boolean;

  //Tabs animation
  loaded: boolean = false;
  tabIndex: number = 0;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public api: ApiDataProvider, private fcm: FCM, private app: App, private alertCtrl: AlertController, private nativePageTransitions: NativePageTransitions) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }, { title: 'Quantity Calc', component: QuantityCalcPage }, { title: 'Profit Calc', component: ProfitCalcPage }
    ];
  }

  ngOnInit() {
    // console.log("Ng oninit Called - app component");
    this.platform.ready().then(() => {
      this.api.fetchUrl();
      this.api.fetchService(Constants.POINTS).then(points => {
        // console.log("Points App component", points);
        if (points == null) {
          // console.log("Points is undefined ", points);
          this.api.storeService(Constants.POINTS, Constants.DEFAULT_POINT);
        }
      });

      this.api.fetchService(Constants.RATED).then(rateRes => {
        // console.log("Rate Flag ", rateFlag);
        if (rateRes == null) {
          this.rateFlag = false;

          let rateStatus = new RateStatus();
          rateStatus.rated = this.rateFlag;
          rateStatus.notify = this.api.rateNotif;
          this.api.storeService(Constants.RATED, rateStatus);
        } else {
          this.api.rateNotif = rateRes.notify;
          this.rateFlag = rateRes.rated;
        }

      });

      this.api.fetchService(Constants.RATE_USES_UNTIL).then(rateUsesLeft => {
        // console.log("USES UNTIL LEFT", rateUsesLeft);
        if (rateUsesLeft == null) {
          let defaultLeft = Constants.DEFAULT_USES_UNTIL;
          this.usesUntilPrompt = defaultLeft;
          this.api.storeService(Constants.RATE_USES_UNTIL, this.usesUntilPrompt);
          // console.log("UsesUntilLeft Null so default ", this.usesUntilPrompt);

        } else {
          this.usesUntilPrompt = rateUsesLeft;
          // console.log("Fetched Uses Until left ", this.usesUntilPrompt);

        }
      });
    });
  }

  public transition(e): void {
    let options: NativeTransitionOptions = {
      direction: this.getAnimationDirection(e.index),
      duration: 250,
      slowdownfactor: -1,
      slidePixels: 0,
      iosdelay: 20,
      androiddelay: 0,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 48
    };

    if (!this.loaded) {
      this.loaded = true;
      return;
    }

    this.nativePageTransitions.slide(options);
  }

  private getAnimationDirection(index): string {
    var currentIndex = this.tabIndex;

    this.tabIndex = index;

    switch (true) {
      case (currentIndex < index):
        return ('left');
      case (currentIndex > index):
        return ('right');
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // console.log("Platform ready");

      this.api.prepareVideoAd();
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleBlackOpaque();
      this.statusBar.show();
      // this.splashScreen.hide()
      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log(data);

        } else {
          console.log(data);
        };
      });

      this.platform.resume.subscribe(() => {
        if (this.api.rewardNotif) {
          this.api.showToast(Constants.RATE_REWARD_MSG, Constants.TOP, 3000);
          this.api.rewardNotif = false;
          let rateStatus = new RateStatus();
          rateStatus.rated = true;
          rateStatus.notify = this.api.rateNotif;
          this.api.storeService(Constants.RATED, rateStatus);
        }

      });

      this.platform.registerBackButtonAction(() => {
        // console.log("Backbutton pressed ", this.rateFlag);

        if (!this.rateFlag) {
          // console.log("Not yet Rated checking rating dialog display");

          let listNav = this.app.getActiveNavs();
          // console.log("Active navs", activeNav);
          // console.log("can go back", activeNav[0].canGoBack());
          let activeNav = listNav[0];
          if (!activeNav.canGoBack()) {
            if (this.usesUntilPrompt > 0) {
              // console.log("Uses Until prompt ", this.usesUntilPrompt);
              this.usesUntilPrompt -= 1;
              this.api.storeService(Constants.RATE_USES_UNTIL, this.usesUntilPrompt);
              this.platform.exitApp();
            } else if (this.usesUntilPrompt == 0) {
              // console.log("Showing rate dialog,Uses until prompt ", this.usesUntilPrompt);
              this.likeAppDialog();
            }
          }
          else {
            activeNav.pop();
          }
        } else {
          // console.log("Already Rated Exiting", this.rateFlag);

          this.platform.exitApp();
        }
      });
    });
  }

  likeAppDialog() {
    let alert = this.alertCtrl.create({
      title: Constants.LIKE_DIALOG_HEAD,
      message: Constants.LIKE_DIALOG_DESC,
      buttons: [
        {
          text: 'No',
          handler: () => {
            // console.log('No dont like the App');
            this.usesUntilPrompt = Constants.DONT_LIKE;
            this.api.storeService(Constants.RATE_USES_UNTIL, Constants.DONT_LIKE);
            this.platform.exitApp();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log("Yes Like the App");
            this.rateDialog();
          }
        }
      ]
    });
    alert.present();
  }

  rateDialog() {
    let alert = this.alertCtrl.create({
      title: Constants.RATE_DIALOG_HEAD,
      message: Constants.RATE_DIALOG_DESC,
      buttons: [
        {
          text: 'Later',
          handler: () => {
            // console.log('Remind Later clicked');
            this.usesUntilPrompt = Constants.LATER_LIKE;
            this.api.storeService(Constants.RATE_USES_UNTIL, Constants.LATER_LIKE);
            this.platform.exitApp();
          }
        },
        {
          text: 'Rate!',
          handler: () => {
            // console.log('Rating and getting 5 points');
            this.api.rewardNotif = true;
            window.open(Constants.RATE_LINK, '_system', 'location=yes');
            this.api.fetchService(Constants.POINTS).then(points => {
              // console.log("Points", points);
              this.api.storeService(Constants.POINTS, points + Constants.RATE_REWARD);
            });
            this.rateFlag = true;
            this.api.rateNotif = true;

            let rateStatus = new RateStatus();
            rateStatus.rated = this.rateFlag;
            rateStatus.notify = this.api.rateNotif;
            this.api.storeService(Constants.RATED, rateStatus);
            // console.log("Rated Flag set", this.rateFlag);

          }
        }
      ]
    });
    alert.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, { apiUrls: this.apiUrls });
  }
}
