export default (_, args, { loaders }) => {
  const { participation } = loaders
  return participation.load(_.id)
}
