function auth(req, res, next) {
    if (req.session?.user?.admin) {
        return next();
    }
    return res.status(401).send('not authorized');
}

export const middlewares = {
    auth
};
