import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create({...req.body, sellerId: req.user.id});
        res.json(product);
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
};


export const getProducts = async (req, res) => {
    try{
        const product = await Product.find().populate('sellerId', 'username email phone');
        res.json(product);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}