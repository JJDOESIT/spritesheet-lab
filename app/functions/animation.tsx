import React, { RefObject } from 'react';

export function playAnimateCSS(node: React.RefObject<HTMLElement>, animationToAdd : string, animationToRemove : string,  prefix = 'animate__'){
    if (node.current) {
        node.current.classList.remove(`${prefix}animated`, `${prefix}${animationToRemove}`);
        node.current.classList.add(`${prefix}animated`, `${prefix}${animationToAdd}`);
    }
}
    
    