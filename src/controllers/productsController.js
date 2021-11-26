const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const finalPrice = (price,discount) => +toThousand((price - (discount * price / 100)).toFixed(0))

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render("products",{
			products,
			toThousand,
			finalPrice
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let product = products.find(producto => +producto.id === +req.params.id)
		return res.render("detail",{
			product,
			finalPrice,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		
		const {name,price,discount,category,description} = req.body

		let	product = {
			id : products.length != 0 ? products[products.length - 1].id + 1 : 1,
			name,
			price,
			discount,
			category,
			description,
			image: req.file.filename
			}
		products.push(product)
            fs.writeFileSync(path.join(__dirname,'..','data','productsDataBase.json'),JSON.stringify(products,null,2),'utf-8');
			res.redirect("/")
		},
	// Update - Form to edit
	edit: (req, res) => {
		let product = products.find(producto => producto.id === +req.params.id)
        return res.render('product-edit-form',{
            productToEdit: product,
        })
		
	},
	// Update - Method to update
	update: (req, res) => {
		const {name,price,discount,description,category} = req.body;

            products.forEach(producto => {
                if(producto.id === +req.params.id){
                    producto.name = name;
                    producto.description = description;
                    producto.price = +price;
					producto.discount = +discount
                    producto.category = category
                }
            });
    
            fs.writeFileSync(path.join(__dirname,'..','data','productsDataBase.json'),JSON.stringify(products,null,2),'utf-8');
            return res.redirect('/')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
        let productosModificados = products.filter(producto => producto.id !== +req.params.id);

        fs.writeFileSync(path.join(__dirname,'..','data','productsDataBase.json'),JSON.stringify(productosModificados,null,2),'utf-8');
        return res.redirect('/')
	}
};

module.exports = controller;