const Table = ({ children }) => {
  return <table className="table">{children}</table>;
};

Table.Title = ({ children }) => {
  return <h3 className="table-title">{children}</h3>;
};

Table.Head = ({ children }) => {
  return <th className="table-head">{children}</th>;
};

Table.Row = ({ children }) => {
  return <tr className="table-row">{children}</tr>;
};

Table.Cell = ({ children }) => {
  return <td className="table-cell">{children}</td>;
};

export default Table;
