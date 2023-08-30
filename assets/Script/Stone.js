import GlobalData from "./Common/GlobalData";

cc.Class({
    extends: cc.Component,

    properties: {
        mainButton: cc.Button,
        frontSprite: cc.Sprite,
        backSprite: cc.Sprite,
        progressSprite: cc.Sprite,

        _isFront: [],
        _timeLimit: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.progressSprite.node.active = false;
        // this.backSprite.spriteFrame =
        //   GlobalData.imgAtlas.getSpriteFrame("cards-back");

        // this.setSelected(false);
        // this.setGroup(-1);
    },

    isFront() {
        return this._isFront;
    },

    setFront(isFront) {
        this._isFront = isFront;
        if (isFront) {
            this.frontSprite.node.setScale(1, 1);
            this.backSprite.node.setScale(0, 1);
        } else {
            this.frontSprite.node.setScale(0, 1);
            this.backSprite.node.setScale(1, 1);
        }
    },

    getScale() {
        return this.node.scale;
    },

    setScale(scale) {
        this.node.scale = scale;
    },

    setRotation(rotation) {
        this.node.angle = rotation;
    },

    getPosition() {
        return this.node.position;
    },

    startCountdown(timeLimit) {
        this.progressSprite.fillRange = 1;
        if (timeLimit) {
            this._timeLimit = timeLimit;
        }
        this.progressSprite.node.active = true;
    },

    stopCountdown() {
        // this.progressSprite.node.active = false;
    },

    isShowingProgressBar() {
        return this.progressSprite.node.active;
    },

    flipStone() {
        // this.startCountdown(1);
        // this.setSelected(false);
        // const spinAnim = cc.tween().by(0.5, { angle: 200 })
        this.progressSprite.node.active = true;
        cc.tween(this.progressSprite.node)
            .to(0.5, { angle: -235 })
            .start();

        if (this._isFront) {
            this.backSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
            this.frontSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
            this.backSprite.node.runAction(
                cc.sequence(new cc.delayTime(0.2), new cc.scaleTo(0.2, 1, 1))
            );
            this._isFront = false;
        } else {
            this.frontSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
            this.backSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
            this.frontSprite.node.runAction(
                cc.sequence(new cc.delayTime(0.2), new cc.scaleTo(0.2, 1, 1))
            );
            this._isFront = true;
        }
        // this.stopCountdown();
        setTimeout(()=>{
            this.progressSprite.node.active = false;
            // this.createSmallStones(); // Call the function to create smaller stones
        }, 500);    
    },

    // flipStone() {
    //     this.progressSprite.node.active = true;
    //     cc.tween(this.progressSprite.node)
    //       .to(0.5, { angle: -235 })
    //       .start();
      
    //     if (this._isFront) {
    //       this.backSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
    //       this.frontSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
    //       this.backSprite.node.runAction(
    //         cc.sequence(
    //           new cc.delayTime(0.2),
    //           new cc.scaleTo(0.2, 1, 1)
    //         )
    //       );
    //       this._isFront = false;
    //     } else {
    //       this.frontSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
    //       this.backSprite.node.runAction(new cc.scaleTo(0.2, 0, 1));
    //       this.frontSprite.node.runAction(
    //         cc.sequence(
    //           new cc.delayTime(0.2),
    //           new cc.scaleTo(0.2, 1, 1)
    //         )
    //       );
    //       this._isFront = true;
    //     }
      
    //     setTimeout(() => {
    //         this.progressSprite.node.active = false;
    //         // const smallerStones = cc.instantiate(this.smallstonesPrefab);
    //         // smallerStones.scale = 0.5; // Set the scale of smaller stones to 0.5
    //         // const smallerStonesPosition = this.node.position.add(cc.v2(0, 50)); // Adjust the distance by modifying the y-coordinate (50 in this example)
    //         // smallerStones.setPosition(smallerStonesPosition);
    //         // this.node.addChild(smallerStones);
          
    //         // Check if the flipped stone is black or white
    //         // if (this._isFront) {
    //         //   // If the flipped stone is black, create smaller white stones on top of the overturned white stones
    //         //   const smallerWhiteStones = cc.instantiate(this.frontSprite);
    //         //   smallerWhiteStones.scale = 0.5; // Set the scale of smaller white stones to 0.5
          
    //         //   // Iterate through each child node of the current node
    //         //   this.node.children.forEach((child) => {
    //         //     const stoneComponent = child.getComponent(Stone);
    //         //     if (stoneComponent && stoneComponent.isFront) {
    //         //       // If the child node represents an overturned white stone, create a smaller white stone on top of it
    //         //       const smallerStone = cc.instantiate(this.frontSprite);
    //         //       smallerStone.setPosition(child.position);
    //         //       child.addChild(smallerStone);
    //         //     }
    //         //   });
    //         // } else {
    //         //   // If the flipped stone is white, create smaller black stones on top of the overturned black stones
    //         //   const smallerBlackStones = cc.instantiate(this.backSprite);
    //         //   smallerBlackStones.scale = 0.5; // Set the scale of smaller black stones to 0.5
          
    //         //   // Iterate through each child node of the current node
    //         //   this.node.children.forEach((child) => {
    //         //     const stoneComponent = child.getComponent(Stone);
    //         //     if (stoneComponent && !stoneComponent.isFront) {
    //         //       // If the child node represents an overturned black stone, create a smaller black stone on top of it
    //         //       const smallerStone = cc.instantiate(this.backSprite);
    //         //       smallerStone.setPosition(child.position);
    //         //       child.addChild(smallerStone);
    //         //     }
    //         //   });
    //         // }
    //       }, 500);
    //   },
    onUserClick() {
    },

    update(dt) {
    },
});
