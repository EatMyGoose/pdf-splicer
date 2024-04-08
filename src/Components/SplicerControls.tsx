import { TReducerConsumer } from "../TReducer";
import { SelectFilesControls } from "./SelectFilesControls";
import util from "../util.module.css"
import styles from "./SplicerControls.module.css"
import { AutoDownloadLink } from "./AutoDownloadLink";
import { Loadable } from "./Loadable";
import { cx } from "../util";

export interface ISplicerControls
{
    onClearAll: () => void;
    onFileListChanged: TReducerConsumer<File[]>;
    fileList: File[];
    onBeginPDFMerge: () => void;
    mergeInProgress: boolean;
    downloadURL?: string;

    onMergedFileDownload: () => void;
    downloadMergedFile: boolean;
}

export function SplicerControls(props: ISplicerControls)
{
    const preview = (
        props.downloadURL? 
        (<iframe className={cx(util.full_width, styles.preview, util.hide_xs)} src={props.downloadURL}></iframe>):
        undefined
    )

    const downloadLink = (
        props.downloadURL?
        <AutoDownloadLink
            url={props.downloadURL}
            downloadFileName="merged_file"
            innerText="Download Merged File"
            className={`${util.p_centered}`}
            onFileDownload={props.onMergedFileDownload}
            autoDownload={props.downloadMergedFile}
            id="a-merge-download"
        />
        :
        undefined
    )

    const filesSelected = props.fileList.length > 0;
    return (    
        <>
            <h3 className={`${util.tab_header}`}>Combine PDF Files</h3>
            
            <SelectFilesControls
                onFileListChanged={props.onFileListChanged}
                fileList={props.fileList}
                onClearAll={props.onClearAll}
                className={util.bottom_margin}
            />

            <div className={cx(util.collapsible, filesSelected? util.show :"")}>
                <div className={cx(util.left_vert_bar, util.bottom_margin)}>
                    <button 
                        disabled={props.mergeInProgress}
                        onClick={props.onBeginPDFMerge}
                        className={`${util.full_width}`}
                        id="btn-merge-pdf"
                    >
                        <Loadable loading={props.mergeInProgress}>
                            Merge PDF Files
                        </Loadable>
                    </button>
                
                    {downloadLink}
                </div>
                {preview}
            </div>
        </>
    )
}