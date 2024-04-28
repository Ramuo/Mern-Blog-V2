import asyncHandler from '../middlewares/asyncHandler.js';
import Comment from '../models/commentModel.js';



//@desc     Create Post
//@route    POST /api/comments/create
//@access   Private
const createComment = asyncHandler( async (req, res) => {
    const {content, postId, userId} = req.body;

    if(userId !== req.user.id){
        res.status(401);
        throw new Error("Vous êtes pas authorisé")
    }else{
        const comment = new Comment({
            content,
            postId,
            userId,
        });
        const newComment = await comment.save();

        res.status(201).json(newComment);
    };
});

//@desc     Get Post Comments
//@route    POST /api/comments/getPostComments/:postId
//@access   Public
const getPostComments = asyncHandler( async (req, res) => {
    const comments = await Comment.find({postId: req.params.postId}).sort({createdAt: -1});

    if(comments){
        res.status(200).json(comments)
    }else{
        res.status(404);
        throw new Error("Une erreur s'est produite, aucun commentaire trouvé")
    }
});

//@desc     Like comment
//@route    POST /api/comments/likeComment/comId
//@access   Public
const likeComment = asyncHandler( async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.comId);
        if (!comment) {
            res.status(404);
            throw new Error("aucun commentaire trouvé")
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
          comment.numberOfLikes += 1;
          comment.likes.push(req.user.id);
        } else {
          comment.numberOfLikes -= 1;
          comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
      } catch (error) {
        res.status(404);
        throw new Error("Une erreur s'est produite, aucun commentaire trouvé")
      }

});

//@desc    Edit comment
//@route    PUT /api/comments/editComment/comId
//@access   Public
const editComment = asyncHandler (async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.comId);
        if (!comment) {
            res.status(404);
            throw new Error("aucun commentaire trouvé")
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            res.status(401);
            throw new Error("Vous n'êtes pas authorisé à éditer ce commentaire")
        }
    
        const editedComment = await Comment.findByIdAndUpdate(
          req.params.commentId,
          {
            content: req.body.content,
          },
          { new: true }
        );
        res.status(200).json(editedComment);
      } catch (error) {
        res.status(404);
        throw new Error("Une erreur s'est produite, pour éditer le commentaire")
      }
})
//@desc     Delete comment
//@route    DELETE /api/comments/deleteComment/comId
//@access   Public
const deleteComment = asyncHandler (async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.comId);
        if (!comment) {
            res.status(404);
            throw new Error("aucun commentaire trouvé")
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            res.status(401);
            throw new Error("Vous n'êtes pas authorisé à supprimer ce commentaire")
        }
        await Comment.findByIdAndDelete(req.params.comId);
        res.status(200).json('Commentaire a été been supprimé');
      } catch (error) {
        res.status(404);
        throw new Error("Une erreur s'est produite, pour supprimer ce commentaire")
    }
})



export {
    createComment,
    getPostComments,
    likeComment,
    editComment,
    deleteComment,
}