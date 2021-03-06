
module.exports = {

  average: function(result) {
    let sum = 0
    for (let i = 0; i < result.length; i++) {
      sum = sum + parseInt(result[i])
    }
    return sum == 0 ? 0 : sum / result.length
  }
}
