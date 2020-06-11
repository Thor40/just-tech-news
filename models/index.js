const User = require('./User');
const Post = require('./Post');

// create associations
// Post model belongs to User model
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// post belongs to one user, but not many users
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Post };