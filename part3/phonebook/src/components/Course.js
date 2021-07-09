import React from "react";

const Header = ({ course }) => {
  return <h1>{course.name}</h1>;
};

const Total = ({ course }) => {
  const sum = course.parts
    .map((part) => part.exercises)
    .reduce((acc, curr) => acc + curr);
  return (
    <p>
      <b>Number of exercises {sum}</b>
    </p>
  );
};

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
};

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map((p) => (
        <Part part={p} key={p.name}></Part>
      ))}
    </div>
  );
};

const Course = ({ courses }) => {
  // console.log(course.parts.map((a) => a.name));
  // console.log(course.parts.map((part) => part.exercises));
  // console.log(courses.map((course) => course.parts));

  return (
    <div>
      {courses.map((course) => {
        return (
          <div key={course.name}>
            <Header course={course}></Header>
            <Content course={course}></Content>
            <Total course={course}></Total>
          </div>
        );
      })}
    </div>
  );
};

export default Course;
