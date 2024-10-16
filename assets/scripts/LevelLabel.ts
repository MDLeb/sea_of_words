import { _decorator, Component, Label, Node } from 'cc';
import { GameEvents } from './events/GameEvents';
import { gameEventTarget } from './events/GameEventTarget';
const { ccclass, property } = _decorator;

@ccclass('LevelLabel')
export class LevelLabel extends Component {

    _label: Label;

    protected onEnable(): void {
        this._label = this.node.getComponentInChildren(Label)
        this._subscribeEvents(true)
    }

    protected onDisable(): void {
        this._subscribeEvents(false)

    }
    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.LEVEL_CHANGED, this.levelChanged, this);
    }

    levelChanged(levelCount: number) {
        this._label.string = `Уровень ${levelCount}`;
    }
}


