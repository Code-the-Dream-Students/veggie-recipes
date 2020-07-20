let test1 = "./app.json";

fetch(test1)
.then(response => response.json())
.then(data => {
  console.log(data);
});

