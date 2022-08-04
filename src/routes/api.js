const express = require("express");
const TaskController = require("../controller/TaskController");
const UserController = require("../controller/UserController");
const AuthVerifyMiddleware = require("../middleware/AuthVerifyMiddleware");

const router = express.Router();

router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post(
  "/profileUpdate",
  AuthVerifyMiddleware,
  UserController.profileUpdate
);
router.get( 
  "/updateProfileDetails",
  AuthVerifyMiddleware,
  UserController.updateProfileDetails
);
router.get("/recoverVerifyEmail/:email", UserController.RecoverVerifyEmail); 
router.get("/recoverVerifyOTP/:email/:otp", UserController.RecoverVerifyOTP);
router.post("/recoverResetPassword", UserController.RecoverResetPassword);

router.post("/createTask", AuthVerifyMiddleware, TaskController.createTask);
router.delete(
  "/deleteTask/:id",
  AuthVerifyMiddleware,
  TaskController.deleteTask
);
router.get(
  "/updateTaskStatus/:id/:status",
  AuthVerifyMiddleware,
  TaskController.updateTaskStatus
);
router.get(
  "/listTaskByStatus/:status",
  AuthVerifyMiddleware,
  TaskController.listTaskByStatus
);
router.get(
  "/taskStatusCount",
  AuthVerifyMiddleware,
  TaskController.taskStatusCount
);

module.exports = router;
