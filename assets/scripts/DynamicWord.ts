import { _decorator, CCFloat, Component, instantiate, Node, Prefab, v3 } from 'cc';
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

    protected onEnable(): void {
        this._subscribeEvents(true);
    }
    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.WORD_CHANGED, this.onWordChanged, this);
        gameEventTarget[fn](GameEvents.WORD_CORRECT, this.onWordCorrect, this);
        gameEventTarget[fn](GameEvents.WORD_INCORRECT, this.onWordIncorrect, this);

    }

    onWordChanged(word: string) {
        this._updateCells(word);
    }

    onWordCorrect() {

    }

    onWordIncorrect() {

    }

    _updateCells(word: string) {
        this._word = word;
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
                cellComponent.setStyle(CellStyles.DYNAMIC);

                this._cells.push(cellComponent);
                cell.position = v3(i * this.gap, 0, 0);
            }
        });
    }
}


