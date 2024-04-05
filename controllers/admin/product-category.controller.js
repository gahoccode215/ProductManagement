const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filter-state.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const createTreeHelper = require("../../helpers/create-tree.helper");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {

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
    const countProducts = await ProductCategory.countDocuments(find);
    const objectPagination = paginationHelper(4, req.query, countProducts);
    // End Pagination

    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort["position"] = "desc";
    }
    // End Sort

    const records = await ProductCategory.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        filterState: filterState,
        keyword: req.query.keyword,
        records: records,
        pagination: objectPagination
    });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {

    const records = await ProductCategory.find({
        deleted: false,
    });

    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Thêm mới danh mục sản phẩm",
        records: newRecords
    });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countRecords = await ProductCategory.countDocuments();
        req.body.position = countRecords + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", "Thêm mới danh mục sản phẩm thành công!");

    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const data = await ProductCategory.findOne({
            _id: req.params.id,
            deleted: false
        });

        console.log(data);

        const records = await ProductCategory.find({
            deleted: false,
        });

        const newRecords = createTreeHelper(records);

        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        if (req.body.position == "") {
            const countRecords = await ProductCategory.countDocuments();
            req.body.position = countRecords + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        await ProductCategory.updateOne({
            _id: req.params.id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật danh mục sản phẩm thành công!");

        res.redirect(`back`);
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
};

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;

        await ProductCategory.updateOne({
            _id: id
        }, {
            status: status
        });

        req.flash('success', 'Cập nhật trạng thái thành công!');
        res.redirect("back");
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");

        switch (type) {
            case "active":
            case "inactive":
                await ProductCategory.updateMany({
                    _id: { $in: ids }
                }, {
                    status: type
                });
                req.flash('success', 'Cập nhật trạng thái thành công!');
                break;
            case "delete-all":
                await ProductCategory.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                req.flash('success', 'Xóa danh mục sản phẩm thành công!');
                break;
            case "change-position":
                for (const item of ids) {
                    let [id, position] = item.split("-");
                    position = parseInt(position);

                    await ProductCategory.updateOne({
                        _id: id
                    }, {
                        position: position
                    });
                }
                req.flash('success', 'Thay đổi vị trí thành công!');
                break;
            default:
                break;
        }

        res.redirect("back");
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
}

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        await ProductCategory.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });
        req.flash('success', 'Xóa danh mục sản phẩm thành công!');
    } catch (error) {
        console.log(error);
    }

    res.redirect("back");
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });


        if (product.parent_id == "") {

        } else {
            const parent = await ProductCategory.findOne({
                _id: product.parent_id,
                deleted: false
            });
            product.parentTitle = parent.title;
        }
        res.render("admin/pages/products-category/detail", {
            pageTitle: "Chi tiết danh mục sản phẩm",
            product: product,
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
};