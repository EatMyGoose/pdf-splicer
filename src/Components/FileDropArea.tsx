import { JSX } from "preact/jsx-runtime";
import { cx } from "../util";
import { HasPDFExtension } from "../PDFUtil/FilenameChecker";

export interface IFileDropArea
{
    onPdfFileSelected: (pdfFile: File[]) => void,
    children?: JSX.Element | JSX.Element[] | string,
    className?: string
}

export function FileDropArea(props: IFileDropArea)
{
    function handleFileDropped(e: JSX.TargetedDragEvent<HTMLDivElement>)
    {
        e.preventDefault();

        const files = e.dataTransfer?.files;
        if(files === undefined) return;
        
        const filesWithPDFExtension = Array.from(files).filter(f => HasPDFExtension(f.name));

        props.onPdfFileSelected(filesWithPDFExtension);
    }

    function handleDragOver(e: JSX.TargetedDragEvent<HTMLDivElement>)
    {
        e.preventDefault();
        if(e.dataTransfer)
        {
            e.dataTransfer.dropEffect = "copy";
        }
    }

    return (
        <div 
            name="file-drop-area"
            className={cx(props.className || "")}
            onDragOver={handleDragOver}
            onDrop={handleFileDropped}
        >
            {props.children}
        </div>
    )
}