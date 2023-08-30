import { ClientCommService } from "./ClientCommService";
import { BLOCKSIZE } from "./Common/Constants";

cc.Class({
    extends: cc.Component,

    properties: {
        whiteStonePrefab: cc.Prefab,
        blackStonePrefab: cc.Prefab,
        availPrefab: cc.Prefab,
        redPointPrefab: cc.Prefab,
        stone: cc.Prefab,
        smallWhiteDom: cc.Node,
        smallBlackDom: cc.Node,
        smallWhiteStone: cc.Prefab,
        smallBlackStone: cc.Prefab,

        _whiteStones: [],
        _blackStones: [],
        _x: 0,
        _y: 0,
        _boardPrev: new Array(),
        _turn: 0,
        _res: false,
        _historyMode: false,
        _availAreas: [],
        _smallWhitePosition: null,
        _smallBlackPosition: null,
    },

    onLoad() {
        this._turn = 0;
        this._res = false;
        this._historyMode = false;
        this._availAreas = [];
        // Board initialization
        for (let i = 0; i < 8; i++) {
            this._boardPrev[i] = new Array();
            for (let j = 0; j < 8; j++) {
                this._boardPrev[i][j] = 0;
            }
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

    },

    start1() {
        this._turn = 0;
        this._res = false;
        this._historyMode = false;
        this._smallWhitePosition = this.smallWhiteDom.convertToWorldSpaceAR(this.smallWhiteDom.getPosition());
        this._smallBlackPosition = this.smallBlackDom.convertToWorldSpaceAR(this.smallBlackDom.getPosition());
        this._availAreas = [];
        // Board initialization
        for (let i = 0; i < 8; i++) {
            this._boardPrev[i] = new Array();
            for (let j = 0; j < 8; j++) {
                this._boardPrev[i][j] = 0;
            }
        }
    },

    turnStone(board, x, y, i, j, mode, turn) {
        if (i == 0 && j == 0) { return 0; }

        x += i;
        y += j;

        // Exception handling
        if (x < 0 || x > 7 || y < 0 || y > 7) { return 0; }

        // when nothing
        if (board[x][y] == 0) {
            return 0;

            // when you have your own stone
        } else if (board[x][y] == turn) {
            return 3;

            // When there is an opponent's stone
        } else {
            // Finally, if you have your own stone, turn it over.
            if (this.turnStone(board, x, y, i, j, mode, turn) >= 2) {
                if (mode != 0) { board[x][y] = turn; }
                return 2;
            }

            return 1;
        }
    },

    // draw(board, turn, availAreas, x, y) {
    //     this._historyMode = false;
    //     this._turn = turn;
    //     this._x = x;
    //     this._y = y;
    //     this._availAreas = availAreas.copy();
    //     this.node.removeAllChildren();
    //     for (let x = 0; x < 8; x++) {
    //         for (let y = 0; y < 8; y++) {
    //             let position = cc.v2(x * BLOCKSIZE + BLOCKSIZE / 2, -(y * BLOCKSIZE + BLOCKSIZE / 2));
    //             // where the stone is
    //             if (board[x][y] == 1 || board[x][y] == -1) {
    //                 const stone = cc.instantiate(this.stone);
    //                 this.node.addChild(stone);
    //                 stone.setPosition(position);
    //                 const stoneComponent = stone.getComponent("Stone");
    //                 if (board[x][y] === -1) {
    //                     if (this._boardPrev[x][y] === 1) {
    //                         stoneComponent.setFront(false);
    //                         stoneComponent.flipStone();
    //                     }
    //                     stoneComponent.setFront(true);
    //                 }
    //                 else if (board[x][y] === 1) {
    //                     if (this._boardPrev[x][y] === -1) {
    //                         stoneComponent.setFront(true);
    //                         stoneComponent.flipStone();
    //                     }
    //                     stoneComponent.setFront(false);
    //                 }

    //                 // A place without stones (check if it can be placed)
    //             }
    //             else if (board[x][y] == 0) {
    //                 if (this.isListInArray(availAreas, [x, y])) {
    //                     const avail = cc.instantiate(this.availPrefab);
    //                     this.node.addChild(avail);
    //                     avail.setPosition(position);
    //                 }
    //             }
    //         }
    //     }
    //     this._res = true;
    //     if (x >= 0) {
    //         const RedPoint = cc.instantiate(this.redPointPrefab);
    //         this.node.addChild(RedPoint);
    //         let position = cc.v2(this._x * BLOCKSIZE + BLOCKSIZE / 2, -(this._y * BLOCKSIZE + BLOCKSIZE / 2));
    //         RedPoint.setPosition(position);
    //     }
    //     this._boardPrev = board.copy();
    // },

    draw(board, turn, availAreas, x, y) {
        this._historyMode = false;
        this._turn = turn;
        this._x = x;
        this._y = y;
        this._availAreas = availAreas.copy();
        this.node.removeAllChildren();
        // this._boardPrev = board.copy();

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let position = cc.v2(x * BLOCKSIZE + BLOCKSIZE / 2, -(y * BLOCKSIZE + BLOCKSIZE / 2));

                if (board[x][y] == 1 || board[x][y] == -1) {
                    const stone = cc.instantiate(this.stone);
                    this.node.addChild(stone);
                    stone.setPosition(position);
                    const stoneComponent = stone.getComponent("Stone");

                    if (board[x][y] === -1) {
                        if (this._boardPrev[x][y] === 1) {
                            const smallWhiteStones = [];
                            stoneComponent.setFront(false);
                            stoneComponent.flipStone();
                            // this.smallWhiteDom.addChild(smallWhiteStone);

                            // Create small white stone
                            const smallWhiteStone = cc.instantiate(this.whiteStonePrefab);
                            smallWhiteStone.scale = 0.5;

                            // Convert start position to world position(absolute Position) and convert to relative position for whitedom
                            this.smallWhiteDom.addChild(smallWhiteStone);
                            let worldPosition = this.node.convertToWorldSpaceAR(stone.getPosition());

                            let startPosition = this.smallWhiteDom.convertToNodeSpaceAR(worldPosition);

                            smallWhiteStone.setPosition(startPosition);

                            // Animation for small white stones moving to position A  
                            const targetPosition = cc.v2(0, 0) // Adjust the distance as needed
                            smallWhiteStone.stopAllActions();
                            cc.tween(smallWhiteStone)
                                .to(0.5, { position: targetPosition })
                                .call(() => {
                                    // remove all child
                                    smallWhiteStone.removeFromParent();
                                    // this.smallWhiteDom.addChild(smallWhiteStone);
                                    // smallWhiteStone.opacity = 0; // Make small black stone disappear
                                    smallWhiteStone.destroy();
                                })
                                .start();
                        }
                        stoneComponent.setFront(true);
                    } else if (board[x][y] === 1) {
                        if (this._boardPrev[x][y] === -1) {
                            const smallBlackStones = [];
                            stoneComponent.setFront(true);
                            stoneComponent.flipStone();
                            // this.smallBlackDom.addChild(smallBlackStone);

                            // Create small black stone
                            const smallBlackStone = cc.instantiate(this.blackStonePrefab);
                            smallBlackStone.scale = 0.5;
                            
                            // Convert start position to world position(absolute Position) and convert to relative position for blackdom
                            let worldPosition = this.node.convertToWorldSpaceAR(stone.getPosition());
                            let startPosition = this.smallBlackDom.convertToNodeSpaceAR(worldPosition);
                            this.smallBlackDom.addChild(smallBlackStone);

                            smallBlackStone.setPosition(startPosition);


                            // Animation for Black stones moving to position B
                            const targetPosition = cc.v2(0, 0) // Adjust the distance as needed
                            smallBlackStone.stopAllActions();
                            // smallBlackStones.runAction(cc.moveTo(500, targetPositionB));
                            cc.tween(smallBlackStone)
                                .to(0.5, { position: targetPosition })
                                .call(() => {
                                    // remove all child
                                    smallBlackStone.removeFromParent();
                                    // this.smallBlackDom.addChild(smallBlackStone);
                                    // smallBlackStone.opacity = 0; // Make small black stone disappear
                                    smallBlackStone.destroy();
                                })
                                .start();
                        }
                        stoneComponent.setFront(false);
                    }

                    // // Animation for overturned stones
                    // if (board[x][y] === -1 && this._boardPrev[x][y] === 1) {
                    //     // Animation for black stones moving to position A
                    //     const targetPositionA = cc.v2(-560, -115); // Adjust the distance as needed
                    //     // stone.stopAllActions();
                    //     // stone.runAction(cc.moveTo(500, targetPositionA));

                    //     // Animation for small white stones moving to position A
                    //     const smallWhiteStones = stone.getChildren();
                    //     for (let i = 0; i < smallWhiteStones.length; i++) {
                    //         const smallWhiteStone = smallWhiteStones[i];
                    //         smallWhiteStone.stopAllActions();
                    //         smallWhiteStone.runAction(cc.moveTo(500, targetPositionA));
                    //     }
                    // } else if (board[x][y] === 1 && this._boardPrev[x][y] === -1) {
                    //     // Animation for white stones moving to position B
                    //     const targetPositionB = cc.v2(270, 90); // Adjust the distance as needed
                    //     // stone.stopAllActions();
                    //     // stone.runAction(cc.moveTo(0.5, targetPositionB));

                    //     // Animation for small white stones moving to position B
                    //     const smallBlackStones = stone.getChildren();
                    //     for (let i = 0; i < smallBlackStones.length; i++) {
                    //         const smallBlackStones = smallBlackStones[i];
                    //         smallBlackStones.stopAllActions();
                    //         smallBlackStones.runAction(cc.moveTo(500, targetPositionB));
                    //     }
                    // }
                } else if (board[x][y] == 0) {
                    if (this.isListInArray(availAreas, [x, y])) {
                        const avail = cc.instantiate(this.availPrefab);
                        this.node.addChild(avail);
                        avail.setPosition(position);
                    }
                }
            }
        }

        this._res = true;
        if (x >= 0) {
            const RedPoint = cc.instantiate(this.redPointPrefab);
            this.node.addChild(RedPoint);
            let position = cc.v2(this._x * BLOCKSIZE + BLOCKSIZE / 2, -(this._y * BLOCKSIZE + BLOCKSIZE / 2));
            RedPoint.setPosition(position);
        }
        this._boardPrev = board.copy();
    },

    drawHistory(board, turn, x, y) {
        this._historyMode = true;
        this.node.removeAllChildren();
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let position = cc.v2(x * BLOCKSIZE + BLOCKSIZE / 2, -(y * BLOCKSIZE + BLOCKSIZE / 2));
                // where the stone is
                if (board[x][y] == 1 || board[x][y] == -1) {
                    if (board[x][y] == -1) {
                        const white = cc.instantiate(this.whiteStonePrefab);
                        this.node.addChild(white);
                        white.setPosition(position);
                    }
                    else if (board[x][y] == 1) {
                        const black = cc.instantiate(this.blackStonePrefab);
                        this.node.addChild(black);
                        black.setPosition(position);
                    }
                }
            }
        }
        if (x >= 0) {
            const RedPoint = cc.instantiate(this.redPointPrefab);
            this.node.addChild(RedPoint);
            let position = cc.v2(x * BLOCKSIZE + BLOCKSIZE / 2, -(y * BLOCKSIZE + BLOCKSIZE / 2));
            RedPoint.setPosition(position);
        }
    },

    onTouchStart(event) {
        // Get the position of the click event
        let touchPos = event.getLocation();
        touchPos = this.node.convertToNodeSpaceAR(touchPos);
        let x = Math.floor(touchPos.x / BLOCKSIZE);
        let y = Math.floor(Math.abs(touchPos.y / BLOCKSIZE));
        if (this._res && !this._historyMode && this.isListInArray(this._availAreas, [x, y])) {
            // this._res = false;
            this._x = x
            this._y = y
            ClientCommService.sendClickPosition(this._x, this._y, this._turn);

            // Flip the stones and update the number of stones
            //  this.flipStones(this._x, this._y, this._turn);

            //  this._res = false;
            //  this._click = true;
        }
    },

    // addSmallStone(user) {
    //     console.log("add small stones");
    //     let worldPosition = userPositions[user];
    //     let startPosition;
    //     let smallWhite = cc.instantiate(this.smallWhiteStone);
    //     let smallBlack = cc.instantiate(this.smallStone);
    //     if (this._currentRound === ROUNDS.BIG) {
    //       this.bigDom.addChild(smallWhite);
    //       startPosition = this.bigDom.convertToNodeSpaceAR(cc.v2(worldPosition[0], worldPosition[1]));
    //       this._bigCoins.push(smallWhite);
    //     }
    //     else if (this._currentRound === ROUNDS.SMALL) {
    //       this.smallDom.addChild(coin);
    //       startPosition = this.smallDom.convertToNodeSpaceAR(cc.v2(worldPosition[0], worldPosition[1]));
    //       this._smallCoins.push(coin);
    //     }
    //     coin.setPosition(startPosition);
    //     let targetPosition = cc.v2(Math.floor(Math.random() * 10) * 4 - 20, Math.floor(Math.random() * 10) * 4 - 20);
    //     coin.stopAllActions();
    //     cc.tween(coin)
    //       .to(0.5, { x: targetPosition.x, y: targetPosition.y })
    //       .start();
    //     // console.log("Card removed successfully", this._cardComponents);
    //   },

    isListInArray(arr, list) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].length === list.length && arr[i].every((value, index) => value === list[index])) {
                return true;
            }
        }
        return false;
    }

});