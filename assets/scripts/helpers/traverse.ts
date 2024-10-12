import {Node} from 'cc';

export const traverse = (node: Node, callback: Function) => {
    callback(node);
    node.children.forEach(child => {
        traverse(child, callback)
    });
}
