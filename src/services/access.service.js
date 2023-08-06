'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto');
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError } = require("../core/error.response");

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',// 001 || 010 || 011 để có quyền ghi
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({name, email, password}) => {
        // try {
            // Step 1 : check email exists?
            const holderShop = await shopModel.findOne({email}).lean() // lean() : trả về một object javascript thuần túy
            if(holderShop){
                throw new BadRequestError('Error: Shop already exists!')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop) {
                // created privatekey, publickey

                const privateKey = crypto.randomBytes(32).toString('hex')
                const publicKey = crypto.randomBytes(32).toString('hex')

                console.log('privateKey, publicKey::', { privateKey, publicKey })

                // created publickeyString
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore){
                    return{
                        code: 'xxx',
                    message: 'publicKeyString error!' 
                    }
                }

                // cresate token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

                if(!tokens){
                    return{
                        code: 'xxx',
                    message: 'tokens error!' 
                    }
                }else{
                    console.log('tokens::', tokens)}

                    return {
                        code: 201,
                        metadata: {
                            shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                            tokens
                        }
                    }
            }
            return {
                code: 200,
                metadata: null
            }
        // } catch (error) {
        //     return{
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService