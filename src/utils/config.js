import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const prepare = (o) => {
  o._id = o._id.toString()
  return o
}

export const getPayload = (token, secret=process.env.SECRET) => {
  try {
    const payload = jwt.verify(token, secret)
    return {
      loggedIn: true, 
      payload
    }
  } catch (err) {
    return {
      loggedIn: false,
      error: err
    }
  }
}

export const encryptPassword = password => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      reject(err)
      return false
    }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        reject(err)
        return false
      }
      resolve(hash)
      return true
    })
  })
})

export const comparePassword = (password, hash) => new Promise((resolve, reject) => {
  try {
    const isMatch = bcrypt.compare(password, hash)
    resolve(isMatch)
    return true
  } catch (err) {
    reject(err)
    return false
  }
})

export const getToken = (payload, secret=process.env.SECRET, expiresIn=604800) => {
  const token = jwt.sign(payload.toJSON ? payload.toJSON() : payload, secret, {
    expiresIn, // 1 Week
  })
  return token
}