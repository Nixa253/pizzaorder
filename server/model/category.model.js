const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const categorySchema = new Schema({
    nameCategory: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null
    },
    image: {
        type: String,
        required: true,
    }
}, { collection: 'category' });

// Function to recursively check if a category is a parent of itself
async function isParentValid(categoryId, parentId) {
    console.log(`Checking validity: categoryId=${categoryId}, parentId=${parentId}`);
    if (!parentId) return true;  // No parent, so it's valid

    // Get the parent category using the parentId
    const parentCategory = await CategoryModel.findById(parentId);

    if (!parentCategory) {
        console.log(`Parent category ${parentId} not found`);
        return false; // Parent doesn't exist, so it's invalid
    }

    console.log(`Parent category found: ${parentCategory._id}`);

    // If the parentId is the same as the categoryId, it's invalid
    if (parentCategory._id.equals(categoryId)) {
        console.log(`Invalid: category ${categoryId} cannot be its own parent.`);
        return false;
    }

    // Check up the chain recursively
    return isParentValid(categoryId, parentCategory.parentCategory);
}

// Pre-save middleware to validate category hierarchy
categorySchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = this._id || new mongoose.Types.ObjectId();
    }

    if (this.parentCategory) {
        const isValid = await isParentValid(this._id, this.parentCategory);
        if (!isValid) {
            const error = new Error('Invalid category hierarchy: a category cannot be its own parent or ancestor.');
            error.name = 'CategoryHierarchyError';
            return next(error);
        }
    }
    next();
});

const CategoryModel = db.model('category', categorySchema);

module.exports = CategoryModel;
