import { MESSAGE_TYPE } from "./Common/Messages";
import { ServerCommService } from "./Common/CommServices";
import { GameScene } from "./GameScene";

export const ClientCommService = {
    onExtensionResponse(event) {
        const messageType = event.cmd;
        const params = event.params;

        // console.log("C - onExtensionResponse", event.cmd, event.params);

        switch (messageType) {
            case MESSAGE_TYPE.SC_START_GAME:
                GameScene.start1();
                break;
            case MESSAGE_TYPE.SC_DRAW_BOARD:
                GameScene.drawBoard(params.board, params.turn, params.availAreas, params.x, params.y, params.missionEndFlag);
                break;
            case MESSAGE_TYPE.SC_POINTS:
                GameScene.setScore(params.blackStoneNum, params.whiteStoneNum);
                break;
            case MESSAGE_TYPE.SC_END_MISSION:
                GameScene.showEndModal(params.blackScore, params.whiteScore, params.missionScore);
                break;
            case MESSAGE_TYPE.SC_END_GAME:
                GameScene.showEndModal(params.blackScore, params.whiteScore, params.missionScore);
                break;
            case MESSAGE_TYPE.SC_DRAW_HISTORY:
                GameScene.drawHistoryBoard(params.board, params.turn, params.x, params.y, params.blackStoneNum, params.whiteStoneNum, params.step, params.availAreas);
                break;
        }
    },

    send(messageType, data, room) {
        ServerCommService.onReceiveMessage(messageType, data, room);
    },

    sendClickPosition(x, y, turn) {
        this.send(MESSAGE_TYPE.CS_PUT_STONE, { x, y, turn }, 1);
    },

    sendRestartMission() {
        this.send(MESSAGE_TYPE.CS_RESTART_MISSION, {}, 1);
    },

    sendClaimHistory(step) {
        this.send(MESSAGE_TYPE.CS_PLAY_HISTORY, { step }, 1);
    },

    sendRestartGame() {
        this.send(MESSAGE_TYPE.CS_RESTART_GAME, {}, 1);
    }
};
