const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// create associations
// Post model belongs to User model
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// post belongs to one user, but not many users
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// votes on posts belong to user using a foreign key constraint
User.belongsToMany(Post, {
    through: Vote,
        as: 'voted_posts',
        foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
        as: 'voted_posts',
        foreignKey: 'post_id'
});

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

Vote.hasMany(Vote, {
    foreignKey: 'user_id'
});

Vote.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };