const Product = require('../Module/Product.js');

// Helper to escape user input for regex
function escapeRegex(text) {
  return text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    if (products && products.length > 0) {
      return res.status(200).json(products);
    }
    return res.status(404).json({ message: 'No products found' });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getProducById = async (req, res) => {
  const productId = req.params.id;
  try {
    // Try to find by Mongo _id first
    let product = null;
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    }

    // If not found by _id, try by the numeric `id` field stored in documents
    if (!product) {
      product = await Product.findOne({ id: productId });
    }

    if (product) {
      return res.status(200).json({ product });
    }
    return res.status(404).json({ message: 'Please enter a correct product ID' });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ message: 'Error fetching product by ID', error: error.message });
  }
};

exports.getProducByName = async (req, res) => {
  const productName = req.params.name;
  try {
    const regex = new RegExp('^' + escapeRegex(productName) + '$', 'i');
    const products = await Product.find({ name: { $regex: regex } });
    if (products && products.length > 0) {
      return res.status(200).json({ product: products });
    }
    return res.status(404).json({ message: 'Please enter a valid name' });
  } catch (error) {
    console.error('Error fetching product by name:', error);
    return res.status(500).json({ message: 'Error fetching product by name', error: error.message });
  }
};

exports.getProducByPrice = async (req, res) => {
  const productPrice = req.params.price;
  try {
    // Price is stored as string in the schema; match exact string or numeric-like
    const products = await Product.find({ price: productPrice });
    if (products && products.length > 0) {
      return res.status(200).json({ product: products });
    }
    return res.status(404).json({ message: 'No products found for the provided price' });
  } catch (error) {
    console.error('Error fetching product by price:', error);
    return res.status(500).json({ message: 'Error fetching product by price', error: error.message });
  }
};

// Add a product (used by POST /Product/add)
exports.addProduct = async (req, res) => {
  try {
    const { id, img, name, price, path } = req.body;
    if (id == null || !img || !name || !price || !path) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    // Prevent duplicate `id` values if `id` is used as a numeric identifier
    const existing = await Product.findOne({ id: id });
    if (existing) {
      return res.status(409).json({ message: 'A product with this id already exists' });
    }

    const product = new Product({ id, img, name, price, path });
    const saved = await product.save();
    return res.status(201).json({ message: 'Product created', product: saved });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};


