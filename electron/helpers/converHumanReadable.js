const convertHumanReadable = (string) => {
  string = string.split(".").slice(0, -1);
  return string.join(" ").replace("algorithm_", "").replaceAll("_", " ");
};

module.exports = convertHumanReadable;
