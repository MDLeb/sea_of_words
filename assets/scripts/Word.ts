import { _decorator, CCFloat, Component, instantiate, Label, Node, Prefab, v3 } from 'cc';
import { gameEventTarget } from './events/GameEventTarget';
import { GameEvents } from './events/GameEvents';
const { ccclass, property } = _decorator;

enum wordStates {
    HIDDEN, SHOWN
}

@ccclass('Word')
export class Word extends Component {

    @property(Prefab)
    cellPrefab: Prefab | null = null

    @property(CCFloat)
    gap: number = 5;

    _word: string;
    _state: wordStates.HIDDEN

    setWord(word: string) {
        this._word = word;

        word.split('').forEach((l: string, i: number) => {
            const cell = instantiate(this.cellPrefab);
            cell.getComponentInChildren(Label).string = l;

            this.node.addChild(cell);

            cell.position = v3(i * this.gap, 0, 0);
        })
    }

    protected onEnable(): void {

    }

    protected onDisable(): void {


    }

    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.WORD_CORRECT, this.onWordCorrect, this);
    }

    onWordCorrect() {

    }
}


