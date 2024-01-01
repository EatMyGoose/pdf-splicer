import spinnerIcon from "../assets/rotate-solid.svg"
import util from "../util.module.css"
import styles from "./Spinner.module.css"

export function Spinner()
{
    return (
        <div className={util.p_vert_horz_centering_container}>
            <img 
                className={`${util.p_centered} ${styles.rotatingIcon}`}
                src={spinnerIcon}
            />
        </div>
    )
}