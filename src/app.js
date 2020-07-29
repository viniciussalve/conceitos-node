const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

function checkId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ message: "id invalido"});
  };

  return next()
}

function checkIndexPosition(request, response, next) {
  const { id } = request.params;
  const projectIndex = repositories.findIndex(project => project.id === id);
  
  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  };

  response.locals.projectIndex = projectIndex;
  return next()
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const project = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(project);

  return response.json(project)
});

app.put("/repositories/:id", checkId, checkIndexPosition, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const { projectIndex } = response.locals;

  const likes = repositories[projectIndex].likes;
  const project = { id, title, url, techs, likes}

  repositories[projectIndex] = project;
  return response.json(project);
});

app.delete("/repositories/:id", checkId, checkIndexPosition, (request, response) => {
  const { projectIndex } = response.locals;

  repositories.splice(projectIndex, 1);
  return response.status(204).send();
})

app.post("/repositories/:id/like", checkId, checkIndexPosition, (request, response) => {
  const { projectIndex } = response.locals;
  repositories[projectIndex].likes++
  return response.json(repositories[projectIndex])
});

module.exports = app;
