const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
      console.log(req.session);
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // pass a single post object into the homepage template
        // data that Sequelize returns is actually a Sequelize object
        console.log(dbPostData[0]);
        // We need the entire array of posts to be in the template
        // serialize the entire array
        // loop over and map each Sequelize object into a serialized version of itself, saving the results in a new posts array
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // add the array to an object and continue passing an object to the template
        res.render('homepage', { 
            posts,
            loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
          id: req.params.id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
          if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
          }
    
          // serialize the data
          const post = dbPostData.get({ plain: true });
    
          // pass data to template
          res.render('single-post', { 
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });

module.exports = router;