import { _decorator, CCFloat, Component, instantiate, Node, Prefab, v3 } from 'cc';
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
        if(!word) return;
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
        } else {
            gameEventTarget.emit(GameEvents.WORD_INCORRECT);
        }
    }

    setWords(words: string[]) {
        this._words = words;
        words.forEach((word: string, i: number) => {
            const wordNode = instantiate(this.wordPrefab);
            this.node.addChild(wordNode);
            const wordComponent = wordNode.getComponent(Word);
            wordComponent.setWord(word);
            this._wordsNodes.push(wordComponent);

            wordNode.position = v3(0, i * this.gap, 0);
        })
    }

    _checkInput(word: string) {
        return this._words.findIndex(i => i === word) >= 0
    }

}


