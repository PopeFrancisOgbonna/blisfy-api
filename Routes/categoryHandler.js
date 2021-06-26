const addCategory = (req, res, client) => {
  const {category_name} = req.body;
  let query = 'insert into category (category_name) values($1)';
  client.query(query, [category_name], (err, result) => {
    if(err){
      console.log(err);
      res.status(400).json({error: "Invalid! category name already exist."})
    }
    res.status(200).send('Category added Successfully.');
  })
}

const allCategory = (req, res, client) => {
  let query_string ='select * from category';
  client.query(query_string, (err, result) => {
    if(err){
      console.log(err);
      res.status(500).send('Network Error! Try again.');
    }
    res.status(200).send(result.rows);
  })
}

const delet_single = (req, res, client) => {
  let {category} =req.params;
  category = category.toLowerCase();
  let query_string = "delete from category where LOWER(category_name) = $1";
  client.query(query_string, [category], (err, result) => {
    if(err){
      console.log(err);
      res.status(400).send("Error: Category not found!");
    }
    console.log(result);
    if(result.rowCount>0){
      res.status(200).send("Category Deleted!");
      return;
    }
    res.status(400).send("Unable to delete category does not exist.");
  })
}

module.exports ={
  addCategory,
  allCategory,
  delet_single,
}