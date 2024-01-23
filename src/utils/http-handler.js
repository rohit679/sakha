export const httpHandler = (asyncFxn) => {
  return (req, res, next) => {
    (async () => {
      try {
        await asyncFxn(req, res, next);
      } catch (err) {
        next(err);
      }
    })();
  };
}