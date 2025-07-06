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
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
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
      values: ['tech', 'beauty', 'health', 'finance', 'other'],
      message: '{VALUE} is not a supported category'
    },
    default: ['other']
  },


  promoText: {
    type: String,
    required: true
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
  },

  postedToTelegram: {
    type: Boolean,
    default: false
  },
  telegramGroups: [{
    type: String
  }],
  subreddit: {
    type: String,
    default: 'r/startups'
  },
  views: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'posted', 'failed'],
    default: 'pending'
  },
  redditUrl: {
    type: String,
    default: null
  }
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

ProductSchema.index({
  name: 'text',
  description: 'text',
  category: 'text'
});

const Product = model('Product', ProductSchema);
module.exports = Product;