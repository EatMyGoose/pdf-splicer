import { TTab } from "../types"

export interface ISwitchTabControls
{
    mergeText: string,
    extractText: string,
    setActiveTab: (newTab: TTab) => void
}

export function SwitchTabControls(props: ISwitchTabControls)
{
    return (
        <>
            <button onClick={() => props.setActiveTab("merge")}>
                {props.mergeText}
            </button>
            <button onClick={() => props.setActiveTab("extract")}>
                {props.extractText}
            </button>
        </>
    )
}