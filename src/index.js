const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { ImgurClient } = require("imgur");

const multer = require("multer");

const port = 8080;
const firebase = require("./firebase");

app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const client = new ImgurClient({
  username: "elituffley24",
  password: "kawasaki1",
  clientId: "8154174a9ed74c7"
});

app.post("/upload", upload.single("upload"), async (req, res) => {
  console.log("reached upload");
  console.log(req.body.name);
  console.log(req.file.filename);
  const response = await client.upload("images/" + req.file.filename);
  // res.json(response.data.link);
  if (response.data.link) {
    const push = firebase.ref("videos").push({
      name: req.body.name ? req.body.name : null,
      uploaded: req.body.uploaded ? req.body.uploaded : null,
      uploader: req.body.uploader ? req.body.uploader : null,
      views: req.body.views ? req.body.views : 0,
      staticImage: response.data.link
    });
    const key = push.key;
    return res.json({ success: true, key });
  } else return res.json({ success: false });
});

// console.log(client);

// async function upload() {
//   const response = await client.upload("./img/testphoto.jpg");
//   // console.log(response.link);
//   console.log(response.data.link);
// }

// upload();

app.get("/loadvideos", async (req, res) => {
  let videosRef = firebase.ref("videos");
  let snapshot = await videosRef.once("value");
  let data = snapshot.val();
  let videos = Object.entries(data);
  let arr = [];
  videos.map((video, key) => {
    return arr.push({
      id: video[0],
      ...video[1]
    });
  });
  return res.json(arr);
});

const staticStores = [
  {
    id: 1,
    name: "KFC restaurant",
    titleColour: "#fff",
    stars: 5,
    description: "This is the first restaurant",
    image: "https://i.imgur.com/4kddRvK_d.webp?maxwidth=760&fidelity=grand",
    sections: [
      {
        id: 1,
        name: "Mains"
      },
      {
        id: 2,
        name: "Sides"
      },
      {
        id: 3,
        name: "Drinks"
      }
    ]
  },
  {
    id: 2,
    name: "Night 'n Day",
    stars: 4.9,
    titleColour: "#fff",
    description: "This is the second restaurant",
    image: "https://i.imgur.com/6WdY33u_d.webp?maxwidth=760&fidelity=grand"
  },
  {
    id: 3,
    name: "third restaurant",
    stars: 5,
    description: "This is the third restaurant",
    image: "https://i.imgur.com/a5g0DS8.jpg"
  },
  {
    id: 4,
    name: "Fourth restaurant",
    stars: 5,
    description: "This is the fourth restaurant",
    image: "https://i.imgur.com/a5g0DS8.jpg"
  },
  {
    id: 5,
    name: "Fifth restaurant",
    stars: 5,
    description: "This is the fifth restaurant",
    image: "https://i.imgur.com/a5g0DS8.jpg"
  },
  {
    id: 6,
    name: "Sixth restaurant",
    stars: 5,
    description: "This is the sixth restaurant",
    image: "https://i.imgur.com/a5g0DS8.jpg"
  },
  {
    id: 7,
    name: "Seventh restaurant",
    stars: 5,
    description: "This is the seventh restaurant",
    image: "https://i.imgur.com/a5g0DS8.jpg"
  },
  {
    id: 8,
    name: "Eighth restaurant",
    stars: 5,
    description: "This is the eighth restaurant",
    image: "https://i.imgur.com/a5g0DS8.jpg"
  }
];

app.post("/eats/loadrestaurant", async (req, res) => {
  let restaurant = [];
  const { id } = req.body;
  const filtered = staticStores.filter((store) => store.id === id);
  console.log(filtered);
  return res.json(filtered);
});


app.post("/eats/storesearch", async (req, res) => {
  let { string } = req.body;
  const filtered = staticStores.filter((store) => store.name.toLowerCase().includes(string.toLowerCase()));
  console.log(string);
  console.log(filtered)
  return res.json({
    stores: filtered,
    length: filtered.length
  });
})

app.get("/eats/loadmain", async (req, res) => {
  return res.json({
    stores: staticStores
  })
})



app.listen(port, () => {
  console.log("App running on port " + port);
});
