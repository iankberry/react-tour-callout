# react-tour-callout

> A simple library to create UI callouts designed for building custom tour components

This component provides a simple way to build a callout targeted at any UI element on the page. 

It's worth noting up front that this library is not designed to replace the popular (and powerful) [react-joyride](https://github.com/gilbarbara/react-joyride/) library. The goal of this library is to provide a more primitive (and less opinionated) way to build a single callout against any UI element.

In my experience, [react-joyride](https://github.com/gilbarbara/react-joyride/) is primarily optimized for building a single linear tour on a page. However, in many cases, tour callouts are displayed more progressively over multiple pages and often only when certain features are interacted with. This makes building these "one-off" tour callouts more challenging since you either need to manage the tour cycle manually or even use multiple tour instances. Advanced UI customization can also be a challenge beyond the [built-in properties](https://docs.react-joyride.com/styling) and often requires custom CSS to target built-in styles. 

In contrast, this library handles the positioning of the callout but leaves it up to the developer to manage the tour lifecycle and layout/styling within the callout.

## Features

 - ✅ Anchor the callout to any element on the page via a ref or CSS selector. The [Popper](https://popper.js.org/) library is used to accomplish this.
 - ✅ Optionally render a "speech bubble" arrow that based on its position relative to the anchored element. The color/positioning of this arrow can be customized as well.
 - ✅ Optionally render a semi-transparent backdrop behind the callout.
 - ✅ Highlight multiple elements above the backdrop (not just the anchor element). Custom styles can also be applied to highlighted elements.
 - ✅ Allow highlighted elements to be interactive or read only to the user.

## Installation

```sh
npm install --save react-tour-callout
```

## Using the demo

1. Checkout this repository

2. Run the below command to start the server on port 3010.

```sh
npm run example
```

[![Edit react-tour-callout](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-tour-callout-uxilky?fontsize=14&hidenavigation=1&theme=dark)

## Docs

### Props

| Prop             | Type                                        | Default  | Definition                                                                                                                                                                                          |
|------------------|---------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| open             | `boolean`                                   | REQUIRED | Whether to open the callout popover                                                                                                                                                                 |
| height           | `number`                                    | REQUIRED | Height of the popover in px                                                                                                                                                                         |
| width            | `number`                                    | REQUIRED | Width of the popover in px                                                                                                                                                                          |
| showBackdrop     | `boolean`                                   | true     | Whether to show the backdrop when the popover is open                                                                                                                                               |
| backdropProps    | `BackdropProps`                             | None     | Additional props to pass onto the backdrop component                                                                                                                                                |
| placement        | `PopoverPlacement` &#124; `center`          | REQUIRED | See the [Popper docs](https://popper.js.org/docs/v2/constructors/#options) for available options                                                                                                    |
| zIndex           | `number`                                    | 1500     | The z-index value to apply to the popover                                                                                                                                                           | 
| popoverMargin    | `number`                                    | None     | Add a margin to the popover container (y-axis for right/left placement, x-axis for top/bottom placement)                                                                                            | 
| popoverAnchor    | `HTMLElement` &#124; `string` &#124; `null` | null     | The element to anchor the popover to. Can specify either the element ref or a selector that resolves to the element. If `null` is provided, the popover is centered on the page.                    | 
| anchorOffset     | `[number, number]`                          | None     | Adjust the position of the popover relative to the anchor in the format [skidding, distance]. See the [Popper docs](https://popper.js.org/docs/v2/modifiers/offset/#offset-1) for more information. | 
| raiseAnchor      | `boolean`                                   | true     | Whether to increase the z-index of the target element to "raise" it above the backdrop                                                                                                              |
| enterTransition  | `boolean`                                   | true     | Whether to enable a "zoom in" animation when opening the popover                                                                                                                                    |
| showArrow        | `boolean`                                   | true     | Whether to show a speech bubble like arrow pointing at the anchor element                                                                                                                           |
| arrowOffset      | `number`                                    | None     | Offset in px to adjust arrow position by on its primary axis                                                                                                                                        |
| arrowColor       | `string`                                    | #000     | Color of the arrow icon using CSS color syntax                                                                                                                                                      |
| highlightTargets | `(HTMLElement &#124; string)[]`             | None     | Array of elements (selector or ref) to raise above the backdrop. This can be used to "highlight" multiple elements on the page for a single tour step.                                              |
| highlightStyles  | `CSSProperties`                             | None     | Additional CSS styles to apply to highlighted elements                                                                                                                                              |
| children         | `React.ReactNode`                           | REQUIRED | The body of the callout popover                                                                                                                                                                     |

## Example

This is just a simple contrived example showing anchoring the popover to a button.

```jsx
export const App = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <button
                className="open-button"
                onClick={() => setOpen(true)}
            >
                Open popover
            </button>
            <CalloutPopover
                placement="bottom"
                open={open}
                height={180}
                width={350}
                showBackdrop={true}
                backdropProps={{
                    onClick: () => setOpen(false),
                    onEsc: () => setOpen(false),
                }}
                popoverAnchor=".open-button"
            >
                <h1>Popover content here...</h1>
                <button
                    onClick={() => setOpen(false)}
                >
                    Close popover
                </button>
            </CalloutPopover>
        </div>
    )
};
```

## Note

Feel free to submit issues/PR's and I will do my best to respond. I'm sure there are plenty of improvements that can be made :-)

## License

This project is licensed under the terms of the [MIT license](https://github.com/iankberry/react-tour-callout/blob/master/LICENSE).