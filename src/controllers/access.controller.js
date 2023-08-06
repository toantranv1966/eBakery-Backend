'use strict'

const AccessService = require("../services/access.service");

const { OK, CREATED } = require('../core/success.response');

class AccessController {

    signUp = async (req, res, next) => {

        // return res.status(200).json({
        //     message: '',
        //     metadata:
        // })
        new CREATED({
            message: 'Registed OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit:10
            }
        }).send(res)
      
    }
  }

  // Viết một Middleware để sử dụng handler error ngay tại router
  
  module.exports = new AccessController();
  