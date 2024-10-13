import { _decorator, Color, Component, Enum, Label, Node, NodeEventType, Sprite, tween } from 'cc';
import { colorTween } from './helpers/colorTween';
import { GameEvents } from './events/GameEvents';
import { gameEventTarget } from './events/GameEventTarget';
const { ccclass, property } = _decorator;

enum LetterStyles {
    DEFAULT, CHOSEN
}

@ccclass('LetterStyle')
class LetterStyle {
    @property({ type: Enum(LetterStyles) })
    style: LetterStyles = LetterStyles.DEFAULT

    @property({ type: Color })
    bgSpriteColor: Color = new Color(255, 255, 255, 255)

    @property({ type: Color })
    letterColor: Color = new Color(80, 80, 80, 255)

}

@ccclass('Letter')
export class Letter extends Component {

    @property({ type: [LetterStyle] })
    letterStyles: LetterStyle[] = []

    _currentStyle: LetterStyles = LetterStyles.DEFAULT
    _letterValue: string
    _label: Label;
    _bgSprite: Sprite;


    protected onEnable(): void {
        this._label = this.node.getComponentInChildren(Label);
        this._bgSprite = this.node.getComponent(Sprite);
        this._subscribeEvents(true);
    }
    protected onDisable(): void {
        this._subscribeEvents(false);

    }

    setValue(letter: string) {
        this._letterValue = letter;
        this._label.string = letter.toUpperCase();
    }
    getValue() {
        return this._letterValue
    }


    _subscribeEvents(subscribe: boolean) {
        const fn = subscribe ? "on" : "off";

        gameEventTarget[fn](GameEvents.LETTER_CHOSEN, this.onLetterChosen, this);
        gameEventTarget[fn](GameEvents.LETTER_CANCELLED, this.onLetterCancelled, this);
    }

    _setCurrentStyle(style: LetterStyles) {
        const currentStyle = this.letterStyles[style];
        this._currentStyle = currentStyle.style;

        colorTween({ duration: 0.3, target: this._bgSprite, targetColor: currentStyle.bgSpriteColor })
        colorTween({ duration: 0.3, target: this._label, targetColor: currentStyle.letterColor })
    }

    onLetterChosen(node: Node) {
        if (this.node !== node) return;

        if (this._currentStyle !== LetterStyles.CHOSEN) {
            this._setCurrentStyle(LetterStyles.CHOSEN)
        }
    }

    onLetterCancelled(node: Node) {
        if (this.node !== node) return;

        if (this._currentStyle !== LetterStyles.DEFAULT) {
            this._setCurrentStyle(LetterStyles.DEFAULT)
        }
    }
}


