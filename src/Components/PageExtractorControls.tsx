import { IFileUrl } from "../types";
import styles from "./PageExtractorControls.module.css"
import { cx } from "../util";
import { TPageIndices } from "../PDFUtil/PDFPageExtractor";
import { AutoDownloadLink } from "./AutoDownloadLink";
import { ParsePangeRange } from "../PDFUtil/PageRangeParse";
import { Alert } from "./Alert";
import { PDFPreview } from "./PDFPreview";
import { FileSelector } from "./FileSelector";
import util from "../util.module.css"
import { JSX } from "preact/jsx-runtime";

export interface IPageExtractorControls
{
    extractSrc: IFileUrl | undefined,
    extractedFile:  IFileUrl | undefined,
    nPages: number,

    setSplitTarget: (newTarget: File | undefined) => void,

    onBeginPageExtract: (pageIndices: TPageIndices) => void,

    splitInProgress: boolean,
    loading: boolean,

    downloadSplitFile: boolean,
    onSplitFileDownload: () => void;

    filter: string,
    setFilter: (newFilter:string) => void,

    previewSize: string,
    setPreviewSize: (newSize: string) => void,
}

const previewSizes: [string,string][] = [
    ["Small", styles.small],
    ["Default", ""],
    ["Large", styles.large],
];

const previewSizeMap = new Map<string, string>(
    previewSizes
);

export function PageExtractorControls(props: IPageExtractorControls)
{
    const parseResult = ParsePangeRange(props.filter, props.nPages);
    
    function onSizeChanged(e: JSX.TargetedEvent<HTMLSelectElement, Event>)
    {
        props.setPreviewSize((e.target as HTMLSelectElement).value);
    }

    function onFileSelected(e: File[] | undefined)
    {
        const selectedFile = e && e.length > 0? e[0] : undefined;
         
        props.setSplitTarget(selectedFile);
    }

    const downloadLink = (
        props.extractedFile? 
        <AutoDownloadLink
            url={props.extractedFile.url}
            downloadFileName={props.extractedFile.filename}
            innerText="Download Extracted Pages"
            onFileDownload={props.onSplitFileDownload}
            autoDownload={props.downloadSplitFile}
        />
        :undefined
    );

    const noFileSelected: boolean = props.extractSrc === undefined;
    const hasParseError: boolean = !parseResult.success || parseResult.pageIndices.length === 0;
    return (
        <>
            <h3 className={util.tab_header}>Extract Pages</h3>
        
            <div className={cx(util.left_vert_bar, util.bottom_margin)}>
                <div className={cx(util.flex_divider, util.mobile_stack)}>
                    <div className={cx(util.divider_child_2, styles.filename)}>
                        <span><strong>Filename:</strong> {props.extractSrc?.filename}</span>
                    </div>
                    
                    <div className={util.divider_child}>
                        <div className={cx(util.flex_divider, util.left_just_children)}>
                            
                            <strong>Size:</strong>
                            <select 
                                style={{width:"6em"}} 
                                value={props.previewSize}
                                onChange={onSizeChanged}
                                className={cx(styles.left_margin)}
                            >
                                {previewSizes.map(([name, _], idx) => {
                                    return <option key={idx} value={name}>{name}</option>
                                })}
                            </select>
                            
                        </div>
                    </div>

                    <FileSelector
                        disabled={props.loading}
                        busy={props.loading}
                        onFileChanged={onFileSelected}
                        className={cx(util.divider_child)}
                    >
                        {noFileSelected? "Load File": "Change File"}
                    </FileSelector>
                </div>
            </div>

            <div className={util.hide_xs}>
                <PDFPreview 
                    src={props.extractSrc?.url}
                    className={cx(styles.preview_object, previewSizeMap.get(props.previewSize) || "", util.bottom_margin)}
                    onPdfFileSelected={props.setSplitTarget}
                />
            </div>
            <div className={util.show_xs}>
                <div className={cx("card", util.drop_shadow, styles.mobile_pdf_preview)}>
                    {(
                        (props.extractSrc)?
                            (<>
                                <a href={props.extractSrc.url}>{props.extractSrc.filename}</a>
                                <p>Pages: {props.nPages}</p>
                            </>):
                            <h4>No File Selected</h4>
                    )}
                </div>
            </div>


            <form 
                disabled={noFileSelected} 
                onSubmit={(e) => e.preventDefault()}
                className={cx(util.collapsible, noFileSelected? "" : util.show, util.left_vert_bar)}
            >
                <label htmlFor=""><h4>Page Filter</h4></label>
                <textarea 
                    value={props.filter}
                    onInput={(e) => props.setFilter((e.target as HTMLTextAreaElement).value)}
                    rows={3}
                    style={{resize:"none"}}
                    placeholder={"Comma-separated numbers for individual pages, specify ranges using a dash (-)\ni.e. 1,2,3,4,5-10"}
                />
                <Alert
                    title="Error"
                    msgbody={parseResult.errorMsg}
                    hidden={parseResult.success}
                />
                <button
                    disabled={hasParseError}
                    onClick={() => props.onBeginPageExtract(parseResult.pageIndices)}
                    className={util.full_width}
                >
                    Extract Pages
                </button>
                <div>
                    {downloadLink}
                </div>
            </form>
        </>
    )
}
