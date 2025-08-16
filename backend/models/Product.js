const { Schema, model } = require('mongoose');
const ProductSchema = new Schema({

  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: function(v) {
        try {
          if (v.startsWith('http://') || v.startsWith('https://')) {
            new URL(v);
            return true;
          }
          return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(\/[^\s]*)?$/.test(v);
        } catch (err) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },

  contact: {
    type: String,
    trim: true,
    maxlength: [100, 'Contact information cannot exceed 100 characters']
  },

  categories: {
      type: [String],
      required: [true, 'At least one category is required'],
      validate: {
        validator: function(cats) {
          return cats.length > 0 && cats.length <= 3;
        },
      message: 'Select 1-3 categories'
    },
    enum: {
      values: ['tech', 'startup', 'cybersecurity', 'finance', 'health', 'beauty', 'gaming', 'education', 'travel', 'food', 'fashion', 'sports', 'music', 'art', 'science', 'books', 'movies', 'pets', 'home', 'other'],
      message: '{VALUE} is not a supported category'
    },
    default: ['other']
  },

  multiPlatformContent: {
    reddit: {
      title: String,
      post: String
    },
    twitter: {
      thread: [String]
    },
    linkedin: String,
    instagram: String,
    email: {
      subject: String,
      body: String
    }
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

ProductSchema.index({
  name: 'text',
  description: 'text',
  categories: 'text'
});

const Product = model('Product', ProductSchema);
module.exports = Product;