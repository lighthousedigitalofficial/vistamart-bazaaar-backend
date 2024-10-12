import Employee from '../../models/admin/employeeModel.js'
import AppError from '../../utils/appError.js'
import catchAsync from '../../utils/catchAsync.js'

export const createEmployee = catchAsync(async (req, res, next) => {
    const doc = await Employee.create(req.body)

    if (!doc) {
        return next(new AppError(`Employee could not be created`, 400))
    }

    res.status(201).json({
        status: 'success',
        doc,
    })
})
