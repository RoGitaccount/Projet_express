//  -- table Projet

//selectionne un Projet selon son id
export function Find_Project(client, ProjectId, callback) {

  const query = `
    SELECT id_projet, nom, 
           DATE_FORMAT(date_debut, '%Y-%m-%d') AS date_debut, 
           DATE_FORMAT(date_fin, '%Y-%m-%d') AS date_fin, 
           statut 
    FROM Projet 
    WHERE id_projet = ?`;

  client.query(query, [ProjectId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    console.log(results);
    callback(null, results);
  });
}

//selectionne tous les Projet
export function Get_All_Project(client,callback) {

  const query = `
    SELECT id_projet, nom, 
           DATE_FORMAT(date_debut, '%Y-%m-%d') AS date_debut, 
           DATE_FORMAT(date_fin, '%Y-%m-%d') AS date_fin, 
           statut 
    FROM Projet`;

  client.query(query, (err, results,fields)=>{
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }
    console.log(results); // Affiche les résultats retournés par le serveur
    console.log(fields); // Affiche les métadonnées supplémentaires sur les résultats, si disponibles
    callback(null, results);
  });
}

//crée un nouveau Projet
export function Create_Project(client,{nom, date_debut, date_fin, statut},callback){
  const query = "INSERT INTO `Projet`(nom, date_debut, date_fin, statut) VALUES(?,?,?,?)" 
  client.query(query,[nom, date_debut, date_fin, statut],(err,results)=>{
    if (err){
      return callback(err,null);
    }
    callback(null,results);
  })
}

//modifier un Projet
export function Update_Project(client,ProjectId,{nom, date_debut, date_fin, statut},callback){
  const query ="UPDATE `Projet` SET nom=?, date_debut=?, date_fin=?, statut=? WHERE id_projet =?";
  client.query(query,[nom, date_debut, date_fin, statut,ProjectId],(err,results)=>{
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  })
}

//supprimer un Projet
export function Delete_Project(client,ProjectId,callback){
  const query ="DELETE FROM `Projet` WHERE id_projet =?";
  client.query(query,[ProjectId],(err,results)=>{
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}