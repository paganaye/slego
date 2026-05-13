import { JSX } from "solid-js/jsx-runtime";
import { addStyle } from "../Styles";
import { playSound } from "../sound";
import { useSlegoApp } from "./SlegoApp";
import { TutorialTarget } from "@shared/tutorial";

export interface buttonProps {
    tutorialId?: TutorialTarget;
    class?: string;
    onclick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
    disabled?: boolean;
    children: JSX.Element;
    tutorialTarget?: boolean;
}

addStyle(".btn", {
    backgroundColor: 'var(--btn-bg-color)',
    color: 'rgb(var(--text-color))',
    border: 'none',
    padding: '10px 16px',
    fontSize: '0.95rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease'
})

addStyle("button.btn.round", {
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    padding: '0',
    alignItems: 'center',
    justifyContent: 'center'
});

addStyle("button.btn.flat", {
    backgroundColor: "var(--bg-color)",
    border: "1px solid #ccc"
});

addStyle("button.btn.green", {
    backgroundColor: 'var(--green)',
});

addStyle("button.btn.blue", {
    backgroundColor: 'var(--blue)',
});

addStyle("button.btn.magenta", {
    backgroundColor: 'var(--magenta)',
});

addStyle("button.btn.red", {
    backgroundColor: 'var(--red)',
});

addStyle(".btn:disabled", {
    cursor: "not-allowed",
    backgroundColor: "var(--bg-color)",
    color: "var(--text-color)",
    border: "2px dashed rgb(var(--text-color)) !important",
    filter: "opacity(0.4)"
});


addStyle(".btn:hover:not(:disabled)", {
    boxShadow: 'inset 0 0 0 100px rgba(0,0,0,0.1)'
});

addStyle(".color-red", { color: 'var(--red)' })
addStyle(".color-blue", { color: 'var(--blue)' })
addStyle(".color-green", { color: 'var(--green)' })
addStyle(".color-magenta", { color: 'var(--magenta)' })

export function Button(props: buttonProps) {
    const app = useSlegoApp();

    return (<button
        classList={{
            btn: true,
            tutorialTarget: Boolean(props.tutorialTarget || (props.tutorialId && app.tutorialTarget.get() === props.tutorialId)),
        }}
        class={props.class}
        onclick={(event) => {
            playSound('buttonClicked');
            if (typeof props.onclick === 'function') {
                props.onclick(event);
            }
        }}
        disabled={props.disabled}
    >{props.children}</button>);

}
