export default async ({ id, board }, args, { loaders }) => {
  const res = await Promise.all([
    loaders.participation.load(id),
    loaders.boardActivity.load(board),
  ])

  const participants = res[0]
  const boardActivity = res[1]

  const participantMap = {}
  participants.forEach(p => {
    const pid = p.id
    if (boardActivity.indexOf(pid) > -1) {
      participantMap[pid] = true
    }
  })
  return participantMap
}
