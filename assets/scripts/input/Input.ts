import { _decorator, Component, EventTouch, math, Node, NodeEventType, UITransform, v2, v3, Vec2 } from 'cc';
import { traverse } from '../helpers/traverse';
import { gameEventTarget } from '../events/GameEventTarget';
import { GameEvents } from '../events/GameEvents';
import { Letter } from '../Letter';
const { ccclass, property } = _decorator;

@ccclass('Input')
export class Input extends Component {

    _children: Node[] = [];

    protected onEnable(): void {
        this._subscribeEvents(true);
        this.updateLevel();
    }

    updateLevel() {
        this._children = [];
        traverse(this.node, (child: Node) => { child.name === 'Letter' && this._children.push(child) });

    }

    protected onDisable(): void {
        this._subscribeEvents(false)

    }

    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        this.node[fn](NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.node[fn](NodeEventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node[fn](NodeEventType.TOUCH_END, this.onTouchCancel, this);
        this.node[fn](NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchStart(e: EventTouch) {

    }

    onTouchMove(event: EventTouch) {
        gameEventTarget.emit(GameEvents.INPUT_MOVE, event);
        const touchLocation = event.getUILocation();

        this._children.forEach(child => {
            
            const uiTransform = child.getComponent(UITransform);
            if (!uiTransform) return;
            const radius = (uiTransform.width / 2) * child.parent.parent.scale.x;

            const worldPosition = child.getWorldPosition();
            const distance = Math.sqrt(Math.pow(worldPosition.x - touchLocation.x, 2) + Math.pow(worldPosition.y - touchLocation.y, 2));
            if (distance <= radius) {
                gameEventTarget.emit(GameEvents.LETTER_HOVER, child);
            }
        });
    }

    onTouchCancel() {
        gameEventTarget.emit(GameEvents.INPUT_END);
    }
}



