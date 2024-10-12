import { _decorator, CCFloat, Component, instantiate, Node, Prefab, v3, geometry, Line, Graphics, Vec3, EventTouch } from 'cc';
import { Letter } from './Letter';
import { gameEventTarget } from './events/GameEventTarget';
import { GameEvents } from './events/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('LettersCircle')
export class LettersCircle extends Component {

    @property(Prefab)
    letterPrefab: Prefab | null = null

    @property(CCFloat)
    radius: number = 0.1

    _letters: string[] = [];
    _lettersNodes: Node[] = [];
    _lettersParentNode: Node;

    _dynamicWord: Node[] = [];

    protected onEnable(): void {
        this._subscribeEvents(true);
    }
    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.LETTER_CHOSEN, this.onLetterChosen, this);
    }

    setLetters(letters: string[]) {
        this._lettersParentNode = this.node.getChildByName('letters_node');
        this._letters = letters;
        letters.forEach((letter: string, i: number) => {
            const letterNode = instantiate(this.letterPrefab);
            this._lettersParentNode.addChild(letterNode);


            const angle = Math.PI * (0.5 + (2 / letters.length * i));
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;

            letterNode.position = v3(x, y, 0);

            letterNode.getComponent(Letter).setValue(letter);
        })
    }

    getWorld() {
        return this._dynamicWord
            .map((node) => node.getComponent(Letter).getValue())
            .reduce((a, b) => a + b);
    }

    onLetterChosen(node: Node) {
        const length = this._dynamicWord.length;
       

        if (!length) {
            this._dynamicWord.push(node);
        } else if (this._dynamicWord[length - 2] === node) {
            this._dynamicWord.length--;
        } else {
            this._dynamicWord.push(node)
        }

        console.log(this.getWorld());

    }
}


