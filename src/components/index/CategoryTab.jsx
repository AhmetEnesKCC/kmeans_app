import { useEffect } from "react";
import { useState } from "react";
import Category from "./category";

const CategoryTab = ({
  title,
  placeholder,
  data,
  onSelect,
  defaultSelected = [],
}) => {
  const [selectedData, setSelectedData] = useState(defaultSelected);
  const [filteredData, setFilteredData] = useState(null);
  const [inputQuery, setInputQuery] = useState("");

  useEffect(() => {
    onSelect?.(selectedData);
  }, [selectedData]);

  useEffect(() => {
    if (inputQuery) {
      handleFilterData();
    }
  }, [inputQuery]);

  const handleFilterData = () => {
    let filterResult = data.content.filter((d) => d.label.includes(inputQuery));
    setFilteredData({ content: filterResult });
  };

  const handleSelectData = (d) => {
    if (selectedData.includes(d)) {
      setSelectedData(selectedData.filter((da) => da.label !== d.label));
      return;
    }
    setSelectedData([...selectedData, d]);
  };

  const handleSelectAllData = () => {
    if (
      data.content.length - selectedData.length ===
      (data?.disabledCount ?? 0)
    ) {
      setSelectedData([]);
      return;
    }
    setSelectedData([...data?.content.filter((da) => !da.disabled)]);
  };

  return (
    <>
      <Category>
        <Category.Title>{title}</Category.Title>
        <input
          value={inputQuery}
          placeholder={placeholder}
          className="category-search"
          onChange={(e) => setInputQuery(e.target.value)}
        />
        <Category.List onSelectAll={handleSelectAllData}>
          {(inputQuery === "" ? data : filteredData)?.content?.map((d) => (
            <Category.ListItem
              disabled={d.disabled}
              reason={d.disabled?.reason}
              selected={selectedData.includes(d)}
              onSelect={() => {
                handleSelectData(d);
              }}
              key={d.label}
            >
              {d.label}
            </Category.ListItem>
          ))}
        </Category.List>
      </Category>
    </>
  );
};

export default CategoryTab;
