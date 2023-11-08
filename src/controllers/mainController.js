const db = require('../database/models')
const {Op} =require('sequelize')

const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		// Do the magic

		const productsVisited = db.Product.findAll({
			where : {
				categoryId : 1
			}
		});

		const productsInsale = db.Product.findAll({
			where : {
				categoryId : 2
			}
		});

		Promise.all([productsVisited, productsInsale])
			.then(([productsVisited, productsInsale]) => {
				return res.render('index', {
					productsVisited, 
				productsInsale,
				toThousand
				})
			})
			.catch(error => console.log(error))

	},
	search: (req, res) => {
		// Do the magic

		db.Product.findAll({
			where : {
				[Op.or] : [
					{
						name : {
							[Op.substring] : req.query.keywords
							 
							}
					},
					{
						description : {
						[Op.substring] : req.query.keywords
					}
					
					}
					
				]
				
			}
		})
			.then(results => {
				return res.render('results', {
					results,
					toThousand,
					keywords : req.query.keywords
				});
			})

	},
};

module.exports = controller;
