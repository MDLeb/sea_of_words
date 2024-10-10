import { _decorator, CCFloat, Component, instantiate, Node, Prefab, v3 } from 'cc';
import { Word } from './Word';
const { ccclass, property } = _decorator;

@ccclass('WordsBoard')
export class WordsBoard extends Component {
    
    @property(Prefab)
    wordPrefab: Prefab | null = null

    @property(CCFloat)
    gap: number = 100;


    _words: string[] = [];
    _wordsNodes: Node[] = [];

    setWords(words: string[]) {
        this._words = words;
        words.forEach((word: string, i: number) => {
            const wordNode = instantiate(this.wordPrefab);
            this.node.addChild(wordNode);
            wordNode.getComponent(Word).setWord(word);

            wordNode.position = v3(0, i * this.gap, 0);

        })

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


