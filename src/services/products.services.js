const db = require('../database/models');

const getAllProducts = async (limit, offset) => {
    try {
        
        const {count, rows} = await db.Product.findAndCountAll({
            attributes : {
                exclude : ['createdAt','updatedAt','categoryId']
            },
            limit,
            offset,
            include : [
                {
                    association : 'category',
                    attributes : ['name']
                }
            ]
        })

        return {
            total : count,
            products : rows
        }

    } catch (error) {
        console.log.apply(error);
        throw {
            status : error.status || 500,
            message : error.message || "ERROR ene el servicio de Productos",
        }
    }
}

const getProductById = async (id) => {
    try {

        if(!id || isNaN(id)){
            throw {
                status : 400,
                message : 'ID inexistente o Corrupto'
            }
        }

        const product = await db.Product.findByPk(id,{
            attributes : {
                exclude : ['createdAt','updatedAt','categoryId']
            },
            include : [
                {
                    association : 'category',
                    attributes : ['name']
                }
            ]
        })

        if(!product){
            throw {
                status : 404,
                message : 'Producto no encontrado'
            }
        }

        return product

    } catch (error) {
        console.log(error);
        throw {
            status : error.status || 500,
            message : error.message || "ERROR ene el servicio de Productos",
        };
    }
}

const createProduct = async (data) => {
    try {
        
        const newProduct = await db.Product.create(data)

        return newProduct

    } catch (error) {
        console.log(error);
        throw {
            status : error.status || 500,
            message : error.message || "ERROR ene el servicio de Productos",
        }
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct
}