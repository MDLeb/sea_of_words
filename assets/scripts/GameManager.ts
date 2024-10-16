import { LevelComplete } from './LevelComplete';
import { _decorator, Camera, Component, JsonAsset, Node, gfx } from 'cc';
import { LettersCircle } from './LettersCircle';
import { WordsBoard } from './WordsBoard';
import { GameEvents } from './events/GameEvents';
import { gameEventTarget } from './events/GameEventTarget';
import { Input } from './input/Input';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(JsonAsset)
    levels: JsonAsset[] = []

    @property(Node)
    lettersCircle: Node

    @property(Node)
    wordsBoard: Node

    @property(Node)
    input: Node

    @property(Camera)
    levelCamera: Camera;

    @property(Camera)
    uiCamera: Camera;

    @property(Node)
    levelComplete: Node


    _activeLevel: JsonAsset;
    _levelLabelCounter: number = 1;

    protected onEnable(): void {
        this._activeLevel = this.levels[0];
        this._changeLevel();
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.LEVEL_COMPLETE, this.onLevelComplete, this);
    }

    onLevelComplete() {
        const currentLevel = this.levels.indexOf(this._activeLevel);
        if (currentLevel < this.levels.length - 1) {
            this._activeLevel = this.levels[currentLevel + 1]
        } else {
            this._activeLevel = this.levels[0]
        };

        this.levelCamera.enabled = false;
        this.levelComplete.active = true;
        this.uiCamera.clearFlags = gfx.ClearFlagBit.COLOR;

        this.levelComplete.getComponent(LevelComplete).setLevel(this._levelLabelCounter, () => {

            this.levelComplete.active = false;
            this.levelCamera.enabled = true;
            this.uiCamera.clearFlags = gfx.ClearFlagBit.NONE;
            this._levelLabelCounter += 1;


            this._clearLevel();
            this._changeLevel();
        })

    }

    _clearLevel() {
        this.lettersCircle.getComponent(LettersCircle).reset();
        this.wordsBoard.getComponent(WordsBoard).reset();
    }

    _changeLevel() {
        const letters = this._getLevelsLetters();

        this.lettersCircle.getComponent(LettersCircle).setLetters(letters);
        this.wordsBoard.getComponent(WordsBoard).setWords(this._activeLevel.json.words);
        this.input.getComponent(Input).updateLevel();
        gameEventTarget.emit(GameEvents.LEVEL_CHANGED, this._levelLabelCounter)
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


