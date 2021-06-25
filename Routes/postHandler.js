const createPost = (req, res, client) => {
  // if(!req.file){

  // }
  const postData = {
    title: req.body.title,
    richDescription: req.body.richDescription,
    image: req.body.image,
    category: req.body.category
  };
  let file = postData.image;
  if(file.mimetype !="image/jpeg" || file.mimetype !="image/png" || file.mimetype !="image/jpg"){
    res.status(400).send("Invalid Image format.");
    return;
  }
  file.mv("../images")
  const query_string="insert into post (title, rich_description, image, category_id) values($1,$2,$3,$4)";
  client.query(query_string,
    [postData.title,postData.richDescription,postData.image,postData.category], (err, result) =>{
    if(err){
      console.log(err);
      res.status(500).send("Network connection error! Try agin.")
    }
    res.status(200).send("Post created successfully.");
  })
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

module.exports = {
  createPost,
  allPost,
}