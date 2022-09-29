import { useSelector } from "react-redux";

const ContentInfo = () => {
  const infoData = useSelector((state) => state.contentInfo);

  return (
    <div className="content-info">
      <div className="table">
        {infoData &&
          Object.keys(infoData)?.map((d) => {
            return (
              <div className="tr">
                <td className="td">{String(d)}</td>
                <td className="td">{String(infoData[d])}</td>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ContentInfo;
