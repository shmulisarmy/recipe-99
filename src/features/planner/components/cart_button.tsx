import { Icon } from "../../../components/ui";

function CartIcon() {
  return <Icon name="cart"/>;
}

export function CartButton(props: {
  count: number;
  onOpen: () => void;
  label: string;
  class?: string;
}) {
  return <button class={`button button-secondary ${props.class ?? ""}`} type="button" aria-label={props.label} onClick={props.onOpen}><CartIcon/>{props.count}</button>;
}
