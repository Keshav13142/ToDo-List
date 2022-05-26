exports.getDate = () => {
  let toaday = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let day = toaday.toLocaleDateString("en-US", options);
  return day;
};
exports.getDay = () => {
  let toaday = new Date();
  let options = {
    weekday: "long",
  };
  let day = toaday.toLocaleDateString("en-US", options);
  return day;
};
