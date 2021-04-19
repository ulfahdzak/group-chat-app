import Axios from "axios";

export default Axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-type": "application/json",
  },
});

// export default Axios.create({
//   baseURL: "https://api-chatroom-app.herokuapp.com/api",
//   headers: {
//     "Content-type": "application/json",
//   },
// });
