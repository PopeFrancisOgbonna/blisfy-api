const path = require('path');
const fs = require('fs');


const createPost = (req, res, client) => {
  if(!req.files || Object.keys(req.files).length === 0){
    res.status(400).send("No files was uploaded.");
    return;
  }

  // let imgFile = req.files.image;
  // console.log(imgFile.mimetype)
  // if(imgFile.mimetype !=="image/jpeg" || imgFile.mimetype !=='image/png' || imgFile.mimetype !=="image/jpg"){
  //   res.status(400).send("Invalid Image format.");
  //   return;
  // }

  const postData = {
    title: req.body.title,
    richDescription: req.body.richDescription,
    image: req.files.image,
    category: req.body.category,
    date: new Date()
  };

  let uploadPath = path.resolve("images")+`/${postData.image.name}`;
  let image = uploadPath;
  postData.image.mv(uploadPath, function(err){
    if(err){
      console.log(err);
      res.status(500).send("Ooops! An error occured uploading your post, please try agin.");
      return;
    }
  });

  const query_string="insert into post (title, rich_description, image, category_name,date_created) values($1,$2,$3,$4,$5)";
  client.query(query_string,
    [postData.title,postData.richDescription,image,postData.category,postData.date], (err, result) =>{
    if(err){
      console.log(err);
      res.status(500).send("Network connection error! Try agin.");
      return;
    }
    res.status(200).send("Post created successfully.");
  })
}

const updatePost = (req, res, client) => {
  const {id} = req.params;
  let body = req.body;
  const query_string =`select * from post where post_id =${id}`;
  client.query(query_string, (err, result) =>{
    if(err){
      console.log(err);
      res.status(401).send("sorry post does not exist.");
      return;
    }
    if(result.rows.length){
      let post = result.rows[0];
      console.log(post);
      console.log(body)
      const title = body.title ? body.title : post.title,
        richDescription = body.richDescription ? body.richDescription : post.rich_description,
        category = body.category ? body.category : post.category_id,
        date = new Date();
      let image;
      
      if(body.files){
        fs.unlink(post.image, function(err){
          if(err){
            console.log(err);
          }
          console.log("file deleted");
        });
        let uploadPath = path.resolve("images")+`/${body.files.image.name}`;
        image=uploadPath;
        body.files.image.mv(uploadPath, function(err){
          if(err){
            console.log(err);
            res.status(500).send("Ooops! An error occured uploading your post, please try agin.");
            return;
          }
        });
      }else{
        image = post.image;
      }
      let update_query = `update post set title=$1, rich_description = $2, image=$3, category_name =$4, date_created=$5 where post_id=${id}  RETURNING *`;
      client.query(update_query,[title,richDescription,image, category,date], (err, result) => {
        if(err){
          console.log(err);
          res.status(500).send("update Ooops! An error occured uploading your post, please try agin.");
          return;
        }
          console.log(result);
        res.status(200).send('Post Updated.');
      });
    }
  });
  
  
}

const allPost = (req, res, client) => {
  const query_string ="select * from post";
  client.query(query_string, (err, result) => {
    if(err){
      console.log(err);
      res.status(400).send("Failed to load. Please check network connection");
    }
    res.status(200).send(result.rows);
  })
}

const singlePost = (req, res, client) => {
  const {id} = req.params;
  const query_string =` select * from post where post_id = ${id}`;
  client.query(query_string, (err, result) => {
    if(err){
      console.log(err);
      res.status(400).send("Unable to fetch post.");
      return;
    }
    res.status(200).send(result.rows);
  });
}

const postCategory = (req, res, client) => {
  let {category} = req.params;
  category = category.toLowerCase();
  const query_string = `select * from post where LOWER(category_name) = '${category}'`;
  client.query(query_string, (err, result) => {
    if(err){
      console.log(category);
      console.log(err);
      res.status(400).send("Category does not exist.");
      return;
    }
    res.status(200).send(result.rows);
  });
}

const deletePost = (req, res, client) => {
  const {id} = req.params;
  const query_string = `delete from  post where post_id = ${id}`;
  client.query(query_string, (err, result) => {
    if(err){
      console.log(err);
      res.status(400).send('Post does not exist.');
      return;
    }
    res.status(200).send("Poste Deleted Successfully!");
  });
}

module.exports = {
  createPost,
  updatePost,
  allPost,
  singlePost,
  postCategory,
  deletePost,
}