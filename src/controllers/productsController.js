const db = require('../database/models')

const fs = require('fs');
const { unlinkSync, existsSync } = require("fs");
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');

const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic

		db.Product.findAll()
		.then(products => {
			return res.render("products", {
				products,
				toThousand
			})
		})

		.catch(error => console.log(error))

	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic

		db.Product.findByPk(req.params.id)
		.then(product => {
			return res.render('detail', {
				...product.dataValues,
				toThousand
			})
		})
		
		.catch(error => console.log(error))
		
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic

		db.Category.findAll()
		.then(categories => {
			return res.render('product-create-form', {
				categories
			});
		}).catch(error => console.log(error))
		
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic

		const {name, price, discount, description, categoryId} = req.body;

		/*if([name, price, discount, description, categoryId].includes("")){
			return res.send('upsssss')
		}*/
		 
		db.Product.create({

			name : name.trim(),
			price,
			discount : discount || 0,
			categoryId,
			description : description.trim(),
			image : req.file ? req.file.filename : null,

		})
		.then(product => {
			console.log(product);
			return res.redirect('/products')
		})
		.catch(error => console.log(error))
		
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		const categories = db.Category.findAll();
		const product =  db.Product.findByPk(req.params.id)

		Promise.all([categories, product])
		.then(([categories, product]) => {
			return res.render("product-edit-form", {
				...product.dataValues,
				categories
				
			})
		})
		.catch(error => console(error))
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic

		const {name, price, discount, description, categoryId, image} = req.body;

		req.file&&
		existsSync(`./public/images/products/${image}`)&&
		unlinkSync(`./public/images/products/${image}`);
			
		db.Product.findByPk(req.params.id, {
			attributes : ['image']
		})
		.then(product => {
			db.Product.update(
				{
				name : name.trim(),
				price,
				discount,
				categoryId,
				description : description.trim(),
				image : req.file ? req.file.filename : product.image,
				},
				{
					where : {
						id : req.params.id
					}
				}
			)
			.then(response => {
				console.log(response)
				return res.redirect('/products/detail/' + req.params.id)
			})
			.catch(error => console.log(error))
				
			
		return res.redirect("/products");
		})

				
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic

		db.Product.destroy({
			where : {
				id : req.params.id
			}
		})
		.then(response => {
			console.log(response);
			return res.redirect("/products");
		})
		.catch(error => console.log(error))
	},
};

		/*const productsModify = products.filter((product) => {
			if(product.id === +req.params.id) {
				
					existsSync(`./public/images/products/${product.image}`)&&
					unlinkSync(`./public/images/products/${product.image}`);
			}
			return product.id !== +req.params.id;
		});
		
		
		fs.writeFileSync(productsFilePath, JSON.stringify(productsModify, null, 3), "utf8");

			
	}
};*/

module.exports = controller;

