const multer = require("multer");
const upload = multer().single("image");
const { proxyDetect } = require("../utils/detectProxy");

exports.detect = (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) return next(err);
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ message: "Image file required (field name: image)" });
      const result = await proxyDetect(req.file);
      res.json(result.data || result);
    } catch (err) {
      next(err);
    }
  });
};
