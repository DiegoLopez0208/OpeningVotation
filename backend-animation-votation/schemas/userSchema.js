import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    usedZeroVote: {
        type: Boolean,
        default: false
    },
    usedElevenVote: {
        type: Boolean,
        default: false
    }
});

// Middleware para hashear la contraseña antes de guardarla
userSchema.pre('save', async function(next) {
    const user = this;

    // Solo hashear la contraseña si ha sido modificada o es nueva
    if (!user.isModified('password')) return next();

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', userSchema);

export default User;
