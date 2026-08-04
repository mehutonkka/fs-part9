interface HeaderProps {
  courseName: string;
}

interface CoursePart {
  name: string;
  exerciseCount: number;
}

interface ContentProps {
  courseParts: CoursePart[];
}

interface TotalProps {
  courseParts: CoursePart[];
}

const Header = ( props: HeaderProps ) => {
  return (
    <h1>{props.courseName}</h1>
  );
}

const Content = ( props: ContentProps ) => {
  return (
    <div>
      {props.courseParts.map((part) => (
        <p key={part.name}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </div>
  );
}

const Total = ( props: TotalProps ) => {
  const totalExercises = props.courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  return (
    <p>
      Number of exercises {totalExercises}
    </p>
  );
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];


  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;