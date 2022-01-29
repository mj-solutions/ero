import { DirectiveBinding } from "vue";

interface VHoverEl extends HTMLElement {
  mouseEnter: (this: HTMLElement, ev: MouseEvent) => any;
  mouseLeave: (this: HTMLElement, ev: MouseEvent) => any;
}

export const vHover = {
  beforeMount(el: VHoverEl, binding: DirectiveBinding) {
    if (!binding.value || typeof binding.value !== "function") {
      throw new Error("v-hover needs a callback to function properly");
    }

    el.mouseEnter = () => binding.value(true);
    el.mouseLeave = () => binding.value(false);

    el.addEventListener("mouseenter", el.mouseEnter);
    el.addEventListener("mouseleave", el.mouseLeave);
  },
  beforeUnmount(el: VHoverEl) {
    el.removeEventListener("mouseenter", el.mouseEnter);
    el.removeEventListener("mouseleave", el.mouseLeave);
  },
};
