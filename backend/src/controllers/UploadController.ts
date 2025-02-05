import { Request, Response } from "express";

export async function uploadFile(req: Request, res: Response) {
  const { videos } = req.body;
  const { files } = req;

  if (!videos) {
    res.status(400).json({ error: "Missing videos metadata" });
    return;
  }

  if (!files) {
    res.status(400).json({ error: "Missing files" });
    return;
  }

  // if (isSeries && (!season || !episodeNumber)) {
  //   res.status(400).json({ error: "Missing season or episodeNumber or episodeTitle" });
  //   return;
  // }

  if (req.files) {
    res.json({ success: true, files: req.files });
  }
}
