import * as React from "react";
import { CalloutPopover, CalloutPopoverProps } from "../../src";

type TourStep = {
    title: string
    body: string
    popover: Partial<CalloutPopoverProps>
}

type PopoverState =
    'single-target' |
    'multiple-targets' |
    'raised-target' |
    'arrow-offset' |
    'anchor-offset' |
    'no-backdrop';

const TourSteps: Record<PopoverState, TourStep> = {
    'single-target': {
        title: 'Single highlight target',
        body: 'This step shows highlighting a single target element with a custom background color.',
        popover: {
            showBackdrop: true,
            popoverAnchor: 'li.nav-home',
            highlightTargets: [
                'li.nav-home',
            ],
            highlightStyles: {
                backgroundColor: '#fafafa',
            },
            placement: 'right',
        },
    },
    'multiple-targets': {
        title: 'Multiple highlight targets',
        body: 'This step shows highlighting multiple target elements while being anchored to a single element.',
        popover: {
            showBackdrop: true,
            popoverAnchor: 'li.nav-games',
            highlightTargets: [
                'li.nav-games',
                'li.nav-reference',
            ],
            highlightStyles: {
                backgroundColor: '#fafafa',
            },
            placement: 'right',
        },
    },
    'raised-target': {
        title: 'Raised highlight target',
        body: 'This step shows highlighting a target element and allowing it to be interacted with.',
        popover: {
            showBackdrop: true,
            popoverAnchor: 'button.raised-target',
            raiseAnchor: true,
            placement: 'top',
        },
    },
    'anchor-offset': {
        title: 'Popover offset',
        body: 'This step shows adjusting the display offset of the popover relative to the anchor.',
        popover: {
            showBackdrop: true,
            popoverAnchor: '.sidebar ul',
            anchorOffset: [0, -50],
            placement: 'right',
        },
    },
    'arrow-offset': {
        title: 'Arrow offset',
        body: 'This step shows adjusting the display offset of the arrow relative to the popover.',
        popover: {
            showBackdrop: true,
            popoverAnchor: '.sidebar ul',
            popoverMargin: 15,
            arrowColor: '#424242',
            arrowOffset: 50,
            placement: 'bottom',
        },
    },
    'no-backdrop': {
        title: 'No backdrop',
        body: 'This step is shown without the backdrop centered on the page.',
        popover: {
            showBackdrop: false,
            popoverAnchor: 'body',
            placement: 'center',
        },
    },
}

export const App = () => {
    const [tourStep, setTourStep] = React.useState<PopoverState|null>(null);

    return (
        <div className="page">
            <div className="sidebar">
                <ul>
                    <li className="nav-home">🏡 Home</li>
                    <li className="nav-games">👾 Games</li>
                    <li className="nav-reference">📚 Reference</li>
                    <li className="nav-accounts">👤 Account</li>
                </ul>
            </div>

            <div className="content">
                <button
                    type="button"
                    onClick={() => setTourStep('single-target')}
                >
                    Single highlight target
                </button>
                <button
                    type="button"
                    onClick={() => setTourStep('multiple-targets')}
                >
                    Multiple highlight targets
                </button>
                <button
                    type="button"
                    onClick={() => setTourStep('raised-target')}
                >
                    Raised highlight target
                </button>
                <button
                    type="button"
                    onClick={() => setTourStep('anchor-offset')}
                >
                    Popover anchor offset
                </button>
                <button
                    type="button"
                    onClick={() => setTourStep('arrow-offset')}
                >
                    Arrow offset
                </button>
                <button
                    type="button"
                    onClick={() => setTourStep('no-backdrop')}
                >
                    No backdrop
                </button>

                {tourStep === 'raised-target' && (
                    <button
                        className="raised-target"
                        onClick={() => setTourStep(null)}
                    >
                        👑 Click me
                    </button>
                )}
            </div>

            {tourStep !== null && (
                <CalloutPopover
                    placement={TourSteps[tourStep].popover.placement ?? 'center'}
                    open={true}
                    showArrow={true}
                    backdropProps={{
                        onClick: () => setTourStep(null),
                        onEsc: () => setTourStep(null),
                    }}
                    arrowColor="#ddd"
                    height={180}
                    width={350}
                    {...TourSteps[tourStep].popover}
                >
                    <div className="tour-content">
                        <div className="header">
                            <h1>{TourSteps[tourStep].title}</h1>
                        </div>
                        <div className="body">
                            <p>{TourSteps[tourStep].body}</p>
                        </div>
                        <div className="footer">
                            <button
                                type="button"
                                onClick={() => setTourStep(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </CalloutPopover>
            )}
        </div>
    );
}