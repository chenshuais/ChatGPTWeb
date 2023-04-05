// import { isNotEmptyString } from '../utils/is'
import { deCrypto } from './crypto'
import { getUserPass } from './supabaseClient'

const auth = async (req, res, next) => {
  // const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  try {
    const Authorization = req.header('Authorization')
    if (!Authorization)
      throw new Error('Error: 无访问权限 | No access rights')
    const bearer = deCrypto(Authorization.replace('Bearer ', '').trim())
    const beArr = bearer.split(' ')
    if (beArr.length !== 2)
      throw new Error('Error: 无访问权限 | No access rights')
    const pass = beArr[0]
    const qt = beArr[1]
    const rt = new Date().getTime()
    if (Math.abs(rt - qt) > 1000 * 5)
      throw new Error('Error: 无访问权限 | No access rights')
    const userPass = await getUserPass(pass)
    if (!userPass)
      throw new Error('Error: 无访问权限 | No access rights')
    const currentTime = new Date().getTime()
    const expiryTime = new Date(userPass.expire_at).getTime()
    if (expiryTime < currentTime)
      throw new Error('Error: 密钥过期 | Secret key is Expired')
    next()
  }
  catch (error) {
    res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
  }
}

export { auth }
