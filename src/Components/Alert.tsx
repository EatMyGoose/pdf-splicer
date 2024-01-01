import { JSX } from "preact/jsx-runtime"
import styles from "./Alert.module.css"
import { cx } from "../util"

export interface IAlert
{
    title? : string,
    msgbody: JSX.Element | string
    hidden?: boolean
    className? : string
}

export function Alert(props: IAlert)
{
    if(props.hidden) return <></>;

    return (
        <div 
            className={cx(styles.alert_container)}
        >
            {(props.title? 
                <p><strong>{props.title}</strong></p>:
                undefined
            )}

            <p>{props.msgbody}</p>
        </div>
    );
}