import { TReducer, TReducerConsumer } from "../TReducer";
import { FileListItem } from "./FileListItem";
import { SwapInPlace, cx } from "../util";
import util from "../util.module.css"
import { FileSelector } from "./FileSelector";

import styles from "./SelectFilesControls.module.css"
import { FileDropArea } from "./FileDropArea";

interface ISelectFilesControls
{
    onFileListChanged: TReducerConsumer<File[]>;
    onClearAll: () => void;
    fileList: File[]
    className? : string
}

export function SelectFilesControls(props: ISelectFilesControls)
{
    function makeDeleteFileReducer(fileIdx: number): TReducer<File[]>
    {
        return (prev: File[]) => prev.filter((_, idx) => idx !== fileIdx);
    }

    function makeShiftFileReducer(idx: number, offset: number) : TReducer<File[]>
    {
        return (prev: File[]) => {
            const copy = [...prev];
            SwapInPlace(copy, idx, idx + offset);
            return copy;
        };
    }

    function clearAllReducer(_: File[]) : File[]
    {
        return [];
    }

    function makeAppendFileReducer(newFiles: File[]): TReducer<File[]>
    {
        return (prev: File[]) => prev.concat(newFiles);
    }

    function handleFileAdded(files: File[] | undefined)
    {
        if(files === undefined) return;

        props.onFileListChanged(makeAppendFileReducer(Array.from(files)));
    }

    function handleClearAll()
    {
        props.onFileListChanged(clearAllReducer);
        props.onClearAll();
    }

    const noFileSelected = (
        props.fileList.length > 0? 
        undefined:
        <div className={styles.no_files_display}>
            <div className={util.p_vert_horz_centering_container}>
                <h5>No Files Selected</h5>
            </div>
        </div>
    )

    return (
        <div className={props.className || ""}>
            <div className={cx(util.left_vert_bar, util.bottom_margin)}>
                <p><strong>File Selection</strong></p>
                
                <FileSelector
                    disabled={false}
                    busy={false}
                    onFileChanged={handleFileAdded}
                    className={cx(util.full_width, styles.select_file_container)}
                    multiple={true}
                >
                    <div className={cx(util.full_width, styles.file_selector)}>
                        <p>Select Files</p>
                    </div>                    
                    <div style={{backgroundColor: "white", height:"5em", color:"black"}}>
                        <FileDropArea 
                            className={cx(util.p_vert_horz_centering_container)}
                            onPdfFileSelected={(pdfFiles) => handleFileAdded(pdfFiles)}
                        >
                            <h4>Drag & Drop Files</h4>
                        </FileDropArea>
                    </div>
                </FileSelector>
            </div>
            
            <div className={util.left_vert_bar}>
                <div className="flex">
                    <h4 class="half" style={{paddingBottom:"0"}}>File List</h4>
        
                    <button 
                        class="off-fourth"
                        onClick={handleClearAll}
                        style={{paddingBottom:"0", paddingTop:"0"}}
                    >
                        Clear All
                    </button>
                </div>

                {noFileSelected}
                <ol style={{marginBottom:"0"}}>
                    {props.fileList.map((f, idx) => {
                        return (
                            <li key={idx} className={cx(util.drop_shadow, styles.file_row_radius)}>
                                <FileListItem
                                    index={idx}
                                    fileName={f.name}
                                    isFirst={idx === 0}
                                    isLast={idx === props.fileList.length - 1}
                                    onChangePosition={(idx, offset)=> props.onFileListChanged(makeShiftFileReducer(idx, offset))}
                                    onDelete={(idx)=> props.onFileListChanged(makeDeleteFileReducer(idx))}
                                />
                            </li>
                        )
                    })}
                </ol>
            </div>
        </div>
    )
}