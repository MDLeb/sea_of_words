import { _decorator, Camera, Component, Node, view, screen, v3, CCFloat, CCInteger, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraSet')
class CameraSet {
    @property(CCFloat)
    aspect: number = 0;

    @property(CCInteger)
    landscapeOrthoHeight: number = 1000

    @property(CCInteger)
    portraitOrthoHeight: number = 1000

}


@ccclass('GameplayCamera')
export class GameplayCamera extends Component {

    @property([CameraSet])
    cameraSettings: CameraSet[] = [];

    _camera: Camera;

    protected onEnable(): void {
        this._camera = this.node.getComponent(Camera)
        this._onCanvasResize();
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func: string = isOn ? 'on' : 'off';

        view[func]('canvas-resize', this._onCanvasResize, this);
    }

    _onCanvasResize() {
        const { height, width } = screen.windowSize

        const aspect = (Math.max(width, height) / Math.min(width, height));
        const landscape = width > height;

        const cameraSet = this.cameraSettings.find((s: CameraSet) => aspect > s.aspect);

        this.scheduleOnce(() => {
             if (!cameraSet) return;
        this._camera.orthoHeight =
            landscape
                ? cameraSet.landscapeOrthoHeight
                : cameraSet.portraitOrthoHeight
        }, 0.1)
       


        // this._camera.node.position = v3(
        //     landscape ? 380 : 0,
        //     landscape ? -95 : -10,
        //     1000
        // )
    }

}


