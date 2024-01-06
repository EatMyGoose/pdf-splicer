import colors from "../color.module.css"
import util from "../util.module.css"
import titleImage from "../assets/rat-256.png"
import styles from "./Header.module.css" 
import { cx } from "../util"
import { useState } from "preact/hooks"
import { SwitchTabControls } from "./SwitchTabButtons"
import { TTab } from "../types"

export interface IAppHeader 
{
    setActiveTab: (newTab: TTab) => void
}

export function AppHeader(props: IAppHeader)
{
    const [spin, setSpin] = useState<boolean>(false);

    return (
        <div className={cx(colors.bg, styles.header_bar)}>
            <div 
                className={cx(util.centeredElement, styles.v_centre_children, styles.spread_nav)}
            >
                <div className={styles.v_centre_children}>
                    <img 
                        src={titleImage} 
                        className={cx(styles.title_image, spin? styles.rotating_3d : "")}
                        onClick={()=>setSpin(true)}
                    />
                    <h3 className={cx(colors.text)}>
                        <p>PDF Splicer</p>
                    </h3>
                </div>
                

                <div 
                    className={cx(util.show_xs, styles.nav_div)}
                >
                    <SwitchTabControls
                        mergeText="Combine"
                        extractText="Extract"
                        setActiveTab={props.setActiveTab}
                    />
                </div>
            </div>
        </div>
    )
}