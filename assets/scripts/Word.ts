import { _decorator, CCFloat, Component, Enum, instantiate, Label, Node, Prefab, v3 } from 'cc';
import { gameEventTarget } from './events/GameEventTarget';
import { GameEvents } from './events/GameEvents';
import { Cell, CellStyles } from './Cell';
const { ccclass, property } = _decorator;

export enum WordStates {
    REVEALED, HIDDEN
}

@ccclass('Word')
export class Word extends Component {

    @property(Prefab)
    cellPrefab: Prefab | null = null

    @property(CCFloat)
    gap: number = 5;

    _word: string;
    _state: WordStates = WordStates.HIDDEN
    _cells: Cell[] = [];


    protected onEnable(): void {
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.WORD_CORRECT, this.onWordCorrect, this);
    }

    setWord(word: string) {
        this._word = word;

        word.split('').forEach((l: string, i: number) => {
            const cell = instantiate(this.cellPrefab);
            const cellComponent = cell.getComponent(Cell);
            this.node.addChild(cell);

            cellComponent.setValue(l);
            this._cells.push(cellComponent);

            cell.position = v3(i * this.gap, 0, 0);
        })
    }

    getWord() {
        return this._word;
    }

    getState() {
        return this._state;
    }

    setState(state: WordStates) {
        this._state = state;
    }

    onWordCorrect(node: Node) {
        if (this.node !== node) return;

        this._state = WordStates.REVEALED;
        this._setCellsStyle(CellStyles.REVEALED);


    }

    _setCellsStyle(style: CellStyles) {
        this._cells.forEach((c: Cell) => {
            c.setStyle(style);
        })
    }
}


