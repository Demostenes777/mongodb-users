const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');
const assert = require('assert');

describe('Association', () => {
  let joe, blogPost, comment;

  beforeEach((done) => {
    joe = new User({ name:'Joe' });
    blogPost = new BlogPost({ title:'JS is great', content: 'ye' });
    comment = new Comment ({ content:'Cool' });

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => {
        done();
      });

  });

  it('saves a relation between a user and a blog post',(done) => {
    User.findOne({name:'Joe'})
      .populate('blogPosts')
      .then((user) => {
        assert(user.blogPosts[0].title === 'JS is great' );
        done();
      });
  });

  it('saves a full relation tree', (done) => {
    User.findOne({name:'Joe'})
      .populate({
        path: 'blogPosts',
        populate: {
          path: 'comments',
          model: 'comment'
        }
      })
      .then((user) => {
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title == 'JS is great');
        assert(user.blogPosts[0].comments[0].content === 'Cool');
        done();
      });
  });
});
