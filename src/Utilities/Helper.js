module.exports = {
  choose: function(arr) { return arr[Math.floor(Math.random()*arr.length)]; },
  sleep: (ms) => new Promise(res => setTimeout(res, ms)),
  add_history: function(data, add) {
    if (!data || typeof data != "string" || data == "{}") data = "[]";
    data = JSON.parse(data);
    data.push(add);
    return data;
  }
};