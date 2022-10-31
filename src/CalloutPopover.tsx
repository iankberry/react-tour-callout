import styled from "@emotion/styled";
import { createPopper } from '@popperjs/core';
import { Placement as PopoverPlacement } from "@popperjs/core/lib/enums";
import * as React from "react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useElementWatcher } from "use-element-watcher";
import { Backdrop, BackdropProps, CenteredContent } from "./ui";
import { Zoom } from "./zoom"

export type CalloutPopoverProps = {
    // whether to show the popover
    open: boolean
    // dimensions of the popover content (does not include arrow)
    height: number
    width: number
    // whether to make the backdrop visible by dimming the background content
    showBackdrop?: boolean
    // props to pass onto the backdrop component
    backdropProps?: Partial<BackdropProps>
    // where to position the popover relative to the target element
    placement: PopoverPlacement | 'center'
    // custom z-index for popover (default: 1500)
    zIndex?: number
    // add margin to the popover container (y-axis for right/left placement, x-axis for top/bottom placement)
    popoverMargin?: number
    // where to anchor the popover
    // 'string' must be a valid selector
    // 'null' will center the popover on the page
    popoverAnchor?: HTMLElement | string | null
    // in the format [skidding, distance]
    // see: https://popper.js.org/docs/v2/modifiers/offset/#offset-1
    anchorOffset?: [number, number]
    // whether to increase the z-index of the target element above the backdrop
    raiseAnchor?: boolean
    // enable 'zoom' enter transition (default: true)
    enterTransition?: boolean
    // whether to show an arrow pointing at the target
    showArrow?: boolean
    // offset to adjust arrow position by on its primary axis
    arrowOffset?: number
    // specify popover arrow color (css color syntax, default: #000)
    arrowColor?: string
    // array of targets to raise above the backdrop (but disable click events)
    highlightTargets?: (HTMLElement | string)[]
    // apply specified styles to highlighted elements
    highlightStyles?: CSSProperties
    // popover content
    children: React.ReactNode
}

export type { PopoverPlacement };

// where to orient the arrow relative to the popover position
const positionArrowDirectionMap: {[key: string]: string} = {
    top: 'down',
    'top-start': 'down',
    'top-end': 'down',
    bottom: 'up',
    'bottom-start': 'up',
    'bottom-end': 'up',
    left: 'right',
    'left-start': 'right',
    'left-end': 'right',
    right: 'left',
    'right-start': 'left',
    'right-end': 'left',
}

export const CalloutPopover = ({
       anchorOffset,
       arrowColor = '#000',
       arrowOffset,
       backdropProps,
       children,
       enterTransition = true,
       height,
       highlightStyles,
       highlightTargets,
       open,
       placement,
       popoverAnchor = null,
       popoverMargin = 0,
       raiseAnchor = true,
       showArrow = true,
       showBackdrop = true,
       width,
       zIndex = 1500,
}: CalloutPopoverProps) => {
    const [anchorElement, setAnchorElement] = useState<HTMLElement|null>(typeof popoverAnchor === 'string' ? null : popoverAnchor);

    const popperContainer = useRef<HTMLElement|null>(null);

    // calculate arrow direction based on popover position relative to target
    const arrowDirection = showArrow ? positionArrowDirectionMap[placement] ?? 'none' : 'none';

    // used to target elements based on selector
    const { watchElement, unWatchAll } = useElementWatcher();

    useEffect(() => {
        const styleWatchWrapper = (target: HTMLElement | string, highlight: boolean, setAnchor: boolean) => {
            // ignore if popover is not open
            if (!open) {
                return;
            }

            watchElement(target, {
                onWatch: element => {
                    if (setAnchor) {
                        setAnchorElement(element);
                    }

                    if (raiseAnchor || highlight) {
                        // make sure z-index can be applied
                        if (window.getComputedStyle(element).position === 'static') {
                            element.style.position = 'relative';
                        }
                        // update z-index to raise above the backdrop
                        element.style.zIndex = (zIndex + 100).toString();

                        // disable pointer events if specified
                        if (highlight) {
                            element.style.pointerEvents = 'none';
                        }

                        // override specified styles on element when highlighted
                        if (highlightStyles) {
                            for (const [name, value] of Object.entries(highlightStyles)) {
                                element.style[name] = value;
                            }
                        }
                    }
                },
                onUnwatch: (element, originalStyles) => {
                    if (raiseAnchor || highlight) {
                        element.style.zIndex = originalStyles.zIndex;

                        // re-enable pointer events if specified
                        if (highlight) {
                            element.style.pointerEvents = originalStyles.pointerEvents;
                        }

                        // reset user specified highlight styles
                        if (highlightStyles) {
                            Object.keys(highlightStyles).forEach(styleName => {
                                element.style[styleName] = null;
                            });
                        }
                    }
                },
            });
        }

        // find target element, raise above backdrop if specified
        if (popoverAnchor) {
            styleWatchWrapper(popoverAnchor, false, true);
        }

        // raise any specified targets above the backdrop and disable click events
        if (highlightTargets) {
            highlightTargets.forEach(target => {
                styleWatchWrapper(target, true, false);
            });
        }
    });

    useEffect(() => {
        if (anchorElement && popperContainer.current && placement !== 'center') {
            createPopper(anchorElement, popperContainer.current, {
                placement: placement,
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: anchorOffset,
                        },
                    }
                ]
            });
        }
    }, [anchorElement, placement, anchorOffset]);

    return (
        <>
            {showBackdrop
                ? (
                    <Backdrop
                        open={open}
                        // when the backdrop closes, reset all custom highlight/anchor styles
                        onHide={unWatchAll}
                        {...backdropProps}
                    />
                )
                : null
            }
            <div
                ref={node => popperContainer.current = node}
                style={{
                    zIndex: zIndex,
                }}
            >
                {anchorElement && (
                    placement === 'center' ? (
                        <CenteredPopoverContainer {...{height, width, open}}>
                            <Zoom in={open} appear={enterTransition}>
                                <div style={{ height: '100%', width: '100%' }}>
                                    {children}
                                </div>
                            </Zoom>
                        </CenteredPopoverContainer>
                    ) : (
                        <Zoom in={open} appear={enterTransition}>
                            <CalloutPopoverContainer
                                className={'arrow-' + arrowDirection}
                                {...{height, width, arrowOffset, popoverMargin}}
                            >
                                {(arrowDirection === 'left' || arrowDirection === 'up') && (
                                    <div className="arrow-container">
                                        <PopoverArrowIcon
                                            direction={arrowDirection}
                                            size={2.5}
                                            color={arrowColor}
                                        />
                                    </div>
                                )}
                                {children}
                                {(arrowDirection === 'right' || arrowDirection === 'down') && (
                                    <div className="arrow-container">
                                        <PopoverArrowIcon
                                            direction={arrowDirection}
                                            size={2.5}
                                            color={arrowColor}
                                        />
                                    </div>
                                )}
                            </CalloutPopoverContainer>
                        </Zoom>
                    )
                )}
            </div>
        </>
    )
}

const CenteredPopoverContainer = styled(CenteredContent)<{ height: number, width: number, open: boolean }>`
    display: ${props => props.open ? 'block' : 'none'};
    height: ${props => props.height}px;
    width: ${props => props.width}px;
`

const CalloutPopoverContainer = styled('div')<{ height: number, width: number, popoverMargin: number, arrowOffset?: number }>`
    display: flex;
    height: ${props => props.height}px;
    width: ${props => props.width}px;
    position: relative;
    
    // position arrow on x-axis
    &.arrow-up, &.arrow-down {
        display: flex;
        flex-direction: column;
        height: ${props => props.height + 20}px; // adjust for arrow height
        margin: 0 ${props => props.popoverMargin}px;

        .arrow-container {
            position: relative;
            display: flex;
            justify-content: ${props => props.arrowOffset === undefined ? 'center' : 'flex-start'};
            height: 20px;
            ${props => props.arrowOffset !== undefined && `
                svg {
                    height: 100%;
                    position: absolute;
                    left: ${props.arrowOffset}px;
                }
            `}
        }
    }

    // position arrow on y-axis
    &.arrow-left, &.arrow-right {
        display: flex;
        flex-direction: row;
        width: ${props => props.width + 30}px; // adjust for arrow width
        margin: ${props => props.popoverMargin}px 0;

        .arrow-container {
            position: relative;
            display: flex;
            align-items: ${props => props.arrowOffset === undefined ? 'center' : 'flex-start'};
            width: 30px;
            ${props => props.arrowOffset !== undefined && `
                svg {
                    position: absolute;
                    top: ${props.arrowOffset}px;
                }
            `}
        }

        &.arrow-left .arrow-container svg {
            margin-right: -10px;
        }
        &.arrow-right .arrow-container svg {
            margin-left: -10px;
        }
    }
`

export type ArrowDirection = 'up' | 'down' | 'right' | 'left';
type ArrowIconProps = {
    size: number
    color: string
    direction: ArrowDirection
};

export const PopoverArrowIcon = ({ size = 2.5, color, direction }: ArrowIconProps) => (
    <svg
        viewBox="0 0 10 5"
        style={{
            fontSize: size + 'rem',
            fill: color,
            transform: direction ? 'rotate(' + (Rotations[direction] + 270) + 'deg)' : 'auto',
        }}
    >
        <path d="M0 5l5-5 5 5z" />
    </svg>
)

const Rotations = {
    up: 90,
    down: 270,
    right: 180,
    left: 0,
}