'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto');
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../core/error.response");

// Service /
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',// 001 || 010 || 011 để có quyền ghi
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    /**
        - Step 1: check email in dbs?
        - Step 2: match password?
        - Step 3: create AT & RT and save to dbs
        - Step 4: generate tokens
        - Step 5: get data return login
     */

    static login = async ({email, password, refreshToken = null}) => {

        // 1. check email in dbs?
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new BadRequestError('Shop not resgistered!')
        }

        // 2. match password?
        const match = await bcrypt.compare(password, foundShop.password)
        if(!match){
            throw new AuthFailureError('Authentication error!')
        }

        // 3. create AT & RT and save to dbs
        // created privatekey, publickey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // 4. generate tokens
        const {_id: userId} = foundShop
        const tokens = await createTokenPair({userId, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })

        return {
                shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
                tokens
        }
    }

    static signUp = async ({name, email, password}) => {
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

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

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
    }
}

module.exports = AccessService