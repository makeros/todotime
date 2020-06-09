module.exports = function dbInMemory (tables = []) {
  const db = tables.reduce((acc, tableName) => {
    return {
      ...acc,
      [tableName]: new Set()
    }
  }, {})

  return {
    getTable: function (tableName) {
      return db[tableName]
    }
  }
}
