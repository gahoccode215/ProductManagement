const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filter-state.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");

// [GET] /admin/products/
module.exports.index = async (req, res) => {
    try {
        // Status Filter
        const filterState = filterStatusHelper(req.query);
        // End Status Filter

        const find = {
            deleted: false,
        }

        if (req.query.status) {
            find.status = req.query.status;
        }

        // Search
        if (req.query.keyword) {
            const regex = new RegExp(req.query.keyword, "i");
            find.title = regex;
        }
        // End Search

        // Pagination
        const countProducts = await Product.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countProducts);
        // End Pagination

        const products = await Product.find(find)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip);

        res.render("admin/pages/products/index", {
            pageTitle: "Danh sách sản phẩm",
            products: products,
            filterState: filterState,
            keyword: req.query.keyword,
            pagination: objectPagination
        });
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;

        await Product.updateOne({
            _id: id
        }, {
            status: status
        });

        res.redirect("back");
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");

        switch (type) {
            case "active":
            case "inactive":
                await Product.updateMany({
                    _id: { $in: ids }
                }, {
                    status: type
                });
                break;
            default:
                break;
        }

        res.redirect("back");
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}