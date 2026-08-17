export function Select<T>(props: {
  options: T[];
  selected?: T;
  toString: (item: T) => string;
  whenSelected?: (item: T) => void;
  ref?: (el: HTMLSelectElement) => void;
  SelectClass?: string;
  SelectStyle?: string;
  OptionsClass?: string;
  OptionsStyle?: string;
}) {
  const selectedIndex = () => {
    if (props.selected === undefined) return undefined;
    const selectedLabel = props.toString(props.selected);
    const index = props.options.findIndex(
      (option) => props.toString(option) === selectedLabel,
    );
    return index === -1 ? undefined : String(index);
  };

  return (
    <select
      ref={props.ref}
      class={props.SelectClass}
      style={props.SelectStyle}
      value={selectedIndex()}
      onChange={(e) => {
        const index = Number(e.target.value);
        props.whenSelected?.(props.options[index]);
      }}
    >
      {props.options.map((item, index) => (
        <option
          selected={selectedIndex() === String(index)}
          class={props.OptionsClass}
          style={props.OptionsStyle}
          value={index}>{props.toString(item)}</option>
      ))}
    </select>
  );
}
