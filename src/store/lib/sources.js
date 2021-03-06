
const sources = [
  {name: 'Amount of Work in Progress', show: false} ,
  {name: 'Cards getting blocked', show: false} ,
  {name: 'Deployment Failing', show: false} ,
  {name: 'Urgent cards', show: false} ,
  {name: 'Dependencies', show: false},
  {name: 'Devops (working on Autodeploy)', show: false},
  {name: 'No work in specialisation', show: false},
  {name: 'Resource utilisation ("1 left at end of day)")', show: false},
  {name: 'PM (Vince!)")', show: false},
  {name: 'Losing a tester")', show: false}
]

module.exports = {

  sources: function() {
    return sources
  }
}

/*
Multitasking/Context switching (Duarte calls this “focus factor”)
Work in progress (strong lead indicator)
Dependencies (Team, System)
Team composition
Availability of specialists
Blockers
Selection policy (urgent cards “jump” over other WIP, incurring flow debt)
Collaboration policy
Utilization policy
Time spent estimating! 
Waiting for availability
Rework
Stages in team development (Tuckman)
Steps/ handoffs
Essential complication
Accidental complication 
Technology/ domain/ product
Specialization
*/
