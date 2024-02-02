
//fake delay
async function delay(temps) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const arrayPseudo = ["Albert", "Kameni", "Tchagou", "krist"];
            const arrayEmail = [
                "albert@gmail.com",
                "kameni@gmail.com",
                "tchagou@gmail.com",
                "krist@gmail.com"
            ];
            const array = {
                emails: arrayEmail,
                pseudos: arrayPseudo,
            };
            resolve(array);
        }, temps);
    });
}


// var fileTypes = ["image/jpeg", "image/pjpeg", "image/png"];

// function validFileType(file) {
//   for (var i = 0; i < fileTypes.length; i++) {
//     if (file.type === fileTypes[i]) {
//       return true;
//     }
//   }

//   return false;
// }

export default async function valiteRegistration(formValues) {
    
        const array = await delay(100);


        return new Promise((resolve, reject) => {
            let allE = [];
            let allP = [];
            allE = array.emails;
            allP = array.pseudos;
            const allEmail = allE.map((email = '') => email.toLowerCase())
            const allPseudo = allP.map((pseudo = '') => pseudo.toLowerCase())


            const errors = {};
            const emailRegx = new RegExp(/[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}/);

            //pseudo
            if (formValues.pseudo === "") {
                errors.pseudo = "Veuillez renseigner ce champ.";
            }
            if (formValues.pseudo.length <= 3) {
                errors.pseudo = "le pseudo doit contenir au moins 03 caractères";
            }
            if (allPseudo.includes(formValues.pseudo.toLowerCase())) {
                errors.pseudo = "ce pseudo est déja utiliser";
            }

            // if (validFileType(formValues.avatar[0] === false)) {
            //     errors.avatar = "le format de l'image est incorrect"
            // }
            // if (formValues.avatar[0].size >= 2 * 1024 * 1024) {
            //     errors.avatar = "la taille de votre image ne doit pas excéder 2Mo"
            // }

            //email
            if (formValues.email === "") {
                errors.email = "Veuillez renseigner ce champ.";
            }
            if (emailRegx.test(formValues.email) === false) {
                errors.email = "cette email n'est pas valide";
            }
            if (allEmail.includes(formValues.email.toLowerCase())) {
                errors.email = "cet email est déja utilisé";
            }

            //password
            if (formValues.password === "") {
                errors.password = "Veuillez renseigner ce champ.";
            }
            if (formValues.password.length < 8) {
                errors.password =
                    "Le mot de passe doit contenir au moins 08 caractères";
            }

            //confirmPassord
            if (formValues.confirmPassword === "") {
                errors.confirmPassword = "Veuillez renseigner ce champ.";
            }

            if (formValues.confirmPassword !== formValues.password) {
                errors.confirmPassword = "Les mots de passes ne correspondent pas.";
            }

            if (!formValues.acceptTerms) {
                errors.acceptTerms = "Vous devez accepter les conditions";
            }

            resolve(errors);
        });
    }

