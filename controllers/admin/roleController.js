import Role from '../../models/admin/roleModel.js'

import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from '../../factory/handleFactory.js'

export const createRole = createOne(Role)

export const getRoles = getAll(Role)

export const getRoleById = getOne(Role)

export const updateRole = updateOne(Role)

export const deleteRole = deleteOne(Role)
