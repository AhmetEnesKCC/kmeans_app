const TabWrapper = ({ tabs, selected, onSelect }) => {
  return (
    <div className="category-tabs">
      {tabs.map((tab) => (
        <div
          onClick={() => onSelect(tab)}
          className={`tab ${selected === tab.index ? "selected" : ""}`}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default TabWrapper;
