import Employee from '../../models/admin/employeeModel.js'
import AppError from '../../utils/appError.js'
import catchAsync from '../../utils/catchAsync.js'

import redisClient from '../../config/redisConfig.js'
import { getCacheKey } from '../../utils/helpers.js'

import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './../../factory/handleFactory.js'

export const createEmployee = createOne(Employee)
export const getEmployees = getAll(Employee)
export const getEmployeeById = getOne(Employee)
export const deleteEmployee = deleteOne(Employee)
export const updateEmployee = updateOne(Employee)

export const updateRole = catchAsync(async (req, res, next) => {
    const { employeeId, role } = req.body
    const doc = await Employee.findByIdAndUpdate(
        employeeId,
        { role },
        {
            new: true,
            runValidators: true,
        }
    )

    if (!doc) {
        return next(new AppError(`No Employee found with that email`, 404))
    }

    const cacheKeyOne = getCacheKey('Employee', req.params.id)

    // delete pervious document data
    await redisClient.del(cacheKeyOne)
    // updated the cache with new data
    await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(doc))

    // Update cache
    const cacheKey = getCacheKey('Employee', '', req.query)
    await redisClient.del(cacheKey)

    res.status(200).json({
        status: 'success',
        doc,
    })
})
