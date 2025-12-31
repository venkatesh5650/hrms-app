// const Employee = require("./employee")
// const EmployeeTeam = require("./employeeTeam")
// const Organisation = require("./organisation")

// // users Table 

// id, Organisation_id,name,email,password_hash,role,created_at

// // relationships of users Table

// User.belongsTo(Organisation,{foreignkey:"organisation_id"})

// // organisation table

// id,organisation_id,name,created_At

// // employees table 

// id ,user_id,organisation_id,firstname,lastname,phone,email,isActive,created_At,delted,updatedat

// // relationships with employee table

// User.hasOne(Employee.{foreignKey:"user_id"})
// Employee.belongsTo(User,{foreignKey:"user_id"})
// Employee.belongsTo(organisation,{foreignKey:"organisation_id"})

// // team table

// id,organisation_id,name,description,created_at

// // relations of team table

// Employee.belongsToMany(Team,{
//     through:EmployeeTeam,
//     foreignKey:"employee_id",
//     otherKey:"team_id"
// })

// Team.belongsToMany(Employee,{
//     throgh:EmployeeTeam,
//     foreignKey:"team_id",
//     otherkey:"employee_id"
// })


// Team.belongsTo(Organisation,{foreignkey:"organisation_id"})


// // EmployeeTeam table

// id,team_id,employee_id,assigned_at


// // Approval table

// id,user_id,organisation_id,type(create,delted,loginacess),status(pending(default),approved,rejected),
// rejection_reason(allonull:true),created_At,payload(user_details)

// // relationsships of approval table


// Approval.belongsTo(User,{foreignKey:"user_id"})
// Approval.belongsTo(Organisation,{foreignKey:"orgnaistion_id"})


// // logs table

// id,user_id,organisation_id,action,meta,created_at

