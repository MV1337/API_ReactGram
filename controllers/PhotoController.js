const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

//insert a photo, with an user related it
const insertPhoto = async (req, res) => {

    const { title } = req.body;
    const image = req.file.filename;

    const reqUser = req.user

    const user = await User.findById(reqUser._id);
    //create photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    //if photo was created sucessfully, return data
    if (!newPhoto) {
        res.status(421).json({
            erros: ["Houve um erro, tente novamente mais tarde."]
        }
        );
        return
    }
    res.status(201).json(newPhoto);
};

//remove a photo from db
const deletePhoto = async (req, res) => {

    const { id } = req.params

    try {
        const reqUser = req.user

        const photo = await Photo.findById(mongoose.Types.ObjectId(id))

        //check if photo exists
        if (!photo) {
            res.status(404).json({ erros: ["Foto nao encontrada"] })
            return
        }

        //check if photo belongs to user
        if (!photo.userId.equals(req.user._id)) {
            res.status(422).json({ erros: ["tente mais tarde"] })
        }

        await Photo.findByIdAndDelete(photo._id)

        res.status(200).json({ id: photo._id, message: "Foto excluida com sucesso" })
    } catch (error) {
        res.status(404).json({ errors: ["foto nao encontrada"] })
        return
    }
}

// Get all photos
const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({})
        .sort([["createdAt", -1]])
        .exec();

    res.status(200).json(photos);
    //console.log(photos)
};

//Get user photos
const getUserPhotos = async (req, res) => {

    const { id } = req.params

    const photos = await Photo.find({ userId: id })
        .sort([['created', -1]])
        .exec()

    return res.status(200).json(photos)
}

//get photo by id
const getPhotoById = async (req, res) => {

    const { id } = req.params

    const photo = await Photo.findById(mongoose.Types.ObjectId(id))

    //check photo exists

    if (!photo) {
        res.status(404).json({ erros: ['Foto não encontrada'] })
        return
    }

    res.status(200).json(photo)
}

// Update a photo
const updatePhoto = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }

    // Check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
        res
            .status(422)
            .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
        return;
    }

    if (title) {
        photo.title = title;
    }

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};


//like functionality
const likePhoto = async (req, res) => {

    const { id } = req.params;

    const reqUser = req.user

    const photo = await Photo.findById(id)

    // Check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }

    // check if user alredy liked the photo
    if (photo.likes.includes(reqUser._id)) {
        res.status(422).json({ errors: ["Você já curtiu a foto"] })
        return;
    }

    //put user id in likes array
    photo.likes.push(reqUser._id)

    photo.save()

    res.status(200).json({ photoId: id, userId: reqUser._id, message: "A Foto foi curtida" })

}

// Comment functionality
const commentPhoto = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }

    // Put comment in the array of comments
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    };

    photo.comments.push(userComment);

    await photo.save();

    res.status(200).json({
        comment: userComment,
        message: "Comentário adicionado com sucesso!",
    });
};

// Search a photo by title
const searchPhotos = async (req, res) => {
    const { q } = req.query;

    const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

    res.status(200).json(photos);
};


module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos
}