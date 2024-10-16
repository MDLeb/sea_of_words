import { _decorator, CCFloat, Component, instantiate, Prefab, v3 } from 'cc';
import { Word, WordStates } from './Word';
import { GameEvents } from './events/GameEvents';
import { gameEventTarget } from './events/GameEventTarget';
const { ccclass, property } = _decorator;

@ccclass('WordsBoard')
export class WordsBoard extends Component {

    @property(Prefab)
    wordPrefab: Prefab | null = null

    @property(CCFloat)
    gap: number = 100;


    _words: string[] = [];
    _wordsNodes: Word[] = [];
    _actualWord: Word | undefined;

    _columns: number = 1;

    protected onEnable(): void {
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.WORD_CHANGED, this.onWordChanged, this);
        gameEventTarget[fn](GameEvents.INPUT_END, this.onInputEnd, this);
    }

    onWordChanged(word: string) {
        if (!word) return;
        const isWordExists = this._checkInput(word);

        if (isWordExists) {
            this._actualWord = this._wordsNodes.find((w: Word) => w.getWord() === word && w.getState() === WordStates.HIDDEN);
        } else {
            this._actualWord = null
        };
    }

    onInputEnd() {
        if (this._actualWord) {
            gameEventTarget.emit(GameEvents.WORD_CORRECT, this._actualWord.node);
            if (!this._checkIfWordsLeft()) {
                gameEventTarget.emit(GameEvents.LEVEL_COMPLETE);
            }
        } else {
            gameEventTarget.emit(GameEvents.WORD_INCORRECT);
        }
        this._actualWord = null;
    }

    setWords(words: string[]) {
        this._words = words.sort((a: string, b: string) => a.length - b.length);

        const totalWords = words.length;
        const halfCount = Math.ceil(totalWords / 2);

        words.forEach((word: string, i: number) => {
            const wordNode = instantiate(this.wordPrefab);
            this.node.addChild(wordNode);
            const wordComponent = wordNode.getComponent(Word);
            wordComponent.setWord(word);
            this._wordsNodes.push(wordComponent);

            //делим на два столбца, если много слов
            if (words.length > 6) {
                this._columns = 2
                const column = i < halfCount ? 0 : 1;
                const row = i % halfCount;

                const xOffset = (column === 0) ? -this.gap * 2.3 : this.gap * 1.9;
                wordNode.position = v3(xOffset, (0.5 + row) * -1 * this.gap, 0);
            } else {
                this._columns = 1;
                wordNode.position = v3(0, (0.5 + i) * -1 * this.gap, 0);
            }
        });
    }

    reset() {
        this._wordsNodes.forEach((word: Word) => this.node.removeChild(word.node));
        this._wordsNodes = [];
    }

    _checkInput(word: string) {
        return this._words.findIndex(i => i === word) >= 0
    }

    _checkIfWordsLeft(): boolean {
        return this._wordsNodes.some((w: Word) => w.getState() === WordStates.HIDDEN);
    }

}


