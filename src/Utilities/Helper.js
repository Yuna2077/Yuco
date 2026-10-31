module.exports = {
  choose: function(arr) { return arr[Math.floor(Math.random()*arr.length)]; },
  add_history: function(data, add) {
    if (!data || typeof data != "string" || data == "{}") data = "[]";
    data = JSON.parse(data);
    data.push(add);
    return data;
  }
};