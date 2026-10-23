module.exports = {
  choose: function(arr) { return arr[Math.floor(Math.random()*arr.length)]; },
  add_history: function(data, add) { data = JSON.parse(data); data.push(add); return data; }
};