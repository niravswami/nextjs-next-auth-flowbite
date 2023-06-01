export default function handler(req, res) {
  if (req.method === "POST") {
    console.log("req", req?.body);
    res.status(200).json(req?.body);
  } else {
    res.status(200).json({ name: "John Doe" });
  }
}
