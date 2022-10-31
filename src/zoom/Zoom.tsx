import * as React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps } from "react-transition-group/Transition";
import { useForkRef } from '../utils';
import createTransitions from "./createTransitions";
import { getTransitionProps, reflow } from './utils';

const styles = {
    entering: {
        transform: 'none',
    },
    entered: {
        transform: 'none',
    },
};

type Props = {
    timeout?: number | { enter?: number; exit?: number }
} & Omit<TransitionProps, 'timeout'>

const transitions = createTransitions({});

/**
 * The Zoom transition can be used for the floating variant of the
 * [Button](/material-ui/react-button/#floating-action-buttons) component.
 * It uses [react-transition-group](https://github.com/reactjs/react-transition-group) internally.
 */
export const Zoom = React.forwardRef<HTMLElement, Props>(function Zoom(props, ref) {
    //const theme = useTheme();
    const defaultTimeout = {
        enter: 225,
        exit: 192,
    };

    const {
        addEndListener,
        appear = true,
        children,
        easing,
        in: inProp,
        onEnter,
        onEntered,
        onEntering,
        onExit,
        onExited,
        onExiting,
        style,
        timeout = defaultTimeout,
        // eslint-disable-next-line react/prop-types
        TransitionComponent = Transition,
        ...other
    } = props;

    const nodeRef = React.useRef(null);
    const foreignRef = useForkRef(children.ref, ref);
    const handleRef = useForkRef(nodeRef, foreignRef);

    const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
        if (callback) {
            const node = nodeRef.current;

            // onEnterXxx and onExitXxx callbacks have a different arguments.length value.
            if (maybeIsAppearing === undefined) {
                callback(node);
            } else {
                callback(node, maybeIsAppearing);
            }
        }
    };

    const handleEntering = normalizedTransitionCallback(onEntering);

    const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
        reflow(node); // So the animation always start from the start.

        const transitionProps = getTransitionProps(
            { style, timeout, easing },
            {
                mode: 'enter',
            },
        );

        node.style.webkitTransition = transitions.create('transform', transitionProps);
        node.style.transition = transitions.create('transform', transitionProps);

        if (onEnter) {
            onEnter(node, isAppearing);
        }
    });

    const handleEntered = normalizedTransitionCallback(onEntered);

    const handleExiting = normalizedTransitionCallback(onExiting);

    const handleExit = normalizedTransitionCallback((node) => {
        const transitionProps = getTransitionProps(
            { style, timeout, easing },
            {
                mode: 'exit',
            },
        );

        node.style.webkitTransition = transitions.create('transform', transitionProps);
        node.style.transition = transitions.create('transform', transitionProps);

        if (onExit) {
            onExit(node);
        }
    });

    const handleExited = normalizedTransitionCallback(onExited);

    const handleAddEndListener = (next) => {
        if (addEndListener) {
            // Old call signature before `react-transition-group` implemented `nodeRef`
            addEndListener(nodeRef.current, next);
        }
    };

    return (
        <TransitionComponent
            appear={appear}
            in={inProp}
            nodeRef={nodeRef}
            onEnter={handleEnter}
            onEntered={handleEntered}
            onEntering={handleEntering}
            onExit={handleExit}
            onExited={handleExited}
            onExiting={handleExiting}
            addEndListener={handleAddEndListener}
            timeout={timeout}
            {...other}
        >
            {(state, childProps) => {
                return React.cloneElement(children, {
                    style: {
                        transform: 'scale(0)',
                        visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
                        ...styles[state],
                        ...style,
                        ...children.props.style,
                    },
                    ref: handleRef,
                    ...childProps,
                });
            }}
        </TransitionComponent>
    );
});