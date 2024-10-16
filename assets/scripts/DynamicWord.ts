import { _decorator, CCFloat, Component, instantiate, Node, Prefab, v3, Animation, Sprite, tween } from 'cc';
import { gameEventTarget } from './events/GameEventTarget';
import { GameEvents } from './events/GameEvents';
import { Cell, CellStyles } from './Cell';
const { ccclass, property } = _decorator;

@ccclass('DynamicWord')
export class DynamicWord extends Component {

    @property(Prefab)
    cellPrefab: Prefab | null = null

    @property(CCFloat)
    gap: number = 100;


    _letters: Node[] = [];
    _word: string;
    _cells: Cell[] = [];
    _skipUpdate: boolean = false;

    protected onEnable(): void {
        this._subscribeEvents(true);
    }
    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.WORD_CORRECT, this.onWordCorrect, this);
        gameEventTarget[fn](GameEvents.WORD_INCORRECT, this.onWordIncorrect, this);
        gameEventTarget[fn](GameEvents.WORD_CHANGED, this.onWordChanged, this);

    }

    onWordChanged(word: string) {
        this._word = word;
        this.scheduleOnce(() => {
            this._updateCells(word);
        });
    }

    onWordCorrect() {

    }

    onWordIncorrect() {
        this._skipUpdate = true;
        // this.node.getComponent(Animation).play('shake_node');
       
        this._cells.forEach((i: Cell) => {
            i.setStyle(CellStyles.INCORRECT, 0.05)
            this.scheduleOnce(() => {
                i.setStyle(CellStyles.DYNAMIC, 0.05)
            }, 0.15);
        })

        this.scheduleOnce(() => {
            this._skipUpdate = false;
            this._updateCells(this._word);
        }, 0.3);
    }

    _updateCells(word: string) {
        if (this._skipUpdate) return;
        const wordLetters = word.split('');

        while (this._cells.length > word.length) {
            const cellNode = this._cells.pop();
            this.node.removeChild(cellNode.node);
        }

        wordLetters.forEach((l: string, i: number) => {
            if (this._cells[i]) {
                this._cells[i].setValue(l);
            } else {
                const cell = instantiate(this.cellPrefab);
                const cellComponent = cell.getComponent(Cell);
                this.node.addChild(cell);

                cellComponent.setValue(l);
                cellComponent.setStyle(CellStyles.DYNAMIC,  0.05);

                this._cells.push(cellComponent);
            }

            this._cells[i].node.position = v3(i * this.gap - (wordLetters.length - 1) * this.gap / 2, 0, 0);

        });
    }
}


