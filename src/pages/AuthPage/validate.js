

export default async function valiteRegistration(formValues) {
    
      


        return new Promise((resolve, reject) => {
           

            const errors = {};
            const emailRegx = new RegExp(/[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}/);

         
       

            //email
            if (formValues.email === "") {
                errors.email = "Veuillez renseigner ce champ.";
            }
            if (emailRegx.test(formValues.email) === false) {
                errors.email = "cette email n'est pas valide";
            }
           

         

           
            resolve(errors);
        });
    }

