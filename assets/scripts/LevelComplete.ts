import { _decorator, Component, Label, Node, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelComplete')
export class LevelComplete extends Component {
    _btn: Node;
    _text: Node;
    _btnCb: Function;

    protected onEnable(): void {
        this._btn = this.node.getChildByName('Btn');
        this._text = this.node.getChildByName('Text');

    }

    setLevel(currentLevel: number, cb: Function) {
        console.log(currentLevel);

        const btnLabel = this._btn.getComponentInChildren(Label);
        (btnLabel.string = `Уровень ${currentLevel + 1}`);
        cb && this._btn.once(NodeEventType.TOUCH_START, cb, this);

        const textLabel = this._text.getChildByName('Label_top').getComponent(Label);
        (textLabel.string = `Уровень ${currentLevel} пройден`)
    }




}


