import { ClientCommService } from "./ClientCommService"

cc.Class({
    extends: cc.Component,

    properties: {
        ModalText: {
            default: null,
            type: cc.Label,
        },
        ModalButton: {
            default: null,
            type: cc.Button,
        },
        ModalTitle: {
            default: null,
            type: cc.Label,
        },
        ModaScore: {
            default: null,
            type: cc.Label,
        },
        
    },
    onLoad() {
    },

    setText(blackScore, whiteScore) {
        if (blackScore > whiteScore) {
            this.ModalText.string = "Black Win!"
        } else if (whiteScore > blackScore) {
            this.ModalText.string = "White Win!"
        } else {
            this.ModalText.string = "Draw!"
        }
    },

    onClick() {
        ClientCommService.sendRestartMission();
        this.node.active = false;
    }

})