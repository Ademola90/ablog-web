// //middlewares/roleMiddleware.js
// exports.requireSuperAdmin = (req, res, next) => {
//     if (req.user.role !== 'superadmin') {
//         return res.status(403).send('Access denied.');
//     }
//     next();
// };