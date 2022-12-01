import Table from "./table";

const ResultTable = ({
  algorithms,
  datasets,
  normalizations,
  results,
  prop = "sse",
  title,
}) => {
  return (
    <>
      <Table.Title>{title}</Table.Title>
      <Table>
        <thead>
          <Table.Row>
            <Table.Head></Table.Head>
            {[...datasets].map((ds) => {
              return normalizations.map((no) => {
                return (
                  <Table.Head key={ds.label + no.label}>
                    {ds.label} : {no.label}
                  </Table.Head>
                );
              });
            })}
          </Table.Row>
        </thead>
        <tbody>
          {algorithms.map((algo) => {
            return (
              <Table.Row key={algo.label}>
                <Table.Cell>{algo.label}</Table.Cell>
                {datasets.map((ds) => {
                  return normalizations.map((no) => (
                    <Table.Cell key={ds.label + no.label}>
                      {
                        results.find(
                          (r) =>
                            r.algorithm_name === algo.file &&
                            r.dataset_name === ds.file &&
                            r.normalization_name === no.file
                        )?.[prop]
                      }
                    </Table.Cell>
                  ));
                })}
              </Table.Row>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default ResultTable;
