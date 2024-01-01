import { useEffect, useRef } from "preact/hooks"
import util from "../util.module.css"

export interface IAutoDownloadLink
{
    url: string
    downloadFileName: string;
    innerText: string
    
    onFileDownload: () => void;
    autoDownload: boolean;

    className? : string
}

export function AutoDownloadLink(props: IAutoDownloadLink)
{
    const anchorRef = useRef<HTMLAnchorElement>(null);

    function signalFileDownloaded()
    {
        props.onFileDownload();
    }

    useEffect(
        () => {
            const refElem = anchorRef.current;
            if(refElem && props.autoDownload)
            {
                //Auto click download link on component mount
                refElem.click();
            }
        }
    , [props.url, props.autoDownload])

    return (
        <div className={util.p_vert_horz_centering_container}>
            <a 
                className={`${props.className || ""}`}
                ref={anchorRef}
                href={props.url} 
                download={props.downloadFileName}
                onClick={signalFileDownloaded}
            >
                {props.innerText}
            </a>
        </div>
    );
}