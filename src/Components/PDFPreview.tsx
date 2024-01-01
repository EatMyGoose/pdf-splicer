import { cx } from "../util";
import styles from "./PDFPreview.module.css"
import util from "../util.module.css"
import { FileDropArea } from "./FileDropArea";

export interface IPDFPreview
{
    src?: string
    onPdfFileSelected: (file: File) => void
    className?: string
}

export function PDFPreview(props: IPDFPreview)
{
    function handleFileDropped(pdfFiles: File[])
    {
        if(pdfFiles.length > 0)
        {
            props.onPdfFileSelected(pdfFiles[0]);
        }
        else
        {
            console.log(`No pdf files selected`);
        }
    }

    const innerContent = (() => {
        if(props.src !== undefined)
        {
            return (
                <iframe    
                    src={props.src}
                    className={cx(styles.preview_iframe)}
                />
            );
        }
        else
        {
            return (
                <FileDropArea
                    onPdfFileSelected={handleFileDropped}
                    className={cx(util.p_vert_horz_centering_container)}
                >
                    <h3>Drag & Drop PDF File</h3>
                </FileDropArea>
            )
        }
    })();

    return (
        <div className={cx(props.className || "")}>
            {innerContent}
        </div>
    );
}