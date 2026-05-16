import axios from "axios";

async function run() {
  try {
    // 1. Signin
    console.log("Signing in...");
    const res = await axios.post("http://localhost:4000/api/auth/signin", {
      email: "testowner@buypass.com", // wait, I don't know the email the subagent used.
      password: "password"
    });
    console.log(res.data);
  } catch(e: any) {
    console.log(e.response?.data || e.message);
  }
}
run();
