const MenuSchema = require("../models/menuModel");

module.exports.all_menu = async (req, res, next) => {
    try {
        const allMenus = await MenuSchema.find();
        return res.status(200).json({ count: allMenus.length, data: allMenus })
    } catch (error) {
        next(error);
    }
}

module.exports.create_menu = async (req, res, next) => {
    const newData = req.body
    try {
        const menu = await MenuSchema.create(newData)
        res.status(201).json({
            msg: "Menu created successfully.",
            data: menu,
            success: true
        })
    } catch (error) {
       next(error)

    }
}

module.exports.update_menu = async (req, res, next) => {
    const updatedData = req.body;
    const id = req.params.id;
    try {
        const menu = await MenuSchema.findByIdAndUpdate(id, updatedData, {
            new: true
        })
        if (menu) {
            res.status(200).json({
                success: true,
                data: menu,
                message: "Menu updated successfully."
            })
        }
        if(!menu){
            res.status(404).json({
                success: false,
                data: '',
                message: "Menu item not found."
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports.get_single_menu = async (req, res, next) =>{
    const id = req.params.id;
   try{
     const singleData = await MenuSchema.findById(id);
    res.status(200).json({
        success: true,
        data: singleData,
        message: "Menu fetched successfully."
    })
    if(!singleData){
         res.status(404).json({
                success: false,
                data: '',
                message: "Menu item not found."
            })
    }
   }catch(error){
    next(error)
   }
}

module.exports.get_menu_by_restaurant = async (req, res, next) => {
  const id = req.params.id;

  try {
    const restaurantMenu = await MenuSchema.find({ venue_id: id });

    if (!restaurantMenu || restaurantMenu.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No menu items found for this restaurant."
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurantMenu,
      message: "Menu fetched successfully."
    });

  } catch (error) {
    next(error);
  }
};


module.exports.delete_menu = async (req, res, next) =>{
    const id = req.params.id;
    try{
        const deleteMenu = await MenuSchema.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            data:deleteMenu,
            message: "Menu deleted succcessfully."
        })
        if(!deleteMenu){
             res.status(404).json({
                success: false,
                data: '',
                message: "Menu item not found."
            })
        }
    }catch(error){
        console.log(error)
        next(error)
    }
}