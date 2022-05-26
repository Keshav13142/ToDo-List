const cred = require(__dirname + "/credentials.js");
const url = cred.mongoUrl;
const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");
app.use(body_parser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect(url);

const itemsSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("list", listSchema);

const def1 = new Item({
  name: "Welcome to your todoList",
});

const def2 = new Item({
  name: "Hit the + button for a new task",
});

const def3 = new Item({
  name: "<-- hit this to mark a task as done",
});

const defList = [def1, def2, def3];

app.get("/", (req, res) => {
  List.findOne({ name: "Today" }, (err, data) => {
    if (data == null) {
      const newList = new List({
        name: "Today",
        items: defList,
      });
      newList.save();
      res.redirect("/");
    } else {
      res.render("list", { items: data.items, title: data.name });
    }
  });
});

app.post("/delete", (req, res) => {
  const listName = req.body.list;
  const id = req.body.id;
  List.findOneAndUpdate(
    { name: listName },
    { $pull: { items: { _id: id } } },
    (err, result) => {
      if (!err) {
        if (listName === "Today") res.redirect("/");
        else res.redirect("/" + listName);
      }
    }
  );
});

app.get("/:customList", (req, res) => {
  const customList = _.capitalize(req.params.customList);
  if (customList === "favicon.ico") {
    res.redirect("/");
  } else {
    List.find({ name: customList }, (err, data) => {
      if (data.length === 0) {
        const newList = new List({
          name: customList,
          items: defList,
        });
        newList.save();
        res.redirect("/" + customList);
      } else {
        res.render("list", { items: data[0].items, title: data[0].name });
      }
    });
  }
});

app.post("/", (req, res) => {
  const itemName = req.body.item;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });
  List.findOne({ name: listName }, (err, data) => {
    data.items.push(item);
    data.save();
    if (listName === "Today") res.redirect("/");
    else res.redirect("/" + listName);
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server has started successfully");
});
