const mongoose = require('mongoose');
const Discussion = mongoose.model('Discussions');
const Tutorial = mongoose.model('Tutorials');

// Access database from here, CRUD (Create, Read, Update, Delete) operations

exports.create_a_comment = (req, res) => {
  req.body.tutorialId = req.params.tutorialId;
  const newComment = new Discussion(req.body);
  newComment.save((err, comment) => {
    if (err) {
      res.send(err);
    }
    else {
      res.json(comment);
    }
  });
};

exports.list_all_comments = (req, res) => {
  Discussion.find({tutorialId: req.params.tutorialId}).populate('userId').exec((err, comment) => {
    if (err) {
      res.send(err);
    }
    else {
      res.json(comment);
    }
  });
};

exports.update_a_comment = (req, res) => {
  var userInToken = req.user.userId;
  Discussion.findById(req.body.commentId, (err, comment) => {
    if (err) {
      res.send(err);
      return;
    }
    else if (!comment) {
      res.status(404).send();
      return;
    }
    else if (comment.userId != userInToken) {
      res.status(401).send({ message: "Unauthorized access" })
      return;
    }
    Discussion.findOneAndUpdate(
      { _id: comment._id },
      req.body,
      { new: true },
      (err, comment) => {
        if (err) res.send(err);
        else if (comment.userId != userInToken) res.status(401).send({ message: "Unauthorized access" })
        res.json(comment);
      }
    );
  })
};

exports.delete_a_comment = (req, res) => {
  var userInToken = req.user.userID;
  Discussion.findById(req.headers['commentid'], (err, comment) => {
    if (err) {
      res.send(err);
      return;
    }
    if (!comment) {
      res.status(404).send();
      return;
    }
    if (comment.userId != userInToken) {
      res.status(401).send({ message: "Unauthorized access" })
      return;
    }
    Discussion.deleteOne({ _id: comment._id }, err => {
      if (err) res.send(err);
      else {
        res.json({
          message: 'Comment successfully deleted.',
        });
      }
    });
  })
};
