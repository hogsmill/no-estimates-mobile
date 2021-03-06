
import stringFuns from './stringFuns.js'

const Roles = {

  iHaveRole: function(column, role, otherRoles) {

    let haveRole = false
    if (column == stringFuns.roleToColumn(role)) {
      haveRole = true
    } else {
      for (let i = 0; i < otherRoles.length; i++) {
        if (column == stringFuns.roleToColumn(otherRoles[i])) {
          haveRole = true
        }
      }
    }
    return haveRole
  }
}

export default Roles
