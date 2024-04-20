const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");


const createCategoryController = async(req,res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                message:"name is required"
            })
        }
        const existingCategory = await categoryModel.findOne({name});

        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"category Already exists"
            })
        }

        const category = await new categoryModel({
        name, 
        slug: slugify(name),
        }).save();

        res.status(201).send({
            success:true,
            message:"new category created",
            category
        });

    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error in category",
        })
    }
}

const updateCategoryController = async(req,res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(
            id,
            {name, slug:slugify(name)},
            {new:true}
        );
        res.status(200).send({
            success:true,
            message:"category Update Successfully",
            category,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            message:"error while updating category",
            error,
        });
    }
}

// get all cat
const categoryControlller = async (req, res) => {
    try {
      const category = await categoryModel.find({});
      res.status(200).send({
        success: true,
        message: "All Categories List",
        category,
      });
    } catch (error) {
    //   console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting all categories",
      });
    }
  };

const singleCategoryController = async(req,res) => {
    try {
        const category = await categoryModel.findOne({slug : req.params.slug});

        // console.log(category);

        res.status(200).send({
            success:true,
            message:"Get single category successfully",
            category,
        });

    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting single category",
            error,
        });
    }
}

const deleteCategoryController = async(req,res) => {
    try {
        const {id} = req.params;
        const category = await categoryModel.findByIdAndDelete(id);

        // console.log(category);
        
        res.status(200).send({
            success:true,
            message:"category Deleted successfully",
            category
        })

        
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while Deleteing Category",
            error,
        })
    }
}

module.exports = {createCategoryController,updateCategoryController,categoryControlller,singleCategoryController, deleteCategoryController};