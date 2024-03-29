const cloudinary = require('../config/cloudinary/cloudinary.config');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');


class PostsController {

	static async feed(req, res) {

		try {
			const posts = await Post
				.find()
				.populate('user', ['username', 'avatar'])
				.sort({ createdAt: req.query.sort || 1 });
			res.send(posts);
		} catch(err) {
			console.log(err);
			res.sendStatus(500);
		}

	}

	static async get(req, res) {

		try {
			const post = await Post
				.findById(req.params.id)
				.populate('user', ['username', 'avatar']);
			if(!post) {
				res.sendStatus(404);
				return;
			}
			res.send(post);
		} catch(err) {
			console.log(err);
			res.sendStatus(500);
		}

	}

	static async create(req, res) {
		const fileName =req.file.filename;

		try {
			const image = await cloudinary.uploader.upload (

				'public/posts/'+fileName,
				{
					transformation: ["insta-1080"],
					public_id: `${req.user.username}-${fileName}`,
					resource_type: 'image',
					folder:'posts'
				},
				function(error, result) {
					console.log(result);
				}

			)
			  
			const post = new Post({
				caption: req.body.caption,
				image: image.url,
				user: req.user._id,
			});

			const newPost = await post.save();
			res.status(201).send(newPost);
		} catch(err) {
			console.log(err);
			res.sendStatus(400);
		}
	}


	static async like(req, res) {
		const id = req.params.id;
		const userId =req.user._id;

		try {
			const post = await Post.findById(id);
			if(!post) {
				res.sendStatus(404);
				return;
			}
			post.likes.addToSet(userId);
			await post.save();
			res.status(201).send(post);
		} catch(err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	static async unlike(req, res) {
		const id = req.params.id;
		const userId =req.params.userId;

		try {
			const post = await Post.findById(id);
			if(!post) {
				res.sendStatus(404);
				return;
			}
			post.likes.pull(userId);
			await post.save();
			res.status(200).send(post);
		} catch(err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	static async createComment(req,res) {
		const postId = req.params.id;
		const userId =req.user._id;
		
		try {
			const comment = new Comment({
				content: req.body.content,
				user: userId,
				postId,
			})
			const newComment = await comment.save();
			await newComment.populate('user', ['username', 'avatar'])
				.execPopulate();
			res.status(201).send(newComment);
		} catch(err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	static async getComments(req,res) {
		const postId = req.params.id;
		
		try {
			const comments = await Comment.find({postId})
				.populate('user', ['username', 'avatar']);
			res.send(comments);
		} catch(err) {
			console.log(err);
			res.sendStatus(500);
		}
	}
	
}

module.exports = PostsController;