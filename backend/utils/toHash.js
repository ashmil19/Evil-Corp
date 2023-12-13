const bcrypt = require('bcrypt')

const hash = async (value) => {
    try {

        const hashed = await bcrypt.hash(value, 10)
        return hashed;
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = hash;