      //  -- table Tache

//selectionne une tache selon son id
export function Find_Task(client, taskId, callback) {

  const query =  `
  SELECT id_tache, titre, description, 
         DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline, 
         statut, id_projet 
  FROM Tache 
  WHERE id_tache = ?`;

  client.query(query, [taskId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}

//selectionne toutes les taches
export function Get_All_Task(client,callback) {
  const query = `
    SELECT id_tache, titre, description, 
           DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline, 
           statut, id_projet 
    FROM Tache`;

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

//crée une nouvelle tâche

export function Create_task(client,{titre, description, deadline, statut, id_projet},callback){
  const query = "INSERT INTO `Tache`(titre,description,deadline,statut,id_projet) VALUES(?,?,?,?,?)" 
  client.query(query,[titre, description, deadline, statut, id_projet],(err,results)=>{
    if (err){
      return callback(err,null);
    }
    callback(null,results);
  })
}

//modifier une tache
export function Update_task(client,taskId,{titre, description, deadline, statut, id_projet},callback){
  const query ="UPDATE `Tache` SET titre=?, description=?, deadline=?, statut=?, id_projet=? WHERE id_tache =?";
  client.query(query,[titre, description, deadline, statut, id_projet,taskId],(err,results)=>{
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  })
}

//supprimer une tache
export function Delete_task(client,taskId,callback){
  const query ="DELETE FROM `Tache`  WHERE id_tache =?";
  client.query(query,[taskId],(err,results)=>{
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}

