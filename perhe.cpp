def Perhe.Jasen.Statusquery.Answer {
    required    :
        {
            location    :   Perhe.Jasen.Location (Time.Now()),
            condition   :   enum ['Magic', 'Ok', 'JoeBiden','HaeMutPois']
        },

    optional    :
        {
            description :   String(),
            photo       :   Image()
        },

    errorCode   :   String (type : 'MITÄVITTUANYTTAASHESSU'),
    priority    :   Time.Now()-1
}