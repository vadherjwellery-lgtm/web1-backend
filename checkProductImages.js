import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define Product schema (same as your model)
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    amazonLink: String,
    flipkartLink: String,
    meeshoLink: String,
    whatsappLink: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function checkProductImages() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const products = await Product.find({});
        console.log(`\n📦 Found ${products.length} products in database\n`);

        const issues = [];
        const validProducts = [];

        products.forEach((product, index) => {
            const isBase64 = product.imageUrl.startsWith('data:');

            if (isBase64) {
                validProducts.push(product);
                console.log(`✅ Product ${index + 1}: "${product.name}" - Base64 image (OK)`);
            } else {
                issues.push(product);
                console.log(`❌ Product ${index + 1}: "${product.name}" - Invalid imageUrl: ${product.imageUrl.substring(0, 50)}...`);
            }
        });

        console.log(`\n📊 Summary:`);
        console.log(`   Valid products (base64): ${validProducts.length}`);
        console.log(`   Invalid products (filename): ${issues.length}`);

        if (issues.length > 0) {
            console.log(`\n⚠️  ACTION REQUIRED:`);
            console.log(`   ${issues.length} product(s) have old filename-based imageUrl values.`);
            console.log(`   These products need to be updated through the admin panel:\n`);

            issues.forEach((product, i) => {
                console.log(`   ${i + 1}. "${product.name}" (ID: ${product._id})`);
            });

            console.log(`\n🔧 Solutions:`);
            console.log(`   1. Edit each product through the admin panel and re-upload the image`);
            console.log(`   2. Delete and recreate the products with new images`);
        } else {
            console.log(`\n✅ All products have valid base64 images!`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkProductImages();
