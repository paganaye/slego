interface SimpleScorePopupProps {
    show: boolean;
    text: string;
    color: string;
}

export function SimpleScorePopup(props: SimpleScorePopupProps) {
    if (!props.show) return null;

    return (
        <div
            class="simple-score-popup"
        >
            {props.text}
        </div>
    );
}
