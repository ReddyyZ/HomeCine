import { Request, Response } from "express";
import fs from "fs";

export function streamVideo(filePath: string, req: Request, res: Response) {
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // Handle range requests
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      return res.status(416).send("Requested range not satisfiable");
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    file.pipe(res);
  } else {
    // Handle full file requests
    const headers = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  }
}
