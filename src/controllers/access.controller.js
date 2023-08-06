'use strict'

const AccessService = require("../services/access.service");

class AccessController {

    signUp = async (req, res, next) => {
      
        return res.status(201).json( await AccessService.signUp(req.body)

        );
    }
  }

  // Viết một Middleware để sử dụng handler error ngay tại router
  
  module.exports = new AccessController();
  