import probe from 'probe-image-size'

export default async url => {
  let result
  try {
    result = await probe(url, { timeout: 5000 })
  } catch (e) {
    return null
  }
  return result
}
