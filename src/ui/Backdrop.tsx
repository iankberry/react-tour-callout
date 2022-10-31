import styled from "@emotion/styled";
import * as React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useKeyListener, usePrevious } from "../utils";

export type BackdropProps = {
    open?: boolean
    zIndex?: number
    onHide?: () => void
    onClick?: () => void
    onEsc?: () => void
    children?: React.ReactNode
}

export const Backdrop = ({ open, zIndex = 1400, onHide, onClick, onEsc, children }: BackdropProps) => {
    // used for the fade animation
    const [hidden, setHidden] = useState(!open);

    // put backdrop directly under the body element
    const body = React.useRef(document.querySelector('body'));

    // update hidden state from prop to ensure enter transition
    const previousOpen = usePrevious(open);
    useEffect(() => {
        if (open && !previousOpen) {
            setHidden(false);
        }
    }, [open, previousOpen]);

    // close on 'esc' key
    useKeyListener(() => {
        if (onEsc) {
            onEsc();
        }
    }, 27, open);

    const backdropContent = (
        <BackdropContainer
            className="ampll-backdrop"
            aria-hidden="true"
            style={{
                zIndex,
                visibility: hidden ? 'hidden' : 'initial',
                opacity: open ? 0.5 : 0,
            }}
            onClick={onClick}
            onTransitionEnd={event => {
                // actually hide the backdrop once the animation completes
                setHidden(!open);
                if (!open && onHide) {
                    onHide();
                }
            }}
        >
            {children && (
                <div style={{ zIndex: zIndex + 1 }}>
                    {children}
                </div>
            )}
        </BackdropContainer>
    );

    return body.current ? createPortal(backdropContent, body.current) : backdropContent;
}

export const BackdropContainer = styled('div')`
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    flex-direction: row;
    justify-content: center;
    background-color: #000;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`