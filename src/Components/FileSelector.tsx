import { useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { cx } from "../util";
import { Spinner } from "./Spinner";

interface IFileSelector
{
    multiple?: boolean,
    disabled?: boolean,
    onFileChanged: (newFiles :File[] | undefined) => void,
    children: JSX.Element | JSX.Element[] | string,
    busy?: boolean
    className?: string 
    id?: string
}

export function FileSelector(props: IFileSelector)
{
    const inputRef = useRef<HTMLInputElement>(null);

    function onFileSelected(e: JSX.TargetedEvent<HTMLInputElement, Event>)
    {
        const inputElement = (e.target as HTMLInputElement);
    
        const files = inputElement.files? 
            Array.from(inputElement.files) :
            undefined;

        //To allow the same file to be re-selected
        inputElement.value = "";

        props.onFileChanged(files);
    }

    return (
        <button
            disabled={props.disabled || props.busy}
            onClick={ ()=>inputRef.current?.click() }
            style={{minHeight:"2.3em"}}
            className={cx(props.className || "")}
        >
            <input 
                ref={inputRef}
                type="file" 
                hidden
                accept=".pdf"
                multiple={props.multiple}
                onChange={onFileSelected}
                id={props.id}
            />
            {props.busy? 
                <Spinner/> :
                props.children
            }
        </button>
    )
}   