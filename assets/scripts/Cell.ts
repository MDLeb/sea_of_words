import { _decorator, Color, Component, Enum, Label, Node, Sprite } from 'cc';
import { colorTween } from './helpers/colorTween';
const { ccclass, property } = _decorator;

export enum CellStyles {
    HIDDEN, REVEALED, DYNAMIC, INCORRECT
}

@ccclass('CellStyle')
class CellStyle {
    @property({ type: Enum(CellStyles) })
    style: CellStyles = CellStyles.HIDDEN

    @property({ type: Color })
    bgSpriteColor: Color = new Color(255, 255, 255, 255)

    @property({ type: Color })
    letterColor: Color = new Color(80, 80, 80, 255)

}

@ccclass('Cell')
export class Cell extends Component {
    @property({ type: [CellStyle] })
    cellStyles: CellStyle[] = []

    _bgSprite: Sprite;
    _label: Label;
    _currentStyle: CellStyles = CellStyles.HIDDEN
    _letterValue: string

    protected onEnable(): void {
        this._bgSprite = this.node.getComponent(Sprite);
        this._label = this.node.getComponentInChildren(Label);
        this._setCurrentStyle(this._currentStyle, 0.01);
    }

    setValue(letter: string) {
        this._letterValue = letter;
        this._label.string = letter;
    }

    setStyle(style: CellStyles) {
        this._currentStyle = style;
        this._setCurrentStyle(style);
    }


    _setCurrentStyle(style: CellStyles, duration: number = 0.3) {
        const currentStyle = this.cellStyles[style];

        if (this._currentStyle !== style) {
            this._currentStyle = currentStyle.style;
        }

        colorTween({ duration, target: this._bgSprite, targetColor: currentStyle.bgSpriteColor });
        colorTween({ duration, target: this._label, targetColor: currentStyle.letterColor });
    }
}


