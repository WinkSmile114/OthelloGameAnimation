import { TF_SHOP_URL } from "./Common/Constants";

export default cc.Class({
  extends: cc.Component,

  properties: {
    balanceLabel: cc.Label,

    _balance: 0,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {},

  setUserBalance(balance) {
    console.log("setUserBalance is called");
    this._balance = balance.toFixed(2);
    this.balanceLabel.string = this._balance;
  },

  onUserQuitBtnClick() {
    console.log("onUserQuitBtnClick is called");
  },

  onUserShopBtnClick() {
    cc.sys.openURL(TF_SHOP_URL);
  },

  // update (dt) {},
});
