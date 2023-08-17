import { StatusCodes } from 'http-status-codes'

export default (type) => {
  // express 的 middleware 格式： (req,res,next)=>{    }
  return (req, res, next) => {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(type)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    }
    next()
  }
}
