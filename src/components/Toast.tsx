import { type JSXElement, createEffect } from 'solid-js';
import styles from './toast.module.css';

export function Toast(props: {
  children: JSXElement;
  open: boolean;
  id?: string;
  class?: string;
  autocloseAfter?: number;
}) {
  let el: HTMLDivElement | undefined;

  createEffect(() => {
    if (props.open) {
      el?.showPopover();
      if (props.autocloseAfter) {
        setTimeout(() => {
          el?.hidePopover();
        }, props.autocloseAfter);
      }
    } else {
      el?.hidePopover();
    }
  });

  return (
    <div
      ref={el}
      id={props.id}
      classList={{ [props.class || '']: !!props.class, [styles.toast]: true }}
      popover
    >
      {props.children}
    </div>
  );
}
