import { _decorator, CCFloat, Component, instantiate, Node, Prefab, v3 } from 'cc';
import { Letter } from './Letter';
const { ccclass, property } = _decorator;

@ccclass('LettersCircle')
export class LettersCircle extends Component {

    @property(Prefab)
    letterPrefab: Prefab | null = null

    @property(CCFloat)
    radius: number = 0.1

    _letters: string[] = [];
    _lettersNodes: Node[] = [];

    setLetters(letters: string[]) {
        this._letters = letters;
        letters.forEach((letter: string, i: number) => {
            const letterNode = instantiate(this.letterPrefab);
            this.node.addChild(letterNode);
            console.log(letterNode);
            

            const angle = Math.PI * (0.5 + (2 / letters.length * i));
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;

            letterNode.position = v3(x, y, 0);

            letterNode.getComponent(Letter).setValue(letter);
        })

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


