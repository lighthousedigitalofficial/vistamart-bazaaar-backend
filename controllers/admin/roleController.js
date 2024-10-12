import Role from '../../models/admin/roleModel.js'
import AppError from '../../utils/appError.js'
import catchAsync from '../../utils/catchAsync.js'

export const createRole = catchAsync(async (req, res, next) => {
    const doc = await Role.create(req.body)

    if (!doc) {
        return next(new AppError(`Role could not be created`, 400))
    }

    res.status(201).json({
        status: 'success',
        doc,
    })
})
