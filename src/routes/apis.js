const productValidator = require('../validations/productValidator')
const { listProducts, showProduct, createProduct, updateProducts, deleteProducts } = require('../controllers/apiProductsController')
const upload = require('../../middlewares/upload')

const router = require('express').Router()

/* /apis  */

/* Prodcutos  */
router
    .get('/products',listProducts)
    .get('/products/:id', showProduct)
    .post('/products', upload.single('image'), productValidator, createProduct)
    .put('/products/:id', updateProducts)
    .delete('/products/:id', deleteProducts)



/* Usarios  */




/* Categorias  */






module.exports = router