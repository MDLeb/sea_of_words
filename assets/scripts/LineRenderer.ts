import { _decorator, Component, Graphics, geometry, v3, Vec3, Node, EventTouch, Vec2, UITransform } from 'cc';
import { gameEventTarget } from './events/GameEventTarget';
import { GameEvents } from './events/GameEvents';
const { ccclass, property } = _decorator;
const { SplineMode, Spline } = geometry;

@ccclass('LineRenderer')
export class LineRenderer extends Component {

    _line: Graphics;
    _pointerPosition: Vec3;
    _curve: geometry.Spline = Spline.create(SplineMode.CATMULL_ROM);
    _knotsSet: Set<Vec3> = new Set();
    _uiTransform: UITransform;

    protected onEnable(): void {
        this._line = this.node.getComponent(Graphics);
        this._uiTransform = this.node.getComponent(UITransform);
        this._subscribeEvents(true);
    }
    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.INPUT_MOVE, this.onInputMove, this);
        gameEventTarget[fn](GameEvents.INPUT_END, this.onInputEnd, this);
        gameEventTarget[fn](GameEvents.LETTER_CHOSEN, this.onLetterChosen, this);
    }

    onInputEnd() {
        this._knotsSet.clear();
        this._curve.clearKnots();
        this._updateLine();
    }

    onLetterChosen(letterNode: Node) {
        const point = letterNode.position;
        if (!point) return;

        if (this._knotsSet.has(point)) {
            const sameKnot = this._curve.knots.find(i => i.equals(point))
            const index = this._curve.knots.indexOf(sameKnot)
            if (index === this._curve.getKnotCount() - 3) {
                this._removePrevKnot(index + 1, point);
            }
            return;
        };

        this._curve.insertKnot(this._curve.getKnotCount() - 1, point);
        this._knotsSet.add(point);
    }

    onInputMove(event: EventTouch) {
        if (!event.getUILocation) return;

        const { x, y } = event.getUILocation();
        this._pointerPosition = this._uiTransform.convertToNodeSpaceAR(v3(x, y, 0));

        if (!this._curve.getKnotCount()) {
            this._curve.addKnot(this._pointerPosition);
        } else {
            this._curve.setKnot(this._curve.getKnotCount() - 1, this._pointerPosition);
        }

        this._updateLine();
    }

    _removePrevKnot(index: number, point: Vec3) {
        this._knotsSet.delete(point);
        this._curve.removeKnot(index);
    }

    _updateLine() {
        if (!this._line) return;

        const points = this._curve.getPoints(this._curve.getKnotCount() * 5);
        this._line.clear();
        points.forEach((point: Vec3, i: number) => {
            const { x, y } = point;
            if (i === 0) {
                this._line.moveTo(x, y);
            } else if (i === points.length - 1) {
                this._line.lineTo(x, y);
                this._line.stroke();
            } else {
                this._line.lineTo(x, y);
            }
        });
    }



}


