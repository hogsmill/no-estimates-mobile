
const StringFuns = {

  properCase: function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  },

  pluralString: function(n, word) {
    if (n == 1) {
      return word
    } else {
      return word + 's'
    }
  },

  roleToColumn: function(role) {
    return role.replace(/er$/, '').toLowerCase()
  },

  sanitize: function(s) {
    return s.replaceAll(/[^a-zA-Z0-9' ]/g, '').trim()
  },

  idSafe: function(s) {
    return s.replaceAll(/[^a-zA-Z0-9]/g, '').trim()
  },

  htmlDecode: function(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html')
    return doc.documentElement.textContent
  }
}

export default StringFuns
