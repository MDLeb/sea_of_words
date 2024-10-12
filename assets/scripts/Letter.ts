import { _decorator, Color, Component, Enum, Label, Node, NodeEventType, Sprite, tween } from 'cc';
import { colorTween } from './helpers/colorTween';
import { GameEvents } from './events/GameEvents';
import { gameEventTarget } from './events/GameEventTarget';
const { ccclass, property } = _decorator;

enum letterStyles {
    DEFAULT, CHOSEN
}

@ccclass('LetterStyle')
class LetterStyle {
    @property({ type: Enum(letterStyles) })
    style: letterStyles = letterStyles.DEFAULT

    @property({ type: Color })
    bgSpriteColor: Color = new Color(255, 255, 255, 255)

    @property({ type: Color })
    letterColor: Color = new Color(80, 80, 80, 255)

}

@ccclass('Letter')
export class Letter extends Component {

    @property({ type: [LetterStyle] })
    letterStyles: LetterStyle[] = []

    _currentStyle: letterStyles = letterStyles.DEFAULT
    _letterValue: string
    _label;
    _bgSprite;


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

        gameEventTarget[fn](GameEvents.LETTER_HOVER, this.onLetterHover, this);
    }

    _setCurrentStyle(style: letterStyles) {
        const currentStyle = this.letterStyles[style];


        this._currentStyle = currentStyle.style;

        colorTween({ duration: 0.3, target: this._bgSprite, targetColor: currentStyle.bgSpriteColor })
        colorTween({ duration: 0.3, target: this._label, targetColor: currentStyle.letterColor })
    }

    onLetterHover(node: Node) {
        if (this.node !== node) return;

        if (this._currentStyle !== letterStyles.CHOSEN) {
            gameEventTarget.emit(GameEvents.LETTER_CHOSEN, this.node);
            this._setCurrentStyle(letterStyles.CHOSEN)
        }

    }

    onLetterCancelled() {
        this._setCurrentStyle(letterStyles.DEFAULT)
    }


}


