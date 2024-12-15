//  -- table User

//Dans le cas où inserData ne fonctionne pas 
      // Modifier le rôle d'un utilisateur en "admin"
      export function SetUserToAdmin(client, id_utilisateur, callback) {
        const query = `
          UPDATE Utilisateur
          SET role = 'admin'
          WHERE id_utilisateur = ? AND role != 'admin'
        `;
        client.query(query, [id_utilisateur], (err, results) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, results);
        });
      }

// Récupérer tous les utilisateurs
export function GetAllUser(client,callback){
  client.query("select * from `Utilisateur`",(err,results)=>{
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  })
}

//affiche l'utilisateur avec l'email correspondanr

export function GetUserByEmail(client, email, callback) {
  const query = "SELECT * FROM Utilisateur WHERE email = ?";
  client.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    if (results.length > 0) {
      return callback(null, { exists: true, results });
    }

    callback(null, { exists: false, results });
  });
}


// inserer un utilisateur
export function Insert_user(client,{nom,email,role="user",password},callback){
  const query ="INSERT INTO `Utilisateur`(nom,email,role,password) VALUES(?,?,?,?)";
  client.query(query,[nom,email,role,password],(err,results)=>{
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  })
}