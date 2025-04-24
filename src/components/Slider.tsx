import { JSX } from "solid-js";
import styles from './slider.module.css'

export function Slider(props: { children: JSX.Element[] }) {
    return (
        <div class={styles.sliderContainer}>
            <div class={styles.slider}>
                <div class={styles.slides}>
                    {props.children?.map((slide, index) => (
                        <div id={`slides__${index}`} class={styles.slide}>
                            <div class={styles.slideInner}>
                                {slide}
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    )
}