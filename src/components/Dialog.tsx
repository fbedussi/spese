import { createEffect, JSXElement } from 'solid-js';

export function Dialog(props: {
  children: JSXElement;
  open: boolean;
  id?: string;
  class?: string;
  onBackdropClick?: () => void;
}) {
  let el: HTMLDialogElement | undefined;

  createEffect(() => {
    if (props.open) {
      el?.showModal();
    } else {
      el?.close();
    }
  });

  return (
    <dialog
      ref={el}
      id={props.id}
      class={props.class}
      onClick={(ev) => {
        if (!el || !props.onBackdropClick) {
          return;
        }

        if (ev.target === el) {
          props.onBackdropClick();
        }
      }}
    >
      {props.children}
    </dialog>
  );
}
