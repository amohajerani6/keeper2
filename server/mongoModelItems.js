const mongoose=require('mongoose')

const schema=mongoose.Schema({'content':String})

mongoModelItems=mongoose.model('Items', schema)
module.exports= mongoModelItems