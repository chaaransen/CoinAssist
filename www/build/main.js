webpackJsonp([0],{

/***/ 108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuantityCalcPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_api_data_api_data__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular_navigation_nav_params__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_coin_detail__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_utilities_utilities__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__constants_api_constants__ = __webpack_require__(53);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var QuantityCalcPage = (function () {
    function QuantityCalcPage(navCtrl, navParam, api, util, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParam = navParam;
        this.api = api;
        this.util = util;
        this.toastCtrl = toastCtrl;
        this.selCoin = new __WEBPACK_IMPORTED_MODULE_4__models_coin_detail__["a" /* CoinDetail */]();
        this.apis = {};
        this.amount = undefined;
        this.amountFlag = false;
        this.percent = 0.05;
        // console.log("1 qty constructor called");
        this.selExchange = navParam.get("exchange");
        this.selCoin.coinName = navParam.get("coin");
        // console.log(this.selCoin, " sel coin qty");
        // console.log(this.selExchange, " sel Exchange qty");
        this.apis = this.api.apiUrls.exchange;
        this.exchanges = Object.keys(this.apis);
        // console.log(this.apis, "api list fetched back");
    }
    QuantityCalcPage.prototype.ngOnInit = function () {
        // console.log("2 ng oninit called");
        if (this.selExchange == undefined) {
            this.selExchange = __WEBPACK_IMPORTED_MODULE_6__constants_api_constants__["f" /* KOINEX */];
        }
        if (this.selCoin.coinName == undefined) {
            this.selCoin.coinName = __WEBPACK_IMPORTED_MODULE_6__constants_api_constants__["d" /* BTC */];
        }
        this.populateView();
    };
    QuantityCalcPage.prototype.presentToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Latest Price Refreshed',
            duration: 1500,
            position: 'top'
        });
        toast.present();
    };
    QuantityCalcPage.prototype.doRefresh = function (refresher) {
        var _this = this;
        // console.log(this.selCoin.coinName, "sel Coin Name - Refresh");
        this.populateView();
        setTimeout(function () {
            _this.presentToast();
            refresher.complete();
        }, 800);
    };
    QuantityCalcPage.prototype.populateView = function () {
        // console.log("3 populate view called");
        this.populateCoins(this.selExchange);
    };
    QuantityCalcPage.prototype.populateCoins = function (exchange) {
        var _this = this;
        // console.log("4 populate coins");
        this.api.getExchangeData(exchange, true).subscribe(function (res) {
            _this.coins = _this.api.processExchangeData(exchange, res, undefined, undefined);
            // console.log(this.coins, "coins in qty");
            _this.populateCoinValues(_this.selCoin.coinName);
        });
    };
    QuantityCalcPage.prototype.populateCoinValues = function (selCoin) {
        var _this = this;
        // console.log("5 populate coin values called");
        // console.log(this.selCoin.coinName, "sel Coin Name - Refresh Populate");
        this.selCoin = this.coins.find(function (coin) { return _this.selCoin.coinName == coin.coinName; });
        // console.log(this.selCoin, "selected coin - QTY");
        this.selCoin.range.rate.no = this.selCoin.market.no;
        this.updateRange();
        // console.log(this.selCoin, " coin selected");
        // console.log(this.coins, "all coins");
    };
    QuantityCalcPage.prototype.updateRange = function () {
        // console.log(this.selCoin.range.rate.no);
        this.formateRate();
        this.selCoin = this.api.plusMinusPercent(this.selCoin, this.selCoin.range.rate.no, this.percent);
        // console.log("8 plus minus percent called");
        this.selCoin.step = this.api.rangeStepCalculator(this.selCoin.min.no, this.selCoin.max.no);
        // console.log("9 Range step called");
        // console.log(this.selCoin);
        this.calcQuantity();
        // console.log(this.selCoin);
    };
    QuantityCalcPage.prototype.coinRateChanged = function () {
        this.updateRange();
    };
    QuantityCalcPage.prototype.formateRate = function () {
        // console.log("7 format rate");
        // console.log(this.range.rate.no, 'nubmer');
        this.selCoin.range.rate.formatted = this.api.numberFormatter(+this.selCoin.range.rate.no);
        // console.log(this.range.rate.formatted);
    };
    QuantityCalcPage.prototype.calcQuantity = function () {
        // console.log("quantity calculated");
        if (this.amount != undefined) {
            this.calcFeesAmount();
            // console.log("Actual Amount", this.actualAmount);
            var qty = this.actualAmount / this.selCoin.range.rate.no;
            // console.log(qty);
            this.quantity = +this.util.trimQuantity(this.selCoin.coinName, qty);
            // console.log(this.quantity);
        }
    };
    QuantityCalcPage.prototype.calcFeesAmount = function () {
        this.exchange = this.apis[this.selExchange];
        // console.log("Exchange details", this.exchanges, this.exchange.fees.buy);
        var feesPercent = +this.exchange.fees.buy;
        console.log(feesPercent, "fees percent");
        console.log(this.amount, "Amount");
        this.actualAmount = (this.amount / (1 + feesPercent));
        console.log(this.actualAmount, "Actual Amount");
        this.buyerFees = this.amount - this.actualAmount;
        this.buyerFees = this.util.trimToDecimal(this.buyerFees, 2);
        console.log("Buyers fees", this.buyerFees);
        this.actualAmount = this.util.trimToDecimal(this.actualAmount, 2);
    };
    QuantityCalcPage.prototype.rangeChanged = function (rangePointer) {
        this.selCoin.range.rate.no = rangePointer;
        this.formateRate();
        this.calcQuantity();
    };
    QuantityCalcPage.prototype.calcAmount = function () {
        this.amount = this.quantity * this.selCoin.range.rate.no;
        this.calcFeesAmount();
    };
    QuantityCalcPage.prototype.amountChanged = function (amount) {
        // console.log(this.amountFlag);
        this.amount = amount.length > 9 ? this.trimAmount(amount) : this.clearAmountFlag(amount);
        // console.log("new amount value", this.amount);
        this.calcQuantity();
    };
    QuantityCalcPage.prototype.clearAmountFlag = function (amount) {
        // console.log("flag cleared");
        this.amountFlag = false;
        return amount;
    };
    QuantityCalcPage.prototype.trimAmount = function (amount) {
        // console.log("flag set");
        this.amountFlag = true;
        return amount = amount.substring(0, 9);
    };
    QuantityCalcPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-quantity-calc',template:/*ion-inline-start:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/quantity-calc/quantity-calc.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Quantity / Amount Calculator</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content pullingIcon="arrow-dropdown" pullingText="Pull to refresh" refreshingText="Refreshing...">\n    </ion-refresher-content>\n  </ion-refresher>\n\n  <ion-list>\n\n    <ion-item>\n      <ion-label fixed>Exchange</ion-label>\n      <ion-select [(ngModel)]="selExchange" *ngIf="selExchange" interface="popover" (ngModelChange)="populateCoins(selExchange)">\n        <ion-option *ngFor=" let exchange of exchanges ">{{exchange}}</ion-option>\n      </ion-select>\n    </ion-item>\n\n    <ion-item>\n      <ion-label fixed>Crypto-Coin</ion-label>\n      <ion-select [(ngModel)]="selCoin.coinName" interface="popover" (ngModelChange)="populateView()">\n        <ion-option *ngFor=" let coin of coins" [value]="coin.coinName">{{coin.coinName}} ({{coin.coinCode}})</ion-option>\n      </ion-select>\n    </ion-item>\n\n    <ion-item>\n      <ion-label fixed>Coin Rate</ion-label>\n      <ion-input type="number" placeholder="Rate" [(ngModel)]="selCoin.range.rate.no" clearInput="true" (ngModelChange)="coinRateChanged($event)"></ion-input>\n    </ion-item>\n    <ion-item>\n      {{selCoin.range.rate.formatted}}\n    </ion-item>\n    <!-- <ion-item>\n      <ion-range [min]="selCoin.range.minusPercent.no" [max]="selCoin.range.plusPercent.no" step="selCoin.step" snaps="true" [(ngModel)]="rangeValue"\n        (ionChange)="rangeChanged($event)">\n        <ion-label range-left>{{selCoin.range.minusPercent.formatted}}</ion-label>\n        <ion-label range-right>{{selCoin.range.plusPercent.formatted}}</ion-label>\n      </ion-range>\n    </ion-item> -->\n\n    <ion-item>\n      <ion-label fixed>Amount &#8377;</ion-label>\n      <ion-input type="number" placeholder="1000" clearInput="true" [(ngModel)]="amount" max="9" (ngModelChange)="amountChanged($event)"></ion-input>\n    </ion-item>\n    <!-- <div *ngIf="amountFlag">*Amount exceeding Limit</div> -->\n    <ion-item>\n      <ion-label fixed>Quantity</ion-label>\n      <ion-input type="number" placeholder="0.0001" clearInput="true" [(ngModel)]="quantity" (ngModelChange)="calcAmount()"></ion-input>\n    </ion-item>\n    <ion-item>\n      {{buyerFees}} + {{actualAmount}}\n    </ion-item>\n    <ion-item>\n      {{selCoin.range.minusPercent.formatted}} - {{selCoin.range.plusPercent.formatted}}\n    </ion-item>\n  </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/quantity-calc/quantity-calc.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular_navigation_nav_params__["a" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_api_data_api_data__["a" /* ApiDataProvider */], __WEBPACK_IMPORTED_MODULE_5__providers_utilities_utilities__["a" /* Utilities */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ToastController */]])
    ], QuantityCalcPage);
    return QuantityCalcPage;
}());

//# sourceMappingURL=quantity-calc.js.map

/***/ }),

/***/ 117:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 117;

/***/ }),

/***/ 159:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 159;

/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_api_data_api_data__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular_navigation_nav_params__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__coin_detail_coin_detail__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_of__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_takeWhile__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_takeWhile___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_takeWhile__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_observable_IntervalObservable__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_observable_IntervalObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_observable_IntervalObservable__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var HomePage = (function () {
    function HomePage(navCtrl, api, storage, navParam, toastCtrl) {
        // console.log("Constructor - Home page");
        this.navCtrl = navCtrl;
        this.api = api;
        this.storage = storage;
        this.navParam = navParam;
        this.toastCtrl = toastCtrl;
        this.alive = true;
    }
    HomePage.prototype.ngOnInit = function () {
        // console.log("Home component ngOninit Called");
        var _this = this;
        this.api.getApiUrlStorage().then(function (res) {
            if (res != null) {
                _this.apiUrls = res;
            }
            else {
                // console.log("constant Api urls called");
                _this.apiUrls = _this.api.getConstantApiUrl();
            }
            // console.log("Home Compo Value return");
            // console.log(this.apiUrls);
            _this.api.setApiUrl(_this.apiUrls);
            _this.populateView();
            var refresher = __WEBPACK_IMPORTED_MODULE_9_rxjs_observable_IntervalObservable__["IntervalObservable"].create(20000);
            refresher.takeWhile(function () { return _this.alive; }) // only fires when component is alive
                .subscribe(function () {
                _this.populateView();
            });
        });
    };
    HomePage.prototype.presentToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Latest Price Refreshed',
            duration: 1500,
            position: 'top'
        });
        toast.present();
    };
    HomePage.prototype.ionViewDidLeave = function () {
        this.alive = false;
        // console.log("Home page - left", this.alive);
    };
    HomePage.prototype.ionViewWillEnter = function () {
        this.alive = true;
        // console.log("Home page -View Entered", this.alive);
    };
    HomePage.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.populateView();
        setTimeout(function () {
            _this.presentToast();
            refresher.complete();
        }, 800);
    };
    HomePage.prototype.populateView = function () {
        // console.log(this.apiUrls.exchange);
        // console.log("Populating Home page");
        if (this.selExchange == undefined) {
            this.exchanges = Object.keys(this.apiUrls.exchange);
            this.selExchange = this.exchanges[0];
        }
        this.selectedExchange(this.selExchange);
    };
    HomePage.prototype.selectedExchange = function (sel) {
        var _this = this;
        this.api.getMarketOverviewData(sel, __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["a" /* ALL */]).subscribe(function (res) {
            // console.log("first data - exchange data", res[0]);
            // console.log("second data - coin market Cap data", res[1]);
            // console.log("third data - coindesk data", res[2]);
            _this.coins = _this.api.processExchangeData(sel, res[0], res[1], res[2]);
            // console.log("processed exchange data");
            // console.log(this.coins);
        }, function (err) {
            console.log(err);
        });
    };
    HomePage.prototype.navCoinDetailPage = function (coin) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__coin_detail_coin_detail__["a" /* CoinDetailPage */], { "coin": coin, "exchange": this.selExchange });
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar>\n    <button type="button" ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Market View</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content padding pullingIcon="arrow-dropdown" pullingText="Pull to refresh" refreshingText="Refreshing...">\n    </ion-refresher-content>\n  </ion-refresher>\n  <ion-item>\n    <ion-label>Exchange:</ion-label>\n    <ion-select [(ngModel)]="selExchange" interface="popover" (ngModelChange)="selectedExchange(selExchange)">\n      <ion-option *ngFor="let exchange of exchanges">{{exchange}}</ion-option>\n    </ion-select>\n\n  </ion-item>\n\n  <ion-list>\n    <!-- <ion-card>\n      <ion-grid>\n        <ion-row>\n          <ion-col col-4>Cryptos</ion-col>\n          <ion-col col-4>\n            Market Price\n          </ion-col>\n          <ion-col col-2>Change\n            <br>%</ion-col>\n          <ion-col col-2>Price Index</ion-col>\n        </ion-row>\n      </ion-grid>\n    </ion-card> -->\n    <ion-card *ngFor="let coin of coins" (click)="navCoinDetailPage(coin)">\n      <ion-item detail-push>\n        <ion-grid>\n          <ion-row>\n            <ion-col col-3>\n              <ion-thumbnail item-start>\n                <img src="assets/imgs/{{coin.coinCode}}.png">\n                <div class="coinName weight500">{{coin.coinName}}\n                  <br> ({{coin.coinCode}})\n                </div>\n              </ion-thumbnail>\n            </ion-col>\n            <ion-col col-8>\n              <ion-row>\n                <ion-col col-8>\n                  <ion-row class="price">\n                    {{coin.market.formatted}}\n                  </ion-row>\n                </ion-col>\n                <ion-col col-4 class="boldTextValue">\n                  <div *ngIf="coin.change.day >= 0" class="greenColor weight500">\n                    <span class="size1rem7">&#9650;</span>+{{coin.change.day}}%\n                  </div>\n                  <div *ngIf="coin.change.day < 0" class="redColor weight500">\n                    <span class="size1rem7">&#9660;</span>{{coin.change.day}}%\n                  </div>\n                </ion-col>\n              </ion-row>\n              <ion-row>\n                <ion-col col-6 *ngIf="coin.volatility">\n                  <span class="riseFallSymbol weight500">&#8645;</span>\n                  <span class="weight500"> {{coin.volatility}}% </span>\n                </ion-col>\n                <ion-col col-6>\n                  Price:\n                  <span [ngClass]="coin.price_index">{{coin.price_index}}</span>\n                </ion-col>\n              </ion-row>\n              <ion-row *ngIf="coin.min.no">\n                <ion-col col-12>\n                  <span>Low: </span>\n                  <span class="redColor weight500">{{coin.min.formatted}}</span>\n                </ion-col>\n              </ion-row>\n              <ion-row *ngIf="coin.max.no">\n                <ion-col col-12>\n                  <span>High: </span>\n                  <span class="greenColor weight500">{{coin.max.formatted}}</span>\n                </ion-col>\n              </ion-row>\n              <ion-row>\n                <ion-col col-12>\n                  <div *ngIf="coin.globalDiff.percent >= 0">\n                    Global.Diff(%):\n                    <span class="greenColor weight500">{{coin.globalDiff.percent}}%</span>\n                  </div>\n                  <div *ngIf="coin.globalDiff.percent < 0">\n                    Global.Diff(%):\n                    <span class="redColor weight500">{{coin.globalDiff.percent}}%</span>\n                  </div>\n                </ion-col>\n              </ion-row>\n            </ion-col>\n            <ion-col col-1 class="vertical-align-content">\n              <span class="weight500 nextButton">></span>\n            </ion-col>\n          </ion-row>\n        </ion-grid>\n\n      </ion-item>\n    </ion-card>\n  </ion-list>\n\n</ion-content>'/*ion-inline-end:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_api_data_api_data__["a" /* ApiDataProvider */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular_navigation_nav_params__["a" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ToastController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoinDetail; });
/* unused harmony export GlobalDiff */
/* unused harmony export Change */
/* unused harmony export Global */
/* unused harmony export RangeValue */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__value_detail__ = __webpack_require__(308);

var CoinDetail = (function () {
    function CoinDetail() {
        this.market = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
        this.buy = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
        this.sell = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
        this.min = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
        this.max = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
        this.global = new Global();
        this.range = new RangeValue();
        this.change = new Change();
        this.globalDiff = new GlobalDiff();
    }
    return CoinDetail;
}());

var GlobalDiff = (function () {
    function GlobalDiff() {
        this.val = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
    }
    return GlobalDiff;
}());

var Change = (function () {
    function Change() {
    }
    return Change;
}());

var Global = (function () {
    function Global() {
        this.INR = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
        this.USD = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
    }
    return Global;
}());

var RangeValue = (function () {
    function RangeValue() {
        this.rate = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
        this.plusPercent = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
        this.minusPercent = new __WEBPACK_IMPORTED_MODULE_0__value_detail__["a" /* ValueDetail */]();
    }
    return RangeValue;
}());

//# sourceMappingURL=coin-detail.js.map

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoinDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular_navigation_nav_params__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_api_data_api_data__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__quantity_calc_quantity_calc__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_IntervalObservable__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_IntervalObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_observable_IntervalObservable__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var CoinDetailPage = (function () {
    function CoinDetailPage(navCtrl, navParam, api, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParam = navParam;
        this.api = api;
        this.toastCtrl = toastCtrl;
        var coin = this.navParam.get("coin");
        this.exchange = this.navParam.get("exchange");
        // console.log(coin);
        this.initRange(coin);
    }
    CoinDetailPage.prototype.ngOnInit = function () {
        var _this = this;
        this.referralLink = this.api.apiUrls.exchange[this.exchange].referral;
        // console.log("referral Link", this.referralLink);
        this.populateView();
        var refresher = __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_IntervalObservable__["IntervalObservable"].create(20000);
        refresher.takeWhile(function () { return _this.alive; }) // only fires when component is alive
            .subscribe(function () {
            _this.populateView();
        });
    };
    CoinDetailPage.prototype.presentToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Latest Price Refreshed',
            duration: 1500,
            position: 'top'
        });
        toast.present();
    };
    CoinDetailPage.prototype.ionViewDidLeave = function () {
        this.alive = false;
        // console.log("Detail  page - left", this.alive);
    };
    CoinDetailPage.prototype.ionViewWillEnter = function () {
        this.alive = true;
        // console.log("Detail page -View Entered", this.alive);
    };
    CoinDetailPage.prototype.openReferralLink = function () {
        window.open(this.referralLink, '_system', 'location=yes');
    };
    CoinDetailPage.prototype.initRange = function (coin) {
        this.rangeRegion = {
            upper: coin.max.no,
            lower: coin.min.no
        };
        // console.log(this.rangeRegion);
        coin.step = this.api.rangeStepCalculator(coin.min.no, coin.max.no);
        this.coinDetail = coin;
        // console.log("coin detail");
        // console.log(this.coinDetail);
    };
    CoinDetailPage.prototype.change = function () {
        // console.log(this.rangeRegion);
    };
    CoinDetailPage.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.populateView();
        setTimeout(function () {
            _this.presentToast();
            refresher.complete();
        }, 800);
    };
    CoinDetailPage.prototype.populateView = function () {
        // console.log("Detail Populating");
        this.selectedExchange(this.exchange);
    };
    CoinDetailPage.prototype.selectedExchange = function (sel) {
        var _this = this;
        var coinName = this.api.getCoinName(this.coinDetail.coinCode);
        this.api.getMarketOverviewData(sel, coinName).subscribe(function (res) {
            // console.log("COIN DETAIL");
            // console.log("first data - exchange data");
            // console.log(res[0]);
            // console.log("second data - coin market Cap data");
            // console.log(res[1]);
            // console.log("third data - coindesk data");
            // console.log(res[2]);
            var coinArray = _this.api.processExchangeData(sel, res[0], res[1], res[2]);
            _this.coinDetail = coinArray[0];
            _this.initRange(_this.coinDetail);
            // console.log(this.coinDetail, "coinDetail Processed Detail");
        }, function (err) {
            console.log(err);
        });
    };
    CoinDetailPage.prototype.gotoCalcQuantityPage = function () {
        // console.log("Quantity button clicked");
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__quantity_calc_quantity_calc__["a" /* QuantityCalcPage */], { "coin": this.coinDetail.coinName, "exchange": this.exchange });
    };
    CoinDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-coin-detail',template:/*ion-inline-start:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/coin-detail/coin-detail.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Coin Detail</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content pullingIcon="arrow-dropdown" pullingText="Pull to refresh" refreshingText="Refreshing...">\n    </ion-refresher-content>\n  </ion-refresher>\n\n  <ion-card>\n    <ion-card-header class="size1rem4 center">Exchange -\n      <span class="weight500 size1rem9">{{exchange}}</span>\n    </ion-card-header>\n    <ion-grid>\n      <ion-row>\n        <ion-col col-5>\n          \n            <img src="assets/imgs/{{coinDetail.coinCode}}.png">\n          \n        </ion-col>\n        <ion-col col-7 class="vertical-align-content rem3">\n          <div>{{coinDetail.coinName}}\n            <br>({{coinDetail.coinCode}})</div>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-card-header class="size1rem4">Exchange price:\n        </ion-card-header>\n      </ion-row>\n      <ion-row>\n        <ion-col col-8 class="price">\n          {{coinDetail.market.formatted}}\n        </ion-col>\n        <ion-col col-4 class="boldTextValue">\n          <div *ngIf="coinDetail.change.day >= 0" class="greenColor weight500">\n            <span class="size1rem7">&#9650;</span>+{{coinDetail.change.day}}%\n          </div>\n          <div *ngIf="coinDetail.change.day < 0" class="redColor weight500">\n            <span class="size1rem7">&#9660;</span>{{coinDetail.change.day}}%\n          </div>\n        </ion-col>\n      </ion-row>\n      span.boldTextValue\n      <ion-row>\n        <ion-col col-6>Buy:\n          <span class="boldTextValue">{{coinDetail.buy.formatted}}</span>\n        </ion-col>\n        <ion-col col-6>Sell:\n          <span class="boldTextValue">{{coinDetail.sell.formatted}}</span>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-4>\n          (1h):\n          <br>\n          <span class="boldTextValue">\n            <span *ngIf="coinDetail.change.hour >= 0" class="greenColor weight500">\n              <span class="size1rem7">&#9650;</span>+{{coinDetail.change.hour}}%\n            </span>\n            <span *ngIf="coinDetail.change.hour < 0" class="redColor weight500">\n              <span class="size1rem7">&#9660;</span>{{coinDetail.change.hour}}%\n            </span>\n          </span>\n        </ion-col>\n        <ion-col col-4>\n          (24h):\n          <br>\n          <span class="boldTextValue">\n            <span *ngIf="coinDetail.change.day >= 0" class="greenColor weight500">\n              <span class="size1rem7">&#9650;</span>+{{coinDetail.change.day}}%\n            </span>\n            <span *ngIf="coinDetail.change.day < 0" class="redColor weight500">\n              <span class="size1rem7">&#9660;</span>{{coinDetail.change.day}}%\n            </span>\n          </span>\n        </ion-col>\n        <ion-col col-4>\n          (1w):\n          <br>\n          <span class="boldTextValue">\n            <span *ngIf="coinDetail.change.week >= 0" class="greenColor weight500">\n              <span class="size1rem7">&#9650;</span>+{{coinDetail.change.week}}%\n            </span>\n            <span *ngIf="coinDetail.change.week < 0" class="redColor weight500">\n              <span class="size1rem7">&#9660;</span>{{coinDetail.change.week}}%\n            </span>\n          </span>\n        </ion-col>\n      </ion-row>\n\n      <ion-row>\n        <ion-col col-6>\n          <span>Low: </span>\n          <span class="redColor weight500">{{coinDetail.min.formatted}}</span>\n        </ion-col>\n        <ion-col col-6>\n          <span>High: </span>\n          <span class="greenColor weight500">{{coinDetail.max.formatted}}</span>\n        </ion-col>\n      </ion-row>\n\n      <ion-row>\n        <ion-col col-6 *ngIf="coinDetail.volatility">\n          Volatility\n          <span class="riseFallSymbol weight500"> &#8645;</span>\n          <span class="weight500"> {{coinDetail.volatility}}% </span>\n        </ion-col>\n        <ion-col col-6>\n          Price Index:\n          <span [ngClass]="coinDetail.price_index">{{coinDetail.price_index}}</span>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-card-header class="size1rem4">Global price:\n        </ion-card-header>\n      </ion-row>\n      <ion-row>\n        <span class="price">{{coinDetail.global.INR.formatted}} </span>\n        <span class="price">({{coinDetail.global.USD.formatted}})</span>\n      </ion-row>\n      <ion-row>\n        <ion-col col-12>\n          <div *ngIf="coinDetail.globalDiff.percent >= 0">\n            Global.Diff(%):\n            <span class="greenColor weight500">{{coinDetail.globalDiff.percent}}%</span>\n          </div>\n          <div *ngIf="coinDetail.globalDiff.percent < 0">\n            Global.Diff(%):\n            <span class="redColor weight500">{{coinDetail.globalDiff.percent}}%</span>\n          </div>\n        </ion-col>\n        <ion-col col-12>\n          <div *ngIf="coinDetail.globalDiff.val.no >= 0">\n            Global.Diff(%):\n            <span class="greenColor weight500">{{coinDetail.globalDiff.val.formatted}}%</span>\n          </div>\n          <div *ngIf="coinDetail.globalDiff.val.no < 0">\n            Global.Diff(%):\n            <span class="redColor weight500">{{coinDetail.globalDiff.val.formatted}}%</span>\n          </div>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-12>\n          <button (click)="gotoCalcQuantityPage()" ion-button small class="boldTextValue"> Calculate Quantity</button>\n        </ion-col>\n        <ion-col col-6>\n          <button (click)="openReferralLink()" ion-button small class="boldTextValue">Buy / Sell {{coinDetail.coinName}}</button>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-card>\n</ion-content>\n\n<!-- Rage for setting price alert -->\n\n<!-- <ion-item>\n        <h2> From : {{rangeRegion.lower}}</h2>\n        <h2> To: {{rangeRegion.upper}}</h2>\n      </ion-item>\n      <ion-item>\n        <ion-range dualKnobs="true" pin="true" snaps="true" [step]="coinDetail.step" (ionChange)="change()" steps [(ngModel)]="rangeRegion"\n          [min]="coinDetail.minus20.no" [max]="coinDetail.plus20.no">\n          <ion-label range-left>{{coinDetail.minus20.formatted}}</ion-label>\n          <ion-label range-right>{{coinDetail.plus20.formatted}}</ion-label>\n        </ion-range>\n      </ion-item> -->\n\n<!-- Alert Button -->\n\n<!-- <ion-item>\n        <button ion-button large>Set Alert</button>\n\n      </ion-item> -->'/*ion-inline-end:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/coin-detail/coin-detail.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular_navigation_nav_params__["a" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_api_data_api_data__["a" /* ApiDataProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ToastController */]])
    ], CoinDetailPage);
    return CoinDetailPage;
}());

//# sourceMappingURL=coin-detail.js.map

/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RemindersPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var RemindersPage = (function () {
    function RemindersPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    RemindersPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-reminders',template:/*ion-inline-start:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/reminders/reminders.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Reminders</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n</ion-content>'/*ion-inline-end:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/reminders/reminders.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */]])
    ], RemindersPage);
    return RemindersPage;
}());

//# sourceMappingURL=reminders.js.map

/***/ }),

/***/ 212:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfitCalcPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_utilities_utilities__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(16);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ProfitCalcPage = (function () {
    function ProfitCalcPage(navCtrl, utilities, formBuilder) {
        this.navCtrl = navCtrl;
        this.utilities = utilities;
        this.formBuilder = formBuilder;
        this.profitCalcForm = this.formBuilder.group({
            title: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required],
            description: [''],
        });
    }
    ProfitCalcPage.prototype.ngOnInit = function () {
        // console.log("profit calc page ng oninit");
    };
    ProfitCalcPage.prototype.checkRequiredFields = function (type) {
        // console.log("Check Required fields", this.quantity, this.amount);
        switch (type) {
            case "qty": {
                // console.log("Quantity");
                this.quantity = this.utilities.trimToDecimal(+this.quantity, 4);
                this.calcAmount();
                if (this.checkMandatoryFields()) {
                    // console.log("Manadatory passed");
                    this.calcProfit();
                }
                break;
            }
            case "amt": {
                // console.log("Amount");
                this.amount = this.utilities.trimToDecimal(+this.amount, 2);
                this.calcQty();
                if (this.checkMandatoryFields()) {
                    this.calcProfit();
                }
                break;
            }
            default: {
                if (this.quantity != undefined && this.amount != undefined) {
                    this.checkRequiredFields("qty");
                }
                else if (this.quantity != undefined) {
                    this.checkRequiredFields("qty");
                }
                else if (this.amount != undefined) {
                    this.checkRequiredFields("amt");
                }
            }
        }
        // console.log("Exited");
    };
    ProfitCalcPage.prototype.buySellPriceChanged = function (priceType) {
        switch (priceType) {
            case "buy": {
                this.fromValue = this.utilities.trimToDecimal(+this.fromValue, 2);
                break;
            }
            case "sell": {
                this.toValue = this.utilities.trimToDecimal(+this.toValue, 2);
                break;
            }
        }
        this.checkRequiredFields();
    };
    ProfitCalcPage.prototype.clearAll = function () {
        this.quantity = 0;
        this.amount = 0;
        this.toValue = 0;
        this.fromValue = 0;
        this.profitLoss = 0;
        this.changePercent = 0;
        this.finalValue = 0;
    };
    ProfitCalcPage.prototype.checkMandatoryFields = function () {
        // console.log(this.fromValue, this.toValue);
        if (this.fromValue != undefined && this.toValue != undefined) {
            // console.log("mandatory true");
            return true;
        }
        else {
            // console.log("mandatory false");
            return false;
        }
    };
    ProfitCalcPage.prototype.calcQty = function () {
        if (this.fromValue != undefined) {
            this.quantity = this.amount / this.fromValue;
            this.quantity = this.utilities.trimToDecimal(this.quantity, 4);
        }
        // console.log("Qty calc", this.quantity);
    };
    ProfitCalcPage.prototype.calcAmount = function () {
        if (this.fromValue != undefined) {
            this.amount = this.quantity * this.fromValue;
            this.amount = this.utilities.trimToDecimal(this.amount, 2);
        }
        // console.log("Amount calc", this.amount);
    };
    ProfitCalcPage.prototype.calcProfit = function () {
        this.calcChangePercent();
        this.profitLoss = (this.amount * this.changePercent) - this.amount;
        this.profitLoss = this.utilities.trimToDecimal(+this.profitLoss, 2);
        // console.log("Profit loss", this.profitLoss);
        this.calcFinalvalue();
    };
    ProfitCalcPage.prototype.calcChangePercent = function () {
        this.changePercent = this.toValue / this.fromValue;
        this.changePercent = this.utilities.trimToDecimal(+this.changePercent, 2);
        // console.log("Change percent", this.changePercent);
    };
    ProfitCalcPage.prototype.calcFinalvalue = function () {
        this.finalValue = this.amount + this.profitLoss;
        if (Number.isNaN(this.finalValue)) {
            this.finalValue = 0;
        }
        else {
            this.finalValue = this.utilities.trimToDecimal(+this.finalValue, 2);
        }
        // console.log("Final value", this.finalValue);
    };
    ProfitCalcPage.prototype.updateSellPrice = function () {
        this.toValue = (this.profitLoss * this.fromValue + this.fromValue * this.fromValue) / this.amount;
        this.toValue = this.utilities.trimToDecimal(+this.toValue, 2);
        // console.log("Sell Value" + this.toValue);
        // console.log("before", this.profitLoss);
        this.calcFinalvalue();
        this.profitLoss = this.utilities.trimToDecimal(+this.profitLoss, 2);
        // console.log("after", this.profitLoss);
    };
    ProfitCalcPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-profit-calc',template:/*ion-inline-start:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/profit-calc/profit-calc.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Profit Calculator</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-list>\n\n    <ion-item>\n      <ion-label fixed>Quantity</ion-label>\n      <ion-input type="number" placeholder="0.0123" [(ngModel)]="quantity" clearInput="true" (ngModelChange)="checkRequiredFields(\'qty\')"></ion-input>\n    </ion-item>\n\n    OR\n\n    <ion-item>\n      <ion-label fixed>Investment &#8377;</ion-label>\n      <ion-input type="number" placeholder="3000" [(ngModel)]="amount" clearInput="true" (ngModelChange)="checkRequiredFields(\'amt\')"></ion-input>\n    </ion-item>\n\n\n\n    <ion-item>\n      <ion-label fixed>Buy Price &#8377;</ion-label>\n      <ion-input type="number" placeholder="1000" [(ngModel)]="fromValue" clearInput="true" (ngModelChange)="buySellPriceChanged(\'buy\')"></ion-input>\n    </ion-item>\n\n\n    <ion-item>\n      <ion-label fixed>Sell Price &#8377;</ion-label>\n      <ion-input type="number" placeholder="2000" [(ngModel)]="toValue" clearInput="true" (ngModelChange)="buySellPriceChanged(\'sell\')"></ion-input>\n    </ion-item>\n\n\n\n    <ion-item>\n      <ion-label fixed>Profit / Loss &#8377;</ion-label>\n      <ion-input type="number" placeholder="3000" [(ngModel)]="profitLoss" clearInput="true" (ngModelChange)="updateSellPrice()"></ion-input>\n    </ion-item>\n    <ion-item>\n      Total Amount = {{finalValue}}\n\n      <button (click)="clearAll()" ion-button>Clear All</button>\n    </ion-item>\n\n  </ion-list>\n\n</ion-content>'/*ion-inline-end:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/profit-calc/profit-calc.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_utilities_utilities__["a" /* Utilities */], __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */]])
    ], ProfitCalcPage);
    return ProfitCalcPage;
}());

//# sourceMappingURL=profit-calc.js.map

/***/ }),

/***/ 213:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NewsPage = (function () {
    function NewsPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    NewsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-news',template:/*ion-inline-start:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/news/news.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>News</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n</ion-content>'/*ion-inline-end:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/news/news.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */]])
    ], NewsPage);
    return NewsPage;
}());

//# sourceMappingURL=news.js.map

/***/ }),

/***/ 214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(236);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_coin_detail_coin_detail__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_buy_sell_buy_sell__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_favourites_favourites__ = __webpack_require__(314);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_reminders_reminders__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_profit_calc_profit_calc__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__providers_api_data_api_data__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_http__ = __webpack_require__(315);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__angular_common_http__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_storage__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_quantity_calc_quantity_calc__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_news_news__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__providers_utilities_utilities__ = __webpack_require__(54);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                // pages
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_coin_detail_coin_detail__["a" /* CoinDetailPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_buy_sell_buy_sell__["a" /* BuySellPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_favourites_favourites__["a" /* FavouritesPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_reminders_reminders__["a" /* RemindersPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profit_calc_profit_calc__["a" /* ProfitCalcPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_quantity_calc_quantity_calc__["a" /* QuantityCalcPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_news_news__["a" /* NewsPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_15__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_13__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["b" /* HttpClientModule */],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                // pages
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_coin_detail_coin_detail__["a" /* CoinDetailPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_buy_sell_buy_sell__["a" /* BuySellPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_favourites_favourites__["a" /* FavouritesPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_reminders_reminders__["a" /* RemindersPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profit_calc_profit_calc__["a" /* ProfitCalcPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_quantity_calc_quantity_calc__["a" /* QuantityCalcPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_news_news__["a" /* NewsPage */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_12__providers_api_data_api_data__["a" /* ApiDataProvider */],
                __WEBPACK_IMPORTED_MODULE_18__providers_utilities_utilities__["a" /* Utilities */],
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_reminders_reminders__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_profit_calc_profit_calc__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_api_data_api_data__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_news_news__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_quantity_calc_quantity_calc__ = __webpack_require__(108);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, api) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.api = api;
        // rootPage: any = HomePage;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_9__pages_quantity_calc_quantity_calc__["a" /* QuantityCalcPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_5__pages_reminders_reminders__["a" /* RemindersPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_6__pages_profit_calc_profit_calc__["a" /* ProfitCalcPage */];
        this.tab5Root = __WEBPACK_IMPORTED_MODULE_8__pages_news_news__["a" /* NewsPage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */] }
        ];
    }
    MyApp.prototype.ngOnInit = function () {
        // console.log("GET - api urls from app component");
        var _this = this;
        this.api.fetchApiUrl().subscribe(function (res) {
            // console.log("fetched in app component");
            // console.log(res);
            _this.api.storeApiUrl(res);
        }, function (err) {
            console.log("App component - error fetching data");
        });
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component, { apiUrls: this.apiUrls });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/chaaransen/Documents/dev/coin-assist/src/app/app.html"*/'<ion-menu [content]="content">\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>Settings</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n<ion-content>\n  <ion-tabs>\n    <ion-tab [root]="tab1Root" tabTitle="Market View" tabIcon="logo-bitcoin"></ion-tab>\n    <ion-tab [root]="tab2Root" tabTitle="Quantity Calc" tabIcon="bookmark"></ion-tab>\n    <ion-tab [root]="tab4Root" tabTitle="Profit Calc" tabIcon="logo-usd"></ion-tab>\n  </ion-tabs>\n</ion-content>\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<!-- <ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav> -->'/*ion-inline-end:"/Users/chaaransen/Documents/dev/coin-assist/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_7__providers_api_data_api_data__["a" /* ApiDataProvider */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValueDetail; });
var ValueDetail = (function () {
    function ValueDetail() {
        this.no = 0;
        this.formatted = "";
    }
    return ValueDetail;
}());

//# sourceMappingURL=value-detail.js.map

/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BuySellPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BuySellPage = (function () {
    function BuySellPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    BuySellPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-buy-sell',template:/*ion-inline-start:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/buy-sell/buy-sell.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Buy / Sell</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n</ion-content>'/*ion-inline-end:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/buy-sell/buy-sell.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */]])
    ], BuySellPage);
    return BuySellPage;
}());

//# sourceMappingURL=buy-sell.js.map

/***/ }),

/***/ 314:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FavouritesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FavouritesPage = (function () {
    function FavouritesPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    FavouritesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-favourites',template:/*ion-inline-start:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/favourites/favourites.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Favourites</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n</ion-content>'/*ion-inline-end:"/Users/chaaransen/Documents/dev/coin-assist/src/pages/favourites/favourites.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */]])
    ], FavouritesPage);
    return FavouritesPage;
}());

//# sourceMappingURL=favourites.js.map

/***/ }),

/***/ 41:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiDataProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_forkJoin__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_forkJoin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_forkJoin__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_timer__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_timer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_timer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_observable_empty__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_observable_empty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_observable_empty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_catch__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_coin_detail__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utilities_utilities__ = __webpack_require__(54);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var ApiDataProvider = (function () {
    // private coinAssistApis = "http://localhost:3000/apis";
    function ApiDataProvider(http, storage, utility) {
        this.http = http;
        this.storage = storage;
        this.utility = utility;
        this.apiUrls = {};
        this.apiUrlStore = "apiUrls";
        this.koinexData = {};
        this.zebpayData = {};
        this.LOCAL = true;
        // ******************************************************************************
        this.coinAssistApis = "https://coin-assist-api.herokuapp.com/apis";
    }
    ApiDataProvider.prototype.setApiUrl = function (apiUrl) {
        this.apiUrls = apiUrl;
    };
    ApiDataProvider.prototype.fetchApiUrl = function () {
        // console.log("GET - api urls");
        return this.http.get(this.coinAssistApis);
    };
    ApiDataProvider.prototype.getApiUrlStorage = function () {
        var _this = this;
        // console.log("GET - api url storage");
        return this.storage.ready().then(function () {
            return _this.storage.get(_this.apiUrlStore);
        });
    };
    ApiDataProvider.prototype.getConstantApiUrl = function () {
        // console.log("GET - constant URL ");
        return JSON.parse(__WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["b" /* API_URL */]);
    };
    ApiDataProvider.prototype.storeApiUrl = function (fetchedApiUrl) {
        this.apiUrls = fetchedApiUrl;
        // console.log("STORE - store api url");
        this.storage.set(this.apiUrlStore, fetchedApiUrl).then(function (res) {
            // console.log("Stored Successfully");
        }, function (err) {
            console.log("Storage Error");
            console.log(err);
        });
    };
    ApiDataProvider.prototype.getCurrentApis = function () {
        return this.storage.get(this.apiUrlStore);
    };
    // ************************************************************************
    ApiDataProvider.prototype.getKoinexData = function () {
        // console.log("GET - koinex data");
        // console.log(this.apiUrls.exchange.koinex);
        // console.log(this.koinexData, "before");
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(this.koinexData = JSON.parse(__WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["g" /* KOINEX_DATA */]));
        // if (this.koinexData.lock == false || this.koinexData.lock == undefined) {
        //   this.koinexData.lock = true;
        //   return this.http.get(this.apiUrls.exchange.koinex.api).map(res => {
        //     // console.log(res);
        //     // console.log("FETCHED - koinex data", res);
        //     this.updateRecentExchangeData(Constants.KOINEX, res);
        //     return res;
        //   }).catch(error => {
        //     this.updateRecentExchangeData(Constants.KOINEX);
        //     return Observable.of(this.koinexData)
        //   });
        // } else if (this.koinexData.lock == true) {
        //   // console.log("STATIC - koinex data", this.koinexData);
        //   return Observable.of(this.koinexData);
        // }
    };
    ApiDataProvider.prototype.updateRecentExchangeData = function (exchange, exchangeData) {
        if (exchangeData != undefined) {
            this.setExchangeData(exchange, exchangeData);
        }
        this.lockExchange(exchange);
    };
    ApiDataProvider.prototype.lockExchange = function (exchange) {
        var _this = this;
        switch (exchange) {
            case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["f" /* KOINEX */]: {
                this.koinexData.lock = true;
                // console.log("LOCK SET", this.koinexData);
                var releaseLockKoinex = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].timer(15000);
                releaseLockKoinex.subscribe(function (res) {
                    _this.koinexData.lock = false;
                    // console.log("LOCK RELEASED", this.koinexData);
                });
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["j" /* ZEBPAY */]:
                {
                    this.zebpayData.lock = true;
                    // console.log("LOCK SET", this.zebpayData);
                    var releaseLockZebpay = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].timer(15000);
                    releaseLockZebpay.subscribe(function (res) {
                        _this.zebpayData.lock = false;
                        // console.log("LOCK RELEASED", this.zebpayData);
                    });
                    break;
                }
        }
    };
    // TO BE TESTED
    ApiDataProvider.prototype.getZebpayData = function () {
        // console.log("GET - zebpay data", this.zebpayData);
        var _this = this;
        if (this.zebpayData.lock == false || this.zebpayData.lock == undefined) {
            this.zebpayData.lock = true;
            return this.http.get(this.apiUrls.exchange.zebpay.api).map(function (res) {
                // console.log(res);
                // console.log("FETCHED - zebpay data", res);
                _this.updateRecentExchangeData(__WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["j" /* ZEBPAY */], res);
                return res;
            }).catch(function (error) {
                _this.updateRecentExchangeData(__WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["j" /* ZEBPAY */]);
                return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(_this.zebpayData);
            });
        }
        else if (this.zebpayData.lock == true) {
            // console.log("STATIC - zebpay data", this.zebpayData);
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(this.zebpayData);
        }
    };
    ApiDataProvider.prototype.getExchangeData = function (exchange, data) {
        if (data === void 0) { data = true; }
        switch (exchange) {
            case "koinex":
                {
                    // console.log("switch case koinex");
                    if (data) {
                        return this.getKoinexData();
                    }
                    return this.getKoinexTemplate();
                }
            case "zebpay":
                {
                    if (data) {
                        return this.getZebpayData();
                    }
                    return this.getZebpayTemplate();
                    // console.log("switch case zebpay");
                }
        }
    };
    ApiDataProvider.prototype.getKoinexTemplate = function () {
        var coins = [];
        // console.log(this.koinexData, "Koinex Template Data");
        var exchangeCoins = this.koinexData.stats;
        for (var coin in exchangeCoins) {
            coins.push(this.getCoinName(coin));
        }
        return coins;
    };
    ApiDataProvider.prototype.getZebpayTemplate = function () {
        var coins = [];
        coins.push(this.getCoinName("BTC"));
        return coins;
    };
    // TO BE TESTED
    ApiDataProvider.prototype.getCoinName = function (coin) {
        switch (coin) {
            case "BTC":
                return __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["d" /* BTC */];
            case "ETH":
                return __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["e" /* ETH */];
            case "XRP":
                return __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["i" /* XRP */];
            case "BCH":
                return __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["c" /* BCH */];
            case "LTC":
                return __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["h" /* LTC */];
        }
    };
    // TO BE TESTED
    ApiDataProvider.prototype.koinexProcessor = function (exchangeData, coinMarketCapData, coinDeskData) {
        var processedKoinexData = [];
        var coinList = exchangeData.stats;
        // console.log(coinMarketCapData, "coinmarket cap data- processor");
        // console.log(coinList, "before");
        if (coinMarketCapData != undefined) {
            if (coinMarketCapData.length == 1) {
                var singleCoin = {};
                // console.log(coinMarketCapData);
                // console.log(coinList[coinMarketCapData[0].symbol]);
                singleCoin[coinMarketCapData[0].symbol] = coinList[coinMarketCapData[0].symbol];
                coinList = singleCoin;
                // console.log(coinList, "after");
            }
        }
        for (var coin in coinList) {
            // var processedCoin: any = {};
            var processedCoin = new __WEBPACK_IMPORTED_MODULE_10__models_coin_detail__["a" /* CoinDetail */]();
            processedCoin.coinName = this.getCoinName(coin);
            processedCoin.coinCode = coin;
            processedCoin.market.no = +coinList[coin].last_traded_price;
            processedCoin.buy.no = +coinList[coin].lowest_ask;
            processedCoin.sell.no = +coinList[coin].highest_bid;
            processedCoin.min.no = +coinList[coin].min_24hrs;
            processedCoin.max.no = +coinList[coin].max_24hrs;
            var diff = processedCoin.max.no - processedCoin.min.no;
            var average = diff / 2;
            processedCoin.volatility = this.utility.trimToDecimal((average / processedCoin.market.no) * 100, 2);
            processedCoin.price_index = this.getPriceIndex(processedCoin.min.no, processedCoin.max.no, processedCoin.market.no);
            // console.log(coinMarketCapData, "coin market data null check");
            if (coinMarketCapData != undefined) {
                processedCoin = this.injectGlobalStats(coin, processedCoin, coinMarketCapData, coinDeskData);
            }
            processedCoin = this.coinDetailFormatter(processedCoin);
            // console.log(processedCoin);
            processedKoinexData.push(processedCoin);
        }
        return processedKoinexData;
    };
    ApiDataProvider.prototype.coinDetailFormatter = function (processedCoin) {
        processedCoin.market.formatted = this.numberFormatter(processedCoin.market.no);
        processedCoin.buy.formatted = this.numberFormatter(processedCoin.buy.no);
        processedCoin.sell.formatted = this.numberFormatter(processedCoin.sell.no);
        if (processedCoin.min.no != undefined) {
            processedCoin.min.formatted = this.numberFormatter(processedCoin.min.no);
            processedCoin.max.formatted = this.numberFormatter(processedCoin.max.no);
        }
        if (processedCoin.global.INR.no != undefined) {
            processedCoin.global.INR.formatted = this.numberFormatter(processedCoin.global.INR.no);
            processedCoin.global.USD.formatted = this.numberFormatter(processedCoin.global.USD.no, 'en-US', 'USD');
            processedCoin.globalDiff.val.formatted = this.numberFormatter(processedCoin.globalDiff.val.no);
        }
        return processedCoin;
    };
    ApiDataProvider.prototype.plusMinusPercent = function (ObjectTarget, market, percent) {
        if (ObjectTarget === void 0) { ObjectTarget = undefined; }
        var marketPrice = +market;
        var percentage = {};
        percentage.percentValue = (marketPrice * percent);
        percentage.plusPercent = marketPrice + percentage.percentValue;
        percentage.minusPercent = marketPrice - percentage.percentValue;
        if (ObjectTarget != undefined) {
            try {
                ObjectTarget.range.plusPercent.no = percentage.plusPercent;
                ObjectTarget.range.minusPercent.no = percentage.minusPercent;
                ObjectTarget.range.plusPercent.formatted = this.numberFormatter(ObjectTarget.range.plusPercent.no);
                ObjectTarget.range.minusPercent.formatted = this.numberFormatter(ObjectTarget.range.minusPercent.no);
                return ObjectTarget;
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            return percentage;
        }
    };
    ApiDataProvider.prototype.numberFormatter = function (number, locale, currency) {
        if (locale === void 0) { locale = 'hi-IN'; }
        if (currency === void 0) { currency = 'INR'; }
        return number.toLocaleString(locale, { style: 'currency', currency: currency });
    };
    ApiDataProvider.prototype.rangeStepCalculator = function (min, max) {
        var diff = max - min;
        var step = diff / 10;
        // console.log("Steps ", step);
        return step;
    };
    // TO BE TESTED
    ApiDataProvider.prototype.getCoinGlobalStats = function (coinSymbol, coinMarketCapData, coinDeskData) {
        try {
            var coinGlobalStats = {};
            for (var coin in coinMarketCapData) {
                if (coinMarketCapData[coin].symbol == coinSymbol) {
                    coinGlobalStats.changeHour = coinMarketCapData[coin].percent_change_1h;
                    coinGlobalStats.changeDay = coinMarketCapData[coin].percent_change_24h;
                    coinGlobalStats.changeWeek = coinMarketCapData[coin].percent_change_7d;
                    if (coinMarketCapData[coin].symbol == "BTC") {
                        coinGlobalStats.globalINR = coinDeskData.bpi.INR.rate_float;
                        coinGlobalStats.globalUSD = coinDeskData.bpi.USD.rate_float;
                    }
                    else {
                        coinGlobalStats.globalINR = coinMarketCapData[coin].price_inr;
                        coinGlobalStats.globalUSD = coinMarketCapData[coin].price_usd;
                    }
                    return coinGlobalStats;
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    // TO BE TESTED
    ApiDataProvider.prototype.getPriceIndex = function (min, max, current) {
        var total = max - min;
        var diff = total / 3;
        var lowRegionHigh = min + diff;
        var mediumRegionHigh = (min + (2 * diff));
        if (current <= lowRegionHigh && current > min || current < min) {
            return "Low";
        }
        else if (current <= mediumRegionHigh && current > lowRegionHigh) {
            return "Medium";
        }
        else if (current <= max && current > mediumRegionHigh || current > max) {
            return "High";
        }
    };
    // TO BE TESTED
    ApiDataProvider.prototype.zebpayProcessor = function (exchangeData, coinMarketCapData, coinDeskData) {
        var processedZebpayData = [];
        var coin = "BTC";
        var zebpayData = exchangeData;
        var processedCoin = new __WEBPACK_IMPORTED_MODULE_10__models_coin_detail__["a" /* CoinDetail */]();
        processedCoin.coinName = this.getCoinName(coin);
        processedCoin.coinCode = coin;
        processedCoin.market.no = +zebpayData.market;
        processedCoin.buy.no = +zebpayData.buy;
        processedCoin.sell.no = +zebpayData.sell;
        processedCoin.min.no = undefined;
        processedCoin.max.no = undefined;
        processedCoin.price_index = this.getPriceIndexZebpay(processedCoin.buy.no, processedCoin.sell.no);
        if (coinMarketCapData != undefined) {
            processedCoin = this.injectGlobalStats(coin, processedCoin, coinMarketCapData, coinDeskData);
        }
        processedCoin = this.coinDetailFormatter(processedCoin);
        // console.log(processedCoin);
        processedZebpayData.push(processedCoin);
        return processedZebpayData;
    };
    ApiDataProvider.prototype.injectGlobalStats = function (coin, processedCoin, coinMarketCapData, coinDeskData) {
        try {
            var coinGlobalStats = this.getCoinGlobalStats(coin, coinMarketCapData, coinDeskData);
            processedCoin.global.INR.no = +coinGlobalStats.globalINR;
            processedCoin.global.USD.no = +coinGlobalStats.globalUSD;
            processedCoin.change.hour = +coinGlobalStats.changeHour;
            processedCoin.change.day = +coinGlobalStats.changeDay;
            processedCoin.change.week = +coinGlobalStats.changeWeek;
            processedCoin.globalDiff.val.no = processedCoin.market.no - processedCoin.global.INR.no;
            processedCoin.globalDiff.percent = this.utility.trimToDecimal((processedCoin.globalDiff.val.no / processedCoin.market.no) * 100, 2);
            // console.log(processedCoin.globalDiff.percent);
            return processedCoin;
        }
        catch (e) {
            console.log(e);
        }
    };
    ApiDataProvider.prototype.getPriceIndexZebpay = function (buy, sell) {
        var diff = buy - sell;
        if (diff < 10000) {
            return "LOW";
        }
        else if (diff < 20000 && diff >= 10000) {
            return "MEDIUM";
        }
        else if (diff >= 20000) {
            return "HIGH";
        }
    };
    // TO BE TESTED
    ApiDataProvider.prototype.getCoindeskData = function () {
        return this.http.get(this.apiUrls.global.coindesk.api);
    };
    // TO BE TESTED
    ApiDataProvider.prototype.getCoinMarketCapData = function (coin) {
        switch (coin) {
            case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["d" /* BTC */]: {
                return this.http.get(this.apiUrls.global.coinmarketcap.coin.BTC);
            }
            case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["e" /* ETH */]: {
                return this.http.get(this.apiUrls.global.coinmarketcap.coin.ETH);
            }
            case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["c" /* BCH */]: {
                return this.http.get(this.apiUrls.global.coinmarketcap.coin.BCH);
            }
            case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["h" /* LTC */]: {
                return this.http.get(this.apiUrls.global.coinmarketcap.coin.LTC);
            }
            case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["i" /* XRP */]: {
                return this.http.get(this.apiUrls.global.coinmarketcap.coin.XPR);
            }
            case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["a" /* ALL */]: {
                var coinMarketCapApi = this.apiUrls.global.coinmarketcap.api + this.apiUrls.global.coinmarketcap.coin_limit;
                return this.http.get(coinMarketCapApi);
            }
        }
    };
    // TO BE TESTED
    ApiDataProvider.prototype.processExchangeData = function (exchange, exchangeData, coinMarketCapData, coinDeskData) {
        // console.log(coinMarketCapData, " inside process Exchange data - SWITCH");
        try {
            switch (exchange) {
                case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["f" /* KOINEX */]:
                    {
                        // console.log("switch case koinex");
                        return this.koinexProcessor(exchangeData, coinMarketCapData, coinDeskData);
                    }
                case __WEBPACK_IMPORTED_MODULE_5__constants_api_constants__["j" /* ZEBPAY */]:
                    {
                        // console.log("switch case zebpay");
                        return this.zebpayProcessor(exchangeData, coinMarketCapData, coinDeskData);
                    }
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    // TO BE TESTED
    ApiDataProvider.prototype.getMarketOverviewData = function (sel, coin, data) {
        if (data === void 0) { data = true; }
        try {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].forkJoin([this.getExchangeData(sel, data), this.getCoinMarketCapData(coin), this.getCoindeskData()]);
        }
        catch (e) {
            console.log(e);
        }
    };
    ApiDataProvider.prototype.setExchangeData = function (exchange, exchangeData) {
        switch (exchange) {
            case "koinex":
                {
                    this.koinexData = exchangeData;
                    // console.log("SET - koinex exchange data", this.koinexData);
                    break;
                }
            case "zebpay":
                {
                    // console.log("SET - zebpay exchange data");
                    this.zebpayData = exchangeData;
                    break;
                }
        }
    };
    ApiDataProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_11__utilities_utilities__["a" /* Utilities */]])
    ], ApiDataProvider);
    return ApiDataProvider;
}());

//# sourceMappingURL=api-data.js.map

/***/ }),

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return API_URL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return KOINEX_DATA; });
/* unused harmony export COIN_LIST_TEMPLATE */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return BTC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return XRP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ETH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return LTC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return BCH; });
/* unused harmony export INR */
/* unused harmony export USD */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ALL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return ZEBPAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return KOINEX; });
var API_URL = "{\r\n  \"exchange\": {\r\n    \"koinex\": \"https:\/\/koinex.in\/api\/ticker\",\r\n    \"zebpay\": \"https:\/\/www.zebapi.com\/api\/v1\/market\/ticker\/btc\/inr\"\r\n  },\r\n  \"global\": {\r\n    \"coindesk\": {\r\n      \"api\": {\r\n        \"USD\": \"https:\/\/api.coindesk.com\/v1\/bpi\/currentprice.json\",\r\n        \"INR\": \"https:\/\/api.coindesk.com\/v1\/bpi\/currentprice\/inr.json\"\r\n      }\r\n    },\r\n    \"coinmarketcap\": {\r\n      \"api\": {\r\n        \"USD\": \"https:\/\/api.coinmarketcap.com\/v1\/ticker\/?limit=6\",\r\n        \"INR\": \"https:\/\/api.coinmarketcap.com\/v1\/ticker\/?convert=INR&limit=6\"\r\n      },\r\n      \"coin\": {\r\n        \"bitcoin\": \"https:\/\/api.coinmarketcap.com\/v1\/ticker\/bitcoin\",\r\n        \"ether\": \"https:\/\/api.coinmarketcap.com\/v1\/ticker\/ethereum\",\r\n        \"ripple\": \"https:\/\/api.coinmarketcap.com\/v1\/ticker\/ripple\",\r\n        \"btc-cash\": \"https:\/\/api.coinmarketcap.com\/v1\/ticker\/bitcoin-cash\",\r\n        \"litecoin\": \"https:\/\/api.coinmarketcap.com\/v1\/ticker\/litecoin\"\r\n      }\r\n    }\r\n  },\r\n  \"version\": \"1.0.0\"\r\n}";
var KOINEX_DATA = "{\"prices\":{\"BTC\":\"1271000.0\",\"XRP\":\"203.5\",\"ETH\":\"76989.0\",\"BCH\":\"192499.0\",\"LTC\":\"21498.99\",\"MIOTA\":253.15,\"OMG\":1282.71,\"GNT\":68.61},\"stats\":{\"ETH\":{\"last_traded_price\":\"76989.0\",\"lowest_ask\":\"76988.0\",\"highest_bid\":\"76800.0\",\"min_24hrs\":\"74000.0\",\"max_24hrs\":\"77887.0\",\"vol_24hrs\":\"2187.735\"},\"BTC\":{\"last_traded_price\":\"1271000.0\",\"lowest_ask\":\"1280000.0\",\"highest_bid\":\"1271000.0\",\"min_24hrs\":\"1218601.5\",\"max_24hrs\":\"1310000.0\",\"vol_24hrs\":\"253.7324\"},\"LTC\":{\"last_traded_price\":\"21498.99\",\"lowest_ask\":\"21498.99\",\"highest_bid\":\"21410.0\",\"min_24hrs\":\"20200.0\",\"max_24hrs\":\"23000.0\",\"vol_24hrs\":\"22545.462\"},\"XRP\":{\"last_traded_price\":\"203.5\",\"lowest_ask\":\"203.7\",\"highest_bid\":\"203.55\",\"min_24hrs\":\"165.0\",\"max_24hrs\":\"210.0\",\"vol_24hrs\":\"4739999.3\"},\"BCH\":{\"last_traded_price\":\"192499.0\",\"lowest_ask\":\"192499.0\",\"highest_bid\":\"191340.0\",\"min_24hrs\":\"182000.0\",\"max_24hrs\":\"195000.0\",\"vol_24hrs\":\"816.173\"}}}";
var COIN_LIST_TEMPLATE = "{\r\n  \"coin\": \"bitcoin\",\r\n  \"market\": \"5000\",\r\n  \"buy\": \"6000\",\r\n  \"sell\": \"4000\",\r\n  \"price_index\": \"high\",\r\n  \"change\": \"7\"\r\n}";
var BTC = "Bitcoin";
var XRP = "Ripple";
var ETH = "Ethereum";
var LTC = "Litecoin";
var BCH = "Bitcoin Cash";
var INR = "INR";
var USD = "USD";
var ALL = "ALL";
var ZEBPAY = "zebpay";
var KOINEX = "koinex";
//# sourceMappingURL=api-constants.js.map

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Utilities; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants_api_constants__ = __webpack_require__(53);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Utilities = (function () {
    function Utilities() {
    }
    Utilities.prototype.trimQuantity = function (coinName, quantity) {
        if (coinName === void 0) { coinName = "default"; }
        var trimmedQty;
        switch (coinName) {
            case __WEBPACK_IMPORTED_MODULE_1__constants_api_constants__["d" /* BTC */]: {
                return trimmedQty = +quantity.toFixed(4);
            }
            case __WEBPACK_IMPORTED_MODULE_1__constants_api_constants__["e" /* ETH */]: {
                return trimmedQty = +quantity.toFixed(3);
            }
            case __WEBPACK_IMPORTED_MODULE_1__constants_api_constants__["i" /* XRP */]: {
                return trimmedQty = +quantity.toFixed(0);
            }
            case __WEBPACK_IMPORTED_MODULE_1__constants_api_constants__["h" /* LTC */]: {
                return trimmedQty = +quantity.toFixed(3);
            }
            case __WEBPACK_IMPORTED_MODULE_1__constants_api_constants__["c" /* BCH */]: {
                return trimmedQty = +quantity.toFixed(3);
            }
            default: {
                return trimmedQty = +quantity.toFixed(2);
            }
        }
    };
    Utilities.prototype.trimToDecimal = function (value, decimal) {
        // console.log(value, "decimal value", decimal);
        var numericValue = +value;
        var finalValue = +numericValue.toFixed(decimal);
        // console.log(finalValue, "final value");
        return finalValue;
        // return +numericValue.toFixed(decimal);
    };
    Utilities = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], Utilities);
    return Utilities;
}());

//# sourceMappingURL=utilities.js.map

/***/ })

},[214]);
//# sourceMappingURL=main.js.map