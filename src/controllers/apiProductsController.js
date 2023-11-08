const createError = require('http-errors');
const paginate = require('express-paginate');
const { getAllProducts, getProductById, createProduct } = require("../services/products.services");
const { validationResult } = require('express-validator');

module.exports = {
    listProducts : async (req,res) => {
        try {

            const {total, products} = await getAllProducts(req.query.limit, req.skip);

            const pagesCount = Math.ceil(total / req.query.limit);
            const currentPage = req.query.page;
            const pages = paginate.getArrayPages(req)(pagesCount,pagesCount,currentPage)

            return res.status(200).json({
                ok : true,
                data : products.map(product => {
                    return {
                        ...product.dataValues,
                        image : `${req.protocol}://${req.get('host')}/images/products/${product.image}`,
                        url : `${req.protocol}://${req.get('host')}/api/products/${product.id}`

                    }
                }),
                meta : {
                    total,
                    pagesCount,
                    currentPage,
                    pages
                }
            })
            
        } catch (error) {
            return res.status(error.status || 500).json({
                ok : false,
                status : error.status || 500,
                error : error.message || 'Upss, hubo un error, Sorry.'
            })
        }
    },

    showProduct : async (req,res) => {
        try {
            
            const product = await getProductById(req.params.id)

            return res.status(200).json({
                ok : true,
                data : {
                    ...product.dataValues,
                    image : `${req.protocol}://${req.get('host')}/images/products/${product.image}`,
                }
            })

        } catch (error) {
            return res.status(error.status || 500).json({
                ok : false,
                status : error.status || 500,
                error : error.message || 'Upss, hubo un error, Sorry.'
            })
        }
    },

    createProduct : async (req,res) => {
        try {

        const errors = validationResult(req);

            if(!errors.isEmpty()){

                //const errorsMessages = [] - Opcon 1

                let errorsMessages = {}

                let objetErrors = errors.mapped()

                for (const key in objetErrors) {
                    //errorsMessages.push(objetErrors[key].msg) - Opcion 1

                    errorsMessages = {
                        ...errorsMessages,
                        [objetErrors[key]['path']]:objetErrors[key]['msg']
                        //[objetErrors[key].path]:objetErrors[key].msg
                    }
                }

                    let error = new Error()
                    error.status = 400
                    error.message = errorsMessages

                    throw error

            }

            const data = {
                ...req.body,
                image : req.file ? req.file.filename : null
            }

        const {id} = await createProduct(data);

        const product = await getProductById(id)

            return res.status(200).json({
                ok : true,
                data : {
                    ...product.datavalue,
                    image : `${req.protocol}://${req.get('host')}/images/products/${product.image}`,
                }
                //errors : errorsMessages - Opcion 1
                //errors : errors.mapped() - Opcion 2
                //errors : errorsMessages - opcion 3
            })

        } catch (error) {
            return res.status(error.status || 500).json({
                ok : false,
                status : error.status || 500,
                error : error.message || 'Upss, hubo un error, Sorry.'
            })
        }
    },

    updateProducts : async (req,res) =>{
        try {
            
        } catch (error) {
            
        }
    },

    deleteProducts : async (req,res) => {
        try {
            
        } catch (error) {
            
        }
    }
}