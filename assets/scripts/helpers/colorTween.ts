import { Sprite, Color, tween } from 'cc';
export const colorTween = (params: {
    duration: number,
    target: Sprite,
    targetColor: Color
}) => {
    const { duration, target, targetColor } = params
    if (!duration || !target || !targetColor) return;

    const colorObj = {
        r: target.color.r,
        g: target.color.g,
        b: target.color.b,
        a: target.color.a
    };

    tween(colorObj)
        .to(duration, { r: targetColor.r, g: targetColor.g, b: targetColor.b, a: targetColor.a }, {
            onUpdate: () => {
                target.color = new Color(colorObj.r, colorObj.g, colorObj.b, colorObj.a);
            }
        })
        .start();

}