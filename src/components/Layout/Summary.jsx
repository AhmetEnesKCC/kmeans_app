import { useSelector } from "react-redux";

const Summary = ({ children }) => {
  const { algorithms, datasets, loop } = useSelector(
    (state) => state.selectedArguments
  );

  return (
    <div className="summary-wrapper">
      <Summary.Title>algorithms</Summary.Title>
      <Summary.List data={algorithms} />
      <Summary.Title>datasets</Summary.Title>
      <Summary.List data={datasets} />

      <Summary.Title>loop</Summary.Title>
      <Summary.List data={loop} />
    </div>
  );
};

Summary.Title = ({ children }) => {
  return <h3>{children}</h3>;
};

Summary.List = ({ data }) => {
  return data instanceof Array ? (
    <ul>
      {data.map((d) => (
        <li>{d.label}</li>
      ))}
    </ul>
  ) : (
    data
  );
};

export default Summary;
