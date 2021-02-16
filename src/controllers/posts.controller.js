const Post = require('../models/post.model');

class PostsController {

	static async feed(req, res) {

		try {
			const posts = await Post.find();
			res.send(posts);
		} catch(err) {
			console.log(err);
			res.sendStatus(500);
		}

	}

}


module.exports = PostsController;