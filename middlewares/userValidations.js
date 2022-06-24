const { body } = require("express-validator")

const userCreateValidation = () => {
    return [
        body("name").isString().withMessage("O nome é obrigatório.")
            .isLength({ min: 3 }).withMessage("O nome precisa ter no mínimo 3 caracteres"),
        body("email")
            .isString().withMessage("O e-mail é obrigatório.")
            .isEmail().withMessage("Digite um e-mail válido."),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória.")
            .isLength({ min: 8 })
            .withMessage("A senha precisa ter no mínimo 8 caracteres"),
        body("confirmpassword")
            .isString()
            .withMessage("A confirmação de senha é obrigatória. ")
            .custom((value, { req }) => {
                if (value != req.body.password) {
                    throw new Error("As senha não são iguais!")
                }
                return true;
            })
    ]
}

const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("Coloque seu e-mail")
            .isEmail()
            .withMessage("Insira um e-mail válido")
        ,
        body("password")
            .isString()
            .withMessage("Coloque sua senha")
    ]
};

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({ min: 3 })
            .withMessage("O nome precisa de pelos menos 3 caracteres."),
        body("password")
            .optional()
            .isLength({ min: 8 })
            .withMessage("A senha precisa de pelo menos 8 caracteres.")
    ]


}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation
}