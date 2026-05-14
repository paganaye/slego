import { JSX } from "solid-js/jsx-runtime";
import { addStyle } from "../Styles";
import { playSound } from "../sound";

export interface buttonProps {
    class?: string;
    onclick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
    disabled?: boolean;
    children: JSX.Element;
}

addStyle(".action-btn", {
    '--btn-bg-color': '#28a745',
    'background-color': 'var(--btn-bg-color)',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    'font-size': '0.95rem',
    'border-radius': '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, filter 0.2s ease'
})

addStyle("button.action-btn.primary", {
    "--btn-bg-color": "rgb(255, 69, 0)"
});


addStyle(".action-btn:disabled", {
    'cursor': 'not-allowed',
    'filter': 'brightness(0.6)'
});

addStyle(".action-btn:hover:not(:disabled)", {
    'filter': 'brightness(0.9)'
});

addStyle(".action-btn.secondary", {
    "--btn-bg-color": "#666"
});



export function Button(props: buttonProps) {
    return (<button
        class={"action-btn " + props.class}
        onclick={(event) => {
            playSound('buttonClicked');
            if (typeof props.onclick === 'function') {
                props.onclick(event);
            }
        }}
        disabled={props.disabled}
    >{props.children}</button>);

}
