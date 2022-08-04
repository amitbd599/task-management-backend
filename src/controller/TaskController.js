const TaskModel = require("../models/TasksModel");

// Task create
exports.createTask = (req, res) => {
  let reqBody = req.body;
  reqBody.email = req.headers["email"];
  TaskModel.create(reqBody, (error, data) => {
    if (error) {
      res.status(400).json({ status: "Fail", data: error });
    } else {
      res.status(200).json({ status: "Success", data: data });
    }
  });
};

// Task Delete

exports.deleteTask = (req, res) => {
  let id = req.params.id;
  let query = { _id: id };

  TaskModel.remove(query, (error, data) => {
    if (error) {
      res.status(400).json({ status: "Fail", data: error });
    } else {
      res.status(200).json({ status: "Success", data: data });
    }
  });
};

//Task Update Status

exports.updateTaskStatus = (req, res) => {
  let id = req.params.id;
  let status = req.params.status;
  let query = { _id: id };
  let reqBody = { status: status };

  TaskModel.updateOne(query, reqBody, (error, data) => {
    if (error) {
      res.status(400).json({ status: "Fail", data: error });
    } else {
      res.status(200).json({ status: "Success", data: data });
    }
  });
};

// List Task By status

exports.listTaskByStatus = (req, res) => {
  let status = req.params.status;
  let email = req.headers["email"];
  TaskModel.aggregate(
    [
      { $match: { status: status, email: email } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createdDate: {
            $dateToString: { format: "%d-%m-%Y", date: "$createdDate" },
          },
        },
      },
    ],
    (error, data) => {
      if (error) {
        res.status(400).json({ status: "Fail", data: error });
      } else {
        res.status(200).json({ status: "Success", data: data });
      }
    }
  );
};

// Task Status Count

exports.taskStatusCount = (req, res) => {
  let email = req.headers["email"];
  TaskModel.aggregate(
    [
      { $match: { email: email } },
      { $group: { _id: "$status", sum: { $count: {} } } },
    ],
    (error, data) => {
      if (error) {
        res.status(400).json({ status: "Fail", data: error });
      } else {
        res.status(200).json({ status: "Success", data: data });
      }
    }
  );
};


