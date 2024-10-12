import { _decorator, Component, JsonAsset, Node } from 'cc';
import { LettersCircle } from './LettersCircle';
import { WordsBoard } from './WordsBoard';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(JsonAsset)
    levels: JsonAsset[] = []

    @property(Node)
    lettersCircle: Node

    @property(Node)
    wordsBoard: Node

    _activeLevel: JsonAsset;

    protected onEnable(): void {
        this._activeLevel = this.levels[0];
        this._changeLevel()
    }

    _changeLevel() {
        const letters = this._getLevelsLetters();
        const words = this._getLevelsLetters()
        this.lettersCircle.getComponent(LettersCircle).setLetters(letters);
        this.wordsBoard.getComponent(WordsBoard).setWords(this._activeLevel.json.words);
    }

    _getLevelsLetters() {
        const { words } = this._activeLevel.json;
        const uniqueLetters: string[] = Array.from(new Set(words.join('').split('')));
        words.forEach((w: string) => {
            const wordsLetters = w.split('')
            wordsLetters.forEach((l: string) => {
                const counter1 = wordsLetters.filter(j => j === l).length;
                const counter2 = uniqueLetters.filter(j => j === l).length;

                if (counter1 > counter2) {
                    uniqueLetters.push(...`${l}`.repeat(counter1 - counter2).split(''))
                }
            });
        });

        return uniqueLetters;
    }

    

}


