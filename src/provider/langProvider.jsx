import React, { useContext, useState, createContext, useMemo } from "react";

const langContext = createContext();
const { Provider } = langContext   

const languages = {
    fr: 'fr-Fr',
    eng: 'en-Us',
    esp: 'es-Es'
}

const text = (lang) => {

    const makeLangFile = (lang) => {
        const langFile = {}

        //errors messages
        const errors = {};
        switch (lang) {
            case languages.fr:
                errors.password = 'Mot de passe incorrect'
                errors.email = 'Email incorrect'
                errors.fileType = 'Format de fichier Incorrect'
                errors.emptyField = 'Ce champ ne peut etre vide'
                errors.other = `une érreur s'est produite`
                break;
            
            case languages.esp:
                errors.password = 'pass incorrectp'
                errors.email = 'Email incorrectp'
                errors.fileType = 'Format de fichiero Incorrecto'
                errors.emptyField = 'Ce champ ne esp peut etre vide'
                errors.other = `une érreur s'est esp produite`
                break;

            
        
            default:
                errors.password = 'Incorrect passord'
                errors.email = 'Incorrect email'
                errors.fileType = 'Incorrect file format'
                errors.emptyField = 'This file can not be empty'
                errors.other = `unknow error`
                break;
        }

        langFile.errors = { ...errors }
        
        return langFile
        
    }

    return makeLangFile(lang)
    

}


function LangProvider({children}) {

    const [lang, setLang] = useState(languages.fr)
    const texts=text(lang)


    const value = useMemo(() => {
        return {
            lang,
            languages,
            setLang,
            texts,
            
        }
    },[lang, texts])
    
  return (
    <Provider value={value}>{children}</Provider>
  )
}

export const useLang = () => {
    return useContext(langContext)
}

export default LangProvider