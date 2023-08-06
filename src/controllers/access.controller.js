'use strict'

const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require('../core/success.response');

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {

        // return res.status(200).json({
        //     message: '',
        //     metadata:
        // })
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit:10
            }
        }).send(res)
      
    }
  }

  // Viết một Middleware để sử dụng handler error ngay tại router
  
  module.exports = new AccessController();
  