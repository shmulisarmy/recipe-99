export function Select<T>(props: {
  options: T[];
  toString: (item: T) => string;
  whenSelected?: (item: T) => void;
  SelectClass?: string;
  SelectStyle?: string;
  OptionsClass?: string;
  OptionsStyle?: string;
}) {
  return (
    <select
      class={props.SelectClass}
      style={props.SelectStyle}
      onChange={(e) => {
        const index = Number(e.target.value);
        props.whenSelected?.(props.options[index]);
      }}
    >
      {props.options.map((item, index) => (
        <option
          class={props.OptionsClass}
          style={props.OptionsStyle}
          value={index}>{props.toString(item)}</option>
      ))}
    </select>
  );
}
