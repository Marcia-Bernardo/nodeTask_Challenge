export async function json(req, res) {
  //converte dados de entrada
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  //converte os dados de saída
  res.setHeader("Content-type", "aplication/json");
}
