import MainArea from './MainArea';
import PlayHistory from './PlayHistory';
import { loadImgAtlas } from './AssetLoader';
import { FakeServer } from './Common/CommServices';
import Modal from './Modal';
import GameAvatar from '././Common/GameAvatar';
import TopBar from './TopBar';

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
        backSprite: cc.Sprite,
        mainArea: {
            default: null,
            type: MainArea,
        },
        blackScore: {
            default: null,
            type: cc.Label,
        },
        whiteScore: {
            default: null,
            type: cc.Label,
        },
        playHistory: {
            default: null,
            type: PlayHistory,
        },
        winNotify: Modal,
        loseNotify: Modal,
        drawNotify: Modal,
        playerAvatar1: GameAvatar,
        playerAvatar2: GameAvatar,
        topBar: TopBar,



        // user can be -1(white) or 1(black)
        _currentUser: 0,
        _playerAvatars: [],
    },

    // use this for initialization
    onLoad: function () {
        GameScene = this;
        loadImgAtlas()
            .then(() => {
                this.start1();
                FakeServer.initHandlers();
                // setTimeout(() => {
                FakeServer.init();
                // }, 3000);
            })
            .catch((error) => {
                console.log("Error loading image atlas:", error);
            });
    },

    // start game
    start1: function () {
        console.log("topbar", this.topBar);
        this.topBar.setUserBalance(100);
        this._playerAvatars = [
            this.playerAvatar1, 
            this.playerAvatar2,
        ];
        for (let i = 0; i < this._playerAvatars.length; i++) {
            this._playerAvatars[i].setName("Player " + (i + 1));
            // this._playerAvatars[i].setPoint(0);
        }
        this.winNotify.node.active = false;
        this.loseNotify.node.active = false;
        this.drawNotify.node.active = false;
        this.playHistory._step = -1;
        this.playHistory._temp = -1;
        this._currentUser = 0;
        this.mainArea.start1();
    },

    setActivePlayer(user) {
        this._playerAvatars.forEach((item) => item.stopCountdown());
        this._playerAvatars[user].startCountdown();
    },

    // draw mainboard
    drawBoard: function (board, turn, availAreas, x, y, missionEndFlag) {
        if (missionEndFlag === 0) {
            this._currentUser = turn === 1 ? 1 : 0;
            this.setActivePlayer(this._currentUser);
            this.playHistory._step += 1;
        }
        this.playHistory._temp = this.playHistory._step;
        this.mainArea.draw(board, turn, availAreas, x, y);
    },

    drawHistoryBoard: function (board, turn, x, y, blackStoneNum, whiteStoneNum, step, availAreas) {
        this.setScore(blackStoneNum, whiteStoneNum);
        if (step === this.playHistory._step) {
            this.mainArea.draw(board, turn, availAreas, x, y);
        } else {
            this.mainArea.drawHistory(board, turn, x, y);
        }
    },

    setScore: function (blackStoneNum, whiteStoneNum) {
        this.blackScore.string = blackStoneNum;
        this.whiteScore.string = whiteStoneNum;
    },

    // show end modal
    showEndModal: function (blackScore, whiteScore, missionScore) {
        this.winNotify.node.active = false;
        this.loseNotify.node.active = false;
        this.drawNotify.node.active = false;
        if (blackScore > whiteScore) {
            this.loseNotify.node.active = true;
        } else if (whiteScore > blackScore) {
            this.winNotify.node.active = true;
        } else {
            this.drawNotify.node.active = true;
        }
        this._playerAvatars[0].setPoint(missionScore[0]);
        this._playerAvatars[1].setPoint(missionScore[1]);
        this._playerAvatars[0].stopCountdown();
        this._playerAvatars[1].stopCountdown();
        this._playerAvatars.forEach((item) => item.stopCountdown());
    },

    // called every frame
    update: function (dt) {
    },
});