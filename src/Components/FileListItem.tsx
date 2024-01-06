import upIcon from "../assets/sort-up-solid.svg"
import deleteIcon from "../assets/trash-can-regular.svg"
import { cx } from "../util"
import util from "../util.module.css"
import styles from "./FileListItem.module.css"

export interface IFileListItem
{
    index: number,
    fileName: string,
    isLast: boolean,
    isFirst: boolean,

    onChangePosition: (idx: number, offset: number) => void
    onDelete: (idx: number) => void
}

export function FileListItem(props: IFileListItem)
{
    return (
        <div className={styles.row_container}>
            <div>
                <p className={styles.truncated_text}>{props.fileName}</p>
            </div>

            <div className={styles.button_container}>
                <button 
                    className={styles.no_right_radius}
                    disabled={props.isFirst}
                    onClick={() => props.onChangePosition(props.index, -1)}
                >
                    <img src={upIcon} data="up"></img>   
                </button>
                <button
                    class={cx("warning", styles.no_left_radius, styles.no_right_radius)}
                    onClick={() => props.onDelete(props.index)}
                >
                    <img src={deleteIcon} data="delete" style={{padding:0, margin:0}}></img>
                </button>
                <button 
                    class={styles.no_left_radius}
                    disabled={props.isLast}
                    onClick={() => props.onChangePosition(props.index, 1)}
                >
                    <img className={util.rotate180} src={upIcon} data="down"></img>
                </button>
            </div>
        </div>
    )
}